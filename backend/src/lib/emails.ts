import { memoize } from 'lodash';
import path from 'path';
import fg from 'fast-glob';
import fs from 'fs/promises';
import { env } from './env';
import { Idea, User } from '@prisma/client';


const getHtmlTemplates = memoize(async () => {
  const htmlPathsPattern = path.resolve(__dirname, '..', 'emails/dist/**/*.html');
  const htmlPaths = fg.sync(htmlPathsPattern);

  const htmlTemplates: Record<string, string> = {};

  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html');
    htmlTemplates[templateName] = await fs.readFile(htmlPath, 'utf8');
  }

  return htmlTemplates;
});

const getHtmlTemplate = async (templateName: string) => {
  const htmlTemplates = await getHtmlTemplates();

  return htmlTemplates[templateName];
};

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string;
  subject: string;
  templateName: string;
  templateVariables: Record<string, any>;
}) => {
  try {
    const htmlTemplate = await getHtmlTemplate(templateName);
    const fullTemplateVariables = {
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    };

    console.info('sendEmail', {
      to, subject, templateName, fullTemplateVariables, htmlTemplate
    });

    return { ok: true };
  }
  catch (error) {
    console.error('error', error);

    return { ok: false };
  }
}

export const sendWelcomeEmail = async ({
  user,
}: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks for registration',
    templateName: 'welcome',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: `${env.WEBAPP_URL}/ideas/new`,
    },
  });
};

export const sendIdeaBlockedEmail = async ({
  user,
  idea,
}: {
  user: Pick<User, 'nick' | 'email'>,
  idea: Pick<Idea, 'nick'>,
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Your idea blocked!',
    templateName: 'ideaBlocked',
    templateVariables: {
      userNick: user.nick,
    },
  });
};
