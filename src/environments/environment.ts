// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

interface EnvConfig {
  baseUrl: String,
  pingUrl: String,
  pingRedirectUrl: String,
  clientId: String,
  envValue: String,
}

export const environment = (host: string): EnvConfig => {
  const options = {
    baseUrl: 'https://shipitapi-qa.volvogroup.com/apigw',
    pingUrl: 'https://federate-qa.volvo.com',
    pingRedirectUrl: 'https://shipitapi-qa.volvogroup.com/ui/xtr',
    clientId: 'shipit',
    envValue: 'qa',
  }

  switch (host) {
    case 'localhost':
      return {
        ...options,
        pingRedirectUrl: 'https://localhost:4200',
        envValue: 'local',
      }
    case 'https://shipitapi-dev.volvogroup.com':
      return {
        ...options,
        pingRedirectUrl: 'https://shipitapi-dev.volvogroup.com/ui/xtr',
        envValue: 'development',
      }
    case 'https://shipitapi-test.volvogroup.com':
      return {
        ...options,
        pingRedirectUrl: 'https://shipitapi-test.volvogroup.com/ui/xtr',
        envValue: 'test',
      }
    case 'https://shipitapi-qa.volvogroup.com':
      return {
        ...options,
        pingRedirectUrl: 'https://shipitapi-qa.volvogroup.com/ui/xtr',
        envValue: 'qa',
      }
    case 'https://shipitapi.volvogroup.com':
      return {
        ...options,
        baseUrl: 'https://shipitapi.volvogroup.com/apigw',
        pingUrl: 'https://federate.volvo.com',
        pingRedirectUrl: 'https://shipitapi.volvogroup.com/ui/xtr',
        envValue: 'prod',
      }
    default:
      throw new Error(`unexpected host: ${host}`)
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
