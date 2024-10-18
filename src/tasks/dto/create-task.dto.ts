import { TaskStatus } from '../interface/task.interface';

export class CreateTaskDto {
  title: string;
  description: TaskStatus;
}
