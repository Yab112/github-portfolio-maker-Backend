// tests/setup.js
import { setupDB, teardownDB, clearDB } from './helpers.js';

// Global test setup
beforeAll(async () => await setupDB());
afterAll(async () => await teardownDB());
afterEach(async () => await clearDB());