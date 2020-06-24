/* tslint:disable */
// @ts-ignore // TODO: remove this
// TODO: memory FS doesn't work as some of karma's dependencies (e.g. log4js) uses `fs-extra` instead of `fs`
// therefore mocking `fs` doesn't work. Maybe, later with update of dependencies - that will work

const fs = require('fs');
const fse = require('fs-extra');
const gfs = require('graceful-fs');

const { ufs } = require('unionfs');
import { createFsFromVolume, vol } from 'memfs';
const { patchFs, patchRequire } = require('fs-monkey');

import { spyFs } from './spy-fs';
const { sfsFS } = spyFs(vol);

export const mockFs = () => {
  ufs
    .use(sfsFS)
    // .use(sfsFSE)
    .use({ ...fse })
    .use(createFsFromVolume(vol));

  patchFs(ufs, fse);
  patchRequire(ufs, fse);

  patchFs(ufs, gfs);
  patchRequire(ufs, gfs);

  patchFs(ufs, fs);
  patchRequire(ufs, fs);

  // fs.writeFileSync('./hello.txt', 'Are you there?'); // This writes a real file in the current dir
  fse.writeFileSync('/hello.txt', ">>>>>> You're in the matrix!"); // this writes a virtual file into memory

  // we can read back both with "fs":
  // console.log(fs.readFileSync('./hello.txt', 'utf8'));
  // console.log(fs.readFileSync('/hello.txt', 'utf8'));

  // ===================================
  return vol;
};
