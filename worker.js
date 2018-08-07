const util = require('util');

const parse = require('./parse');

process.on('message', ({ taskId }) => {
  // process.stdout.write(`- worker#${process.pid} received task "${taskId}"\n`);

  parse(taskId)
    .then((response) => process.send({
      workerId: process.pid,
      status: 'ready',
      taskId,
      response
    }));
});

process.send({
  workerId: process.pid,
  status: 'ready'
});