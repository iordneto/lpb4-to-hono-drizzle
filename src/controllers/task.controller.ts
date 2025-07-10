import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
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
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Task} from '../models';
import {TaskRepository} from '../repositories';

@authenticate('jwt')
export class TaskController {
  constructor(
    @repository(TaskRepository)
    public taskRepository: TaskRepository,
    @inject(SecurityBindings.USER)
    public currentUser: UserProfile,
  ) {}

  @post('/tasks')
  @response(200, {
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
    return this.taskRepository.create({
      ...task,
      userId: this.currentUser.id,
    });
  }

  @get('/tasks/count')
  @response(200, {
    description: 'Task model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(): Promise<Count> {
    return this.taskRepository.count({userId: this.currentUser.id});
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
    // Filter tasks by current user
    const userFilter = {
      ...filter,
      where: {
        ...filter?.where,
        userId: this.currentUser.id,
      },
    };
    return this.taskRepository.find(userFilter);
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

    // Verify if task belongs to the current user
    if (task.userId !== this.currentUser.id) {
      throw new Error('Task not found');
    }

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
    // Verify if task belongs to the current user
    const existingTask = await this.taskRepository.findById(id);
    if (existingTask.userId !== this.currentUser.id) {
      throw new Error('Task not found');
    }

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
    // Verify if task belongs to the current user
    const existingTask = await this.taskRepository.findById(id);
    if (existingTask.userId !== this.currentUser.id) {
      throw new Error('Task not found');
    }

    await this.taskRepository.replaceById(id, {
      ...task,
      userId: this.currentUser.id, // Ensure userId is preserved
    });
  }

  @del('/tasks/{id}')
  @response(204, {
    description: 'Task DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    // Verify if task belongs to the current user
    const existingTask = await this.taskRepository.findById(id);
    if (existingTask.userId !== this.currentUser.id) {
      throw new Error('Task not found');
    }

    await this.taskRepository.deleteById(id);
  }

  @patch('/tasks/{id}/complete')
  @response(204, {
    description: 'Mark task as completed',
  })
  async markAsCompleted(@param.path.string('id') id: string): Promise<void> {
    // Verify if task belongs to the current user
    const existingTask = await this.taskRepository.findById(id);
    if (existingTask.userId !== this.currentUser.id) {
      throw new Error('Task not found');
    }

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
    // Verify if task belongs to the current user
    const existingTask = await this.taskRepository.findById(id);
    if (existingTask.userId !== this.currentUser.id) {
      throw new Error('Task not found');
    }

    await this.taskRepository.updateById(id, {
      completed: false,
      updatedAt: new Date(),
    });
  }
}
