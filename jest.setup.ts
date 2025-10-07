// jest.setup.ts

// Mock floating-ui autoUpdate to avoid native DOM bindings
jest.mock('@floating-ui/dom', () => {
  return {
    autoUpdate: jest.fn(() => {
      return () => {}; // mock cleanup fn
    }),
    computePosition: jest.fn(() =>
      Promise.resolve({
        x: 0,
        y: 0,
        placement: 'bottom',
        middlewareData: {},
      })
    ),
  };
});

// Mock ResizeObserver if used
global.ResizeObserver = class {
  observe() {}
  disconnect() {}
  unobserve() {}
};
