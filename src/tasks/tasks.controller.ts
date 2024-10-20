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

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('hello')
  getHello(): string {
    return this.tasksService.getHello();
  }

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto) {
    return this.tasksService.getAllTasks(filterDto);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':id')
  getTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getTask(id);
  }

  @Patch(':id')
  updateTaskStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: { status: TaskStatus },
  ) {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.deleteTask(id);
  }
}
