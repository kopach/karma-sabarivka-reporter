/* tslint:disable */
// @ts-ignore // TODO: remove this

import * as fs from 'fs';
import { createFsFromVolume, vol } from 'memfs';
import { ufs } from 'unionfs';

/**
 * Factory that provides the real file-system union-d with an in-memory one.
 *
 * Files that don't exist in the in-memory FS will be read from the underlying
 * real file system, while any writes will take place on the in-memory FS>
 *
 * @returns {typeof fs}
 */
const mockFsFactory = () => {
  const fs = require('fs');
  beforeEach(() => vol.mkdirSync(process.cwd(), { recursive: true }));
  afterEach(() => vol.reset());

  return ufs.use(fs as any).use(createFsFromVolume(vol) as any);
};

export = mockFsFactory;
