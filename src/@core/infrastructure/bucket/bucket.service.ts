import { Inject, Injectable, Logger } from "@nestjs/common";
import { SurrealDBConnection } from "src/@core/infrastructure/surrealdb/surrealdb.connection";
import { Surreal } from "surrealdb";
const logger = new Logger('BucketService')

@Injectable()
export class BucketService {
  private db: Surreal
  constructor(
    @Inject("SURREALDB_CONNECTION")
    private readonly surreal: SurrealDBConnection
  ) {
    this.db = this.surreal.getClient()
  }

  async createBucket(name: string) {
    try {
      await this.db.query(`DEFINE BUCKET ${name}`);
    } catch (err) {
      logger.error('Error creating bucket', err)
      throw err;
    }
  }

  async deleteBucket(name: string) {
    try {
      await this.db.query(`REMOVE BUCKET ${name}`);
    } catch (err) {
      logger.error('Error removing buckets', err)
      throw err;
    }
  }

  async listBuckets() {
    try {
      const res = await this.db.query<any[]>(`INFO FOR DB`);
      logger.log(res)
      return res[0]?.result?.buckets;
    } catch (err) {
      logger.error('Error listing buckets', err)
      throw err;
    }
  }
}