import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'testdb',
  connector: 'memory',
  localStorage: '',
  file: false, // Don't persist to file in tests
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
@lifeCycleObserver('datasource')
export class TestDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'testdb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.testdb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
