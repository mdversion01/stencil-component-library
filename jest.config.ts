// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: '@stencil/core/testing',         // important: let Stencil handle env
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testTimeout: 30000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};

export default config;
