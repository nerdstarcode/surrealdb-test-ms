import { Injectable } from '@nestjs/common';
import { UserService, CreateUserDto, UpdateUserDto, UserEntity } from '../../@core/entity/example-surrealdb.entity';
import fi from 'zod/v4/locales/fi.js';
import { stat } from 'fs';

@Injectable()
export class ModuleNameService {
  constructor(private readonly userService: UserService) { }

  async createUser(data: CreateUserDto) {
    return this.userService.create(data);
  }

  async updateUser(id: string, data: UpdateUserDto) {
    //    return this.userService.update(id, data);
  }

  async findUserById(id: string) {
    return this.userService.getUserByID(id);
  }

  async findAllUsers(filters?: UserEntity, page: number = 1, limit: number = 10) {
    try {
      const usersResultPromise = this.userService.getUserAllUsersWithFilters(filters, page, limit)
      const totalCountPromise = this.userService.countTotalUsersWithFilters(filters)
      return {
        status: 200,
        data: await usersResultPromise,
        meta: {
          total: await totalCountPromise,
          page,
          limit,
          ...(filters || {})
        }
      }
    } catch (err) {
      console.error('Error finding users:', err);
      return {
        status: 500,
        error: 'An error occurred while fetching users',
        message: err instanceof Error ? err.message : 'Unknown error',
        meta: {
          page,
          limit,
          ...(filters || {})
        }
      }
    }
  }
}