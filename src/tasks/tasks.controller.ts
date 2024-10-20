import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './interface/task.interface';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('hello')
  getHello(): string {
    return this.tasksService.getHello();
  }

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto, @GetUser() user: User) {
    return this.tasksService.getAllTasks(filterDto, user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get(':id')
  getTask(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.tasksService.getTask(id, user);
  }

  @Patch(':id')
  updateTaskStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: { status: TaskStatus },
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTaskStatus(
      id,
      updateTaskStatusDto.status,
      user,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  deleteTask(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.tasksService.deleteTask(id, user);
  }
}
