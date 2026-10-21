import * as migration_20261021_123129_initial from './20261021_123129_initial';

export const migrations = [
  {
    up: migration_20261021_123129_initial.up,
    down: migration_20261021_123129_initial.down,
    name: '20261021_123129_initial'
  },
];
