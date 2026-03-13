import { Body, Controller, Get, Logger, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModuleNameService } from './modulename.service';
import type { CreateUserDto, UpdateUserDto, UserEntity } from 'src/@core/entity/example-surrealdb.entity';

const logger = new Logger('Module Name');
@Controller('moduleName')
// @UseGuards(JwtGuardGuard)
@ApiTags('ModuleName') export class ModuleNameController {
  constructor(private readonly moduleNameService: ModuleNameService) { }

  @Post('index')
  async index(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req: { url: string; user?: { email: string } },
    @Body() body: unknown,
  ) {
    logger.debug(`${req.url} called`);
    return
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.moduleNameService.createUser(createUserDto);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.moduleNameService.updateUser(id, updateUserDto);
  }

  @Get('users')
  async findAllUsers(@Res() res: any, @Query('filters') filters?: UserEntity, @Query('page') page?: number, @Query('limit') limit?: number) {
    const result = await this.moduleNameService.findAllUsers(filters, page, limit);
    res.setHeader('Content-Type', 'application/json');
    res.status(result?.status || 200).json(result);
  }

  @Get('users/:id')
  async findUserById(@Param('id') id: string) {
    return this.moduleNameService.findUserById(id);
  }
}
