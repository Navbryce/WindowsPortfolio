export function formatEnvironment (environment) {
    const port = environment.backend.port.length !== 0 ? ':' + environment.backend.port
    : '';
    // create the full property
    environment.backend['full'] = environment.backend.ip + port;
    return environment;
}
