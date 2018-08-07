const { fork } = require('child_process');
const util = require('util');
const numCPUs = require('os').cpus().length;

const tasks = new Array(200).fill(1).map((__dirname, index) => index + 1);
const tasksLength = tasks.length;
const getNextTask = () => tasks.shift();

let workers = [];
const results = [];

const isDebug = typeof v8debug === 'object' || /--debug|--inspect/.test(process.execArgv.join(' '));
const debugPort = isDebug ? parseInt(process.execArgv.find((argv) => /--debug|--inspect/.test(argv)).split('=')[1]) : null;

for (let i = 0; i < 4; i++) {
  const worker = fork(`${__dirname}/worker.js`, [], isDebug ? { execArgv: [`--inspect=${debugPort + i + 1}`] } : null);
  workers.push(worker.pid);

  worker.on('message', ({ workerId, status, taskId, response }) => {
    if (taskId) {
      results.push({
        taskId,
        response
      });
    }

    if (status === 'ready') {
      const nextTaskId = getNextTask();

      if (nextTaskId) {
        worker.send({ taskId: nextTaskId });
      } else {
        worker.kill()
      }
    }
  });

  worker.on('exit', () => {
    workers = workers.filter((workerId) => workerId !== worker.pid);

    if (workers.length === 0 || (results.length >= tasksLength)) {
      process.stdout.write('\nJOB COMPLETE!\n');
      // process.stdout.write(util.inspect(results.slice(20, 30), { showHidden: false, depth: null }));
      process.exit();
    }
  });
}