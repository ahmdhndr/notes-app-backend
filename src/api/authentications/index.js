const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentication',
  version: '1.0.0',
  register: async (
    server,
    {
      // prettier-ignore
      authenticationsService,
      usersService,
      tokenManager,
      validator,
      // eslint-disable-next-line comma-dangle
    }
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      // eslint-disable-next-line comma-dangle
      validator
    );

    server.route(routes(authenticationsHandler));
  },
};
