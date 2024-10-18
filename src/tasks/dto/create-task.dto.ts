import { IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../interface/task.interface';

export class CreateTaskDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  description: TaskStatus;
}
