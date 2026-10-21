import * as migration_20261021_123129_initial from './20261021_123129_initial';
import * as migration_20261021_140544_storage_fields from './20261021_140544_storage_fields';

export const migrations = [
  {
    up: migration_20261021_123129_initial.up,
    down: migration_20261021_123129_initial.down,
    name: '20261021_123129_initial',
  },
  {
    up: migration_20261021_140544_storage_fields.up,
    down: migration_20261021_140544_storage_fields.down,
    name: '20261021_140544_storage_fields'
  },
];
