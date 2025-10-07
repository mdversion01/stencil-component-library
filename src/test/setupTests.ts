// src/test/setupTests.ts

jest.setTimeout(30000);

// Keep the lightweight mocks so dropdown doesn't hang
jest.mock('@popperjs/core', () => ({
  createPopper: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
  Instance: class {},
}));
jest.mock('@floating-ui/dom', () => ({
  autoUpdate: jest.fn(() => jest.fn()),
}));

// Make elements "visible" for offsetParent checks in specs
Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
  configurable: true,
  get() {
    return this.parentElement || {};
  },
});
