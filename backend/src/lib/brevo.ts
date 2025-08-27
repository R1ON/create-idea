import axios, { AxiosResponse } from 'axios';
import { pick } from 'lodash';

import { env } from './env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

type MakeRequestToBrevoResponse = Promise<{
  originalResponse?: AxiosResponse;
  loggableResponse: Pick<AxiosResponse, 'status' | 'statusText' | 'data'>;
}>;

const makeRequestToBrevo = async ({ data, path }: {
  path: string;
  data: Record<string, AnyType>;
}): MakeRequestToBrevoResponse => {
  if (!env.BREVO_API_KEY) {
    return {
      loggableResponse: {
        status: 200,
        statusText: 'OK',
        data: { message: 'BREVO_API_KEY is not set' },
      },
    };
  }

  const response = await axios({
    method: 'POST',
    url: `https://api.brevo.com/v3/${path}`,
    headers: {
      'api-key': env.BREVO_API_KEY,
    },
    data,
  });

  return {
    originalResponse: response,
    loggableResponse: pick(response, ['status', 'statusText', 'data']),
  }
}

export const sendEmailThroughBrevo = async ({ to, subject, html }: {
  to: string;
  subject: string;
  html: string;
}) => {
  return await makeRequestToBrevo({
    path: 'smtp/email',
    data: {
      subject,
      htmlContent: html,
      sender: { email: env.FROM_EMAIL_ADDRESS, name: env.FROM_EMAIL_ADDRESS },
      to: [{ email: to }],
    },
  });
}

