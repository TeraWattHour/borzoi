export const assureBorzoiGlobals = () => {
  if (!global.borzoi) {
    global.borzoi = {
      options: {},
      responseInterceptors: [],
      requestInterceptors: [],
    };
  }

  if (!global.borzoi.options) {
    global.borzoi.options = {};
  }

  if (!global.borzoi.responseInterceptors) {
    global.borzoi.responseInterceptors = [];
  }

  if (!global.borzoi.requestInterceptors) {
    global.borzoi.requestInterceptors = [];
  }
};
