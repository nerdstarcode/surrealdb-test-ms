import { Module } from '@nestjs/common';
import { SurrealDBConnection } from './surrealdb.connection';
import { loadSurrealDBConfig } from '../../modules/surrealdb/utils/config';

@Module({
  providers: [
    {
      provide: 'SURREALDB_CONNECTION',
      useFactory: async () => {
        const config = loadSurrealDBConfig();
        const connection = new SurrealDBConnection(config.uri, config.namespace, config.database);
        await connection.connect();
        return connection;
      },
    },
  ],
  exports: ['SURREALDB_CONNECTION'],
})
export class SurrealDBInfrastructureModule {}