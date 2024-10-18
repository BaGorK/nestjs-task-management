import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './interface/task.interface';
import { v4 as uuid } from 'uuid';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private logger = new Logger(TasksService.name);
  private tasks: Task[] = [];

  getHello(): string {
    return 'Hello World!';
  }

  getAllTasks() {
    this.logger.debug('get all tasks route');
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTaskFilterDto) {
    let tasks = this.getAllTasks();

    let { limit, page } = filterDto;
    const { status, search } = filterDto;

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }

        return false;
      });
    }

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (page || limit) {
      limit = limit || 10;
      page = page || 1;

      const skip = (page - 1) * limit;

      tasks = tasks.slice(skip, skip + limit);
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto) {
    this.logger.debug('create task route');
    const task: Task = {
      id: uuid(),
      ...createTaskDto,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  getTask(id: string) {
    this.logger.debug(`get task by id: ${id}`);
    const task = this.tasks.find((task) => task.id === id);

    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);

    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    this.logger.debug(`update task status by id: ${id}`);

    const task = this.getTask(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);

    const updatedTask = { ...task, status };

    this.tasks.push(updatedTask);

    return updatedTask;
  }

  deleteTask(id: string) {
    this.logger.debug(`delete task by id: ${id}`);

    const task = this.getTask(id);

    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);

    this.tasks = this.tasks.filter((task) => task.id !== id);

    return {
      message: 'Task deleted successfully',
      id,
    };
  }
}
