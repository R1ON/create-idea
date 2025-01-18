export const getAllIdeasRoute = () => '/';

export const ideaParams = { nick: ':nick' };
export const getIdeaRoute = ({ nick }: typeof ideaParams) => (
    `/idea/${nick}`
);

export const getNewIdeaRoute = () => '/ideas/new';

export const getSignUpRoute = () => '/sign-up';
export const getSignInRoute = () => '/sign-in';
export const getSignOutRoute = () => '/sign-out';
