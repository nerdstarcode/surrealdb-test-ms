import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { _HealthResolverModule } from './modules/_HealthResolver/_HealthResolver.module';
import { McpModule } from '@nestjs-mcp/server';
import { ConfigModule } from '@nestjs/config';
import { ModuleNameController } from './modules/ModuleName/modulename.controller';
import { RedisModule } from './@core/infrastructure/redis/redis.infrastrucutre.module';
import { _RedisClientModule } from './modules/_RedisClient/_RedisClient.module';
import { MetricsGrafanaModule } from './@core/infrastructure/metrics-grafana/metrics-grafana.module';
import { TypegooseExampleModule } from './modules/TypegooseExample/typegoose-example.module';
import { RabbitMQInfrastructureModule } from './@core/infrastructure/rabbitmq/rabbitmq.infrastructure.module';
import { _RabbitMQClientModule } from './modules/_RabbitMQClient/_RabbitMQClient.module';
import { _SurrealDBModule } from './modules/_SurrealDB/_SurrealDB.module';

@Module({
  imports: [
    MetricsGrafanaModule,
    // RabbitMQInfrastructureModule,
    // RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    _SurrealDBModule,
    // _RedisClientModule,
    // _RabbitMQClientModule,
    _HealthResolverModule,
    McpModule.forRoot({
      name: 'My MCP Server',
      version: '1.0.0',
      logging: { level: 'verbose', enabled: true },
      transports: {
        streamable: { enabled: true }
      },
    }),
  ],
  controllers: [AppController, ModuleNameController],
  providers: [AppService],
})
export class AppModule { }
