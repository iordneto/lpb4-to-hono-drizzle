import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Task} from '../models';
import {TaskRepository} from '../repositories';

export class TaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
  ) {}

  @post('/tasks')
  @response(201, {
    description: 'Task model instance',
    content: {'application/json': {schema: getModelSchemaRef(Task)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {
            title: 'NewTask',
            exclude: ['id', 'createdAt', 'updatedAt'],
          }),
        },
      },
    })
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Task> {
    // TODO: Get userId from JWT token
    const userId = '1'; // Placeholder
    return this.taskRepository.create({
      ...task,
      userId,
    });
  }

  @get('/tasks/count')
  @response(200, {
    description: 'Task model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Task) where?: Where<Task>): Promise<Count> {
    return this.taskRepository.count(where);
  }

  @get('/tasks')
  @response(200, {
    description: 'Array of Task model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Task, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Task) filter?: Filter<Task>): Promise<Task[]> {
    // TODO: Filter by userId from JWT token
    return this.taskRepository.find(filter);
  }

  @get('/tasks/{id}')
  @response(200, {
    description: 'Task model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Task, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Task, {exclude: 'where'}) filter?: FilterExcludingWhere<Task>,
  ): Promise<Task> {
    const task = await this.taskRepository.findById(id, filter);
    // TODO: Verify if task belongs to the logged user
    return task;
  }

  @patch('/tasks/{id}')
  @response(204, {
    description: 'Task PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    task: Partial<Task>,
  ): Promise<void> {
    // TODO: Verify if task belongs to the logged user
    await this.taskRepository.updateById(id, {
      ...task,
      updatedAt: new Date(),
    });
  }

  @put('/tasks/{id}')
  @response(204, {
    description: 'Task PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() task: Task,
  ): Promise<void> {
    // TODO: Verify if task belongs to the logged user
    await this.taskRepository.replaceById(id, task);
  }

  @del('/tasks/{id}')
  @response(204, {
    description: 'Task DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    // TODO: Verify if task belongs to the logged user
    await this.taskRepository.deleteById(id);
  }

  @patch('/tasks/{id}/complete')
  @response(204, {
    description: 'Mark task as completed',
  })
  async markAsCompleted(@param.path.string('id') id: string): Promise<void> {
    // TODO: Verify if task belongs to the logged user
    await this.taskRepository.updateById(id, {
      completed: true,
      updatedAt: new Date(),
    });
  }

  @patch('/tasks/{id}/uncomplete')
  @response(204, {
    description: 'Mark task as uncompleted',
  })
  async markAsUncompleted(@param.path.string('id') id: string): Promise<void> {
    // TODO: Verify if task belongs to the logged user
    await this.taskRepository.updateById(id, {
      completed: false,
      updatedAt: new Date(),
    });
  }
}
