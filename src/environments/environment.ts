import { formatEnvironment } from './environment.function';
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const rawEnvironment = {
  production: false,
  backend: {
    ip: 'http://localhost',
    port: '8080'
  },
  resumePath: '/resume.pdf',
};


export const environment = formatEnvironment(rawEnvironment);
