import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './interface/task.interface';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAllTasks(filterDto: GetTaskFilterDto, user: User) {
    this.logger.debug('get all tasks route');
    const { search, status } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    this.logger.debug('create task route');
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async getTask(id: string) {
    this.logger.debug(`get task by id: ${id}`);
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);

    return task;
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    this.logger.debug(`update task status by id: ${id}`);

    const task = await this.getTask(id);

    const updatedTask = { ...task, status };

    await this.taskRepository.save(updatedTask);

    return updatedTask;
  }

  async deleteTask(id: string) {
    this.logger.debug(`delete task by id: ${id}`);

    const task = await this.getTask(id);

    await this.taskRepository.remove(task);

    return {
      message: 'Task deleted successfully',
      id,
    };
  }
}
