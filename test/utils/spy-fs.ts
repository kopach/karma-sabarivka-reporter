/* tslint:disable */
// @ts-ignore // TODO: remove this

const fse = require('fs-extra');
const fs = require('fs');
import { spy } from 'spyfs';

const fsBak = { ...fs };

export function spyFs(memfs) {
  return {
    sfsFS: spy(fs, action => {
      if (action.isAsync) {
        return;
      }

      const path = action.args[0];
      if (!fsExistsSync(path)) {
        createEmptyFile(memfs, path);
      }
    }),
    sfsFSE: spy(fse, action => {
      console.log('FS-E: ', action.args[0], action.method);
    }),
  };
}

function createEmptyFile(memfs: any, path: any) {
  memfs.closeSync(memfs.openSync(path, 'w'));
}

function fsExistsSync(path) {
  try {
    fsBak.accessSync(path, fsBak.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}
