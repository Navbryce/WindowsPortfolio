import { formatEnvironment } from './environment.function';

const rawEnvironment = {
  production: true,
  backend: {
    ip: '',
    port: ''
  },
  resumePath: '/resume.pdf',
};

export const environment = formatEnvironment(rawEnvironment);
