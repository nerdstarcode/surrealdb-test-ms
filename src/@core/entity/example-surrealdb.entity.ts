import { Inject, Injectable } from '@nestjs/common';
import { RecordId, Surreal } from 'surrealdb';
import { SurrealDBConnection } from '../infrastructure/surrealdb/surrealdb.connection';
import { UtilsSurrealDB } from './utils/utils-surrealdb.entity';

export interface UserEntity {
  id: RecordId<string, string>;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
}

export interface CreateUserDto extends Omit<UserEntity, 'id' | 'createdAt'> { }
export interface UpdateUserDto extends Partial<Pick<CreateUserDto, 'name' | 'email'>> {
  name?: string;
  age?: number;
}

@Injectable()
export class UserService extends UtilsSurrealDB {
  private db: Surreal;
  constructor(
    @Inject('SURREALDB_CONNECTION')
    private readonly surreal: SurrealDBConnection,
  ) {
    super();
    this.db = this.surreal.getClient()
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    const recordId = new RecordId('user', crypto.randomUUID());
    const response = await this.db.create<UserEntity>(recordId).content(
      {
        ...data,
        createdAt: new Date(),
      }
    );

    return response
  }

  async getUserByID(id: string): Promise<UserEntity | undefined> {
    const recordId = new RecordId('user', id);
    const response = await this.db.select<UserEntity>(recordId);
    return response
  }

  async getUserAllUsersWithFilters(filters?: UserEntity, page?: number, limit?: number): Promise<UserEntity[]> {

    const start = page && limit ? (page - 1) * limit : 0;
    const { where, params } = this.generateFilterQuery(filters);
    const query = `
      SELECT * FROM user
      ${where}
      LIMIT $limit
      START $start
    `;

    const response = await this.db.query<UserEntity[][]>(query, {
      ...params,
      limit,
      start,
    });
    return response[0] || [];
  }

  async countTotalUsersWithFilters(filters?: UserEntity): Promise<number | unknown> {
    const { where, params } = this.generateFilterQuery(filters);
    const query = `
      SELECT count() AS count FROM user
      ${where}
    `;

    const response: any = await this.db.query(query, {
      ...params,
    });
    return response[0]?.[0]?.count || 0;
  }
}