const jestFn = () => jest.fn();

const interceptors = {
  request: { use: jestFn() },
  response: { use: jestFn() },
};

const create = () => ({
  defaults: { headers: { common: {} } },
  interceptors,
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
});

const axios = { create };

module.exports = axios;
