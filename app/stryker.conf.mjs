/** @type {import('@stryker-mutator/core').PartialStrykerOptions} */
const config = {
  testRunner: 'vitest',
  mutate: ['src/core/**/*.ts'],
  thresholds: {
    high: 80,
    low: 75,
    break: 80,
  },
};

export default config;
