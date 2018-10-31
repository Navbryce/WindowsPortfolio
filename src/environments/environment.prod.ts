import { formatEnvironment } from './environment.function';

const rawEnvironment = {
  production: true,
  backend: {
    ip: '',
    port: ''
  }
};

export const environment = formatEnvironment(rawEnvironment);
