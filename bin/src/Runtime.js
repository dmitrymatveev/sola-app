
const PRIVATE = new WeakMap();

class Runtime {
  constructor() {

    var queues = {
      setUp: [],
      beforeRender: [],
      render: [],
      afterRender: [],
      tearDown: []
    };

    PRIVATE.set(this, {queues})
  }

  schedule(task, runtime) {
    var queue = PRIVATE.get(this).queues[runtime];
    if (queue === undefined) {
      throw new Error(`[SolaApp] runtime queue with the name ${runtime} does not exist`);
    }

    queue.push(task);
  }

  scheduleTasks(obj) {

  }

  _exec_run_circle() {

  }
}

function WorkerTaskDelegate(task, callback) {
  task(callback);
}

module.exports = Runtime;
