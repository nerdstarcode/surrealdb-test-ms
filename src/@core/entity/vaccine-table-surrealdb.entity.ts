import { Inject, Injectable, Logger } from '@nestjs/common';
import { RecordId, Surreal } from 'surrealdb';
import { SurrealDBConnection } from '../infrastructure/surrealdb/surrealdb.connection';
import { UtilsSurrealDB } from './utils/utils-surrealdb.entity';
const logger = new Logger("Vaccine Entity");
export interface VaccineEntityDTO {
  id: RecordId<string, string>;
  created_at: Date;
  updated_at: Date;
  next_application: Date;
  record_ids: string[];
  vet_name: string;
  location: string;
}

export interface CreateVaccineDto extends Omit<VaccineEntityDTO, 'id' | 'created_at' | 'updated_at'> { }
export interface UpdateVaccineDto extends Partial<CreateVaccineDto> { }

@Injectable()
export class VaccineTableEntity extends UtilsSurrealDB {
  private db: Surreal;
  private nameTable: string = "vaccines";
  private startedTable: string = `
    DEFINE TABLE ${this.nameTable} TYPE NORMAL SCHEMAFULL PERMISSIONS NONE;
    -- ------------------------------
    -- FIELDS
    -- ------------------------------ 
    DEFINE FIELD created_at ON ${this.nameTable} TYPE datetime DEFAULT time::now() PERMISSIONS FULL;
    DEFINE FIELD location ON ${this.nameTable} TYPE string PERMISSIONS FULL;
    DEFINE FIELD next_application ON ${this.nameTable} TYPE datetime PERMISSIONS FULL;
    DEFINE FIELD record_ids ON ${this.nameTable} TYPE array<string> PERMISSIONS FULL;
    DEFINE FIELD record_ids.* ON ${this.nameTable} TYPE string PERMISSIONS FULL;
    DEFINE FIELD updated_at ON ${this.nameTable} TYPE datetime READONLY VALUE time::now() ASSERT time::now() PERMISSIONS FULL;
    DEFINE FIELD vet_name ON ${this.nameTable} TYPE string PERMISSIONS FULL;
  `;
  constructor(
    @Inject('SURREALDB_CONNECTION')
    private readonly surreal: SurrealDBConnection,
  ) {
    super();
    this.db = this.surreal.getClient();
  }

  onModuleInit() {
    this.startDatabase();
  }

  async startDatabase() {
    try {
      const infoDB = (await this.db.query<{ result: { tables: Record<string, string> } }[]>("INFO FOR DB"))
      const tables = Object.keys(infoDB[0]?.result?.tables);
      const tablesDoesntExist = !tables?.includes(this.nameTable);
      if (tablesDoesntExist) {
        logger.debug('starting table');
        await this.db.query(this.startedTable);
      }
    } catch (err) {
      logger.error("Error to start table");
      logger.error(err);
    }
  }

  async create(data: CreateVaccineDto): Promise<VaccineEntityDTO> {
    const recordId = new RecordId(this.nameTable, crypto.randomUUID());
    const response = await this.db.create<VaccineEntityDTO>(recordId).content(data);

    return response;
  }

  async getVaccineByID(id: string): Promise<VaccineEntityDTO | undefined> {
    const recordId = new RecordId(this.nameTable, id);
    const response = await this.db.select<VaccineEntityDTO>(recordId);
    return response;
  }

  async getVaccineAllVaccinesWithFilters(filters?: VaccineEntityDTO, page?: number, limit?: number): Promise<VaccineEntityDTO[]> {
    const start = page && limit ? (page - 1) * limit : 0;
    const { where, params } = this.generateFilterQuery(filters);
    const query = `
      SELECT * FROM ${this.nameTable}
      ${where}
      LIMIT $limit
      START $start
    `;

    const response = await this.db.query<VaccineEntityDTO[][]>(query, {
      ...params,
      limit,
      start,
    });
    return response[0] || [];
  }

  async countTotalVaccinesWithFilters(filters?: VaccineEntityDTO): Promise<number | unknown> {
    const { where, params } = this.generateFilterQuery(filters);
    const query = `
      SELECT count() AS count FROM ${this.nameTable}
      ${where}
    `;

    const response: any = await this.db.query(query, {
      ...params,
    });
    return response[0]?.[0]?.count || 0;
  }
}