import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsSurrealDB {
  constructor() {
  }
  generateFilterQuery(filters?: any): {
    where: string;
    params: Record<string, unknown>;
  } {
    if (!filters) {
      return { where: "", params: {} };
    }

    const conditions: string[] = [];
    const params: Record<string, unknown> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined) return;

      const paramKey = `filter_${key}`;

      conditions.push(`${key} = $${paramKey}`);

      if (value instanceof Date) {
        params[paramKey] = value.toISOString();
      } else {
        params[paramKey] = value;
      }
    });

    return {
      where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
      params,
    };
  }

  generatePaginationQuery(page: number, limit: number): string {
    const offset = (page - 1) * limit;
    return `LIMIT ${limit} OFFSET ${offset}`;
  }

}