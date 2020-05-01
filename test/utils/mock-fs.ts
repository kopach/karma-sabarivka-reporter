/* tslint:disable */
// @ts-ignore // TODO: remove this

const mock = require('mock-fs');

export function mockFs() {
  mock({
    '/hello.txt': "",
  });

  const fs = require('fs');
  fs.writeFileSync('/hello.txt', ">>>>>> You're in the matrix!"); // this writes a virtual file into memory

  return mock;
}
