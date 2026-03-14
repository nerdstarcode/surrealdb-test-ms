import { Module } from '@nestjs/common';
import { ModuleNameController } from './modulename.controller';
import { ModuleNameService } from './modulename.service';
import { UserService } from '../../@core/entity/example-surrealdb.entity';
import { SurrealDBInfrastructureModule } from '../../@core/infrastructure/surrealdb/surrealdb.infrastructure.module';
import { VaccineTableEntity } from 'src/@core/entity/vaccine-table-surrealdb.entity';

@Module({
  imports: [SurrealDBInfrastructureModule],
  controllers: [ModuleNameController],
  providers: [ModuleNameService, UserService, VaccineTableEntity],
})
export class ModuleNameModule {}