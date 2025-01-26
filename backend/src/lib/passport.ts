import { Express } from 'express';
import { AppContext } from './ctx';
import { Passport } from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { env } from './env';

export const applyPassportToExpressApp = (expressApp: Express, ctx: AppContext) => {
  const passport = new Passport();

  passport.use(
    new JWTStrategy({
      secretOrKey: env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    }, async (jwtPayload: string, done) => {
      const user = await ctx.prisma.user
        .findUnique({
          where: { id: jwtPayload },
        })
        .catch((error) => done(error, false));

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    }),
  );

  expressApp.use((req, res, next) => {
    if (!req.headers.authorization) {
      return next();
    }

    passport.authenticate('jwt', { session: false })(req, res, next);
  });
};
