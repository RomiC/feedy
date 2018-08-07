const feed = require('./feed');
const parse = require('./parse');

const promises = new Array(200).fill(1).map((_, index) => parse(index));

Promise.all(promises)
  .then((results) => {
    process.stdout.write('\nJOB COMPLETE!\n');
  });