import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';

import {DbDataSource} from '../datasources';
import {Task, User, UserRelations} from '../models';
import {TaskRepository} from './task.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly tasks: HasManyRepositoryFactory<
    Task,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TaskRepository')
    protected taskRepositoryGetter: Getter<TaskRepository>,
  ) {
    super(User, dataSource);
    this.tasks = this.createHasManyRepositoryFactoryFor(
      'tasks',
      taskRepositoryGetter,
    );
    this.registerInclusionResolver('tasks', this.tasks.inclusionResolver);
  }
}
