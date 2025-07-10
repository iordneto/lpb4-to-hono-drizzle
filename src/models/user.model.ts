import {Entity, hasMany, model, property} from '@loopback/repository';
import {UserProfile, securityId} from '@loopback/security';

@model({
  settings: {
    hiddenProperties: ['password'],
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      columnName: 'id',
      dataType: 'uuid',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: Date;

  @hasMany(() => require('./task.model').Task)
  tasks: any[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  tasks?: any[];
}

export type UserWithRelations = User & UserRelations;

export function convertToUserProfile(user: User): UserProfile {
  return {
    [securityId]: user.id!,
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
