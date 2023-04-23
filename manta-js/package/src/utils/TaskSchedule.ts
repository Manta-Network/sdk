// 20 seconds timeout
const DEFAULT_TIME_OUT = 20000;
const DEFAULT_ERROR_TEXT = 'Request timeout, wallet is still busy';

type TaskFunc = (success: boolean) => unknown;

type TaskItem = {
  taskFunc: TaskFunc;
  timeoutStamp: number;
};

const currentTimestamp = () => Date.now();

export default class TaskSchedule {
  tasks: TaskItem[];
  isBusy: boolean;

  constructor() {
    this.tasks = [];
    this.isBusy = false;
  }

  wait(timeout = DEFAULT_TIME_OUT, errorText = DEFAULT_ERROR_TEXT) {
    return new Promise((resolve, reject) => {
      this.addTask((success) => {
        success ? resolve(true) : reject(new TaskTimeoutError(errorText));
      }, timeout);
      if (!this.isBusy) {
        this.next();
      }
    });
  }

  next() {
    this.cleanTimeoutTasks();
    if (this.tasks.length <= 0) {
      this.isBusy = false;
      return;
    }
    const taskItem = this.tasks.shift();
    this.isBusy = true;
    taskItem.taskFunc(true);
  }

  reset() {
    this.tasks.length = 0;
  }

  addTask(taskFunc: TaskFunc, timeout: number) {
    this.tasks.push({
      taskFunc,
      timeoutStamp: timeout ? currentTimestamp() + timeout : 0,
    });
  }

  cleanTimeoutTasks() {
    const taskLength = this.tasks.length;
    if (taskLength === 0) {
      return;
    }
    const timestamp = currentTimestamp();
    for (let i = taskLength - 1; i >= 0; i -= 1) {
      const task = this.tasks[i];
      if (task.timeoutStamp && task.timeoutStamp < timestamp) {
        this.tasks.splice(i, 1);
        task.taskFunc(false);
      }
    }
  }
}

export class TaskTimeoutError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'TaskTimeoutError';
    // Fix instanceof Not Working For Custom Errors in TypeScript, `ex instanceof TaskTimeoutError` will return false
    // https://www.dannyguo.com/blog/how-to-fix-instanceof-not-working-for-custom-errors-in-typescript
    Object.setPrototypeOf(this, TaskTimeoutError.prototype);
  }
}
