// 20 seconds timeout
const DEFAULT_TIME_OUT = 20000;
const DEFAULT_ERROR_TEXT = 'Request Timeout';

type TaskFunc = (success: boolean) => unknown;

type TaskItem = {
  taskFunc: TaskFunc;
  timeoutStamp: number;
};

const currentTimestamp = () => Date.now();

export default class TaskSchedule {
  tasks: TaskItem[];

  constructor() {
    this.tasks = [];
  }

  wait(timeout = DEFAULT_TIME_OUT, errorText = DEFAULT_ERROR_TEXT) {
    return new Promise((resolve, reject) => {
      this.addTask((success) => {
        success ? resolve(true) : reject(errorText);
      }, timeout);
      this.next();
    });
  }

  next() {
    this.cleanTasks();
    const taskItem = this.tasks.shift();
    if (!taskItem) {
      return;
    }
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

  cleanTasks() {
    const timestamp = currentTimestamp();
    this.tasks.forEach((task: TaskItem, index: number) => {
      if (task.timeoutStamp && task.timeoutStamp < timestamp) {
        this.tasks.splice(index, 1);
        task.taskFunc(false);
      }
    });
  }
}
