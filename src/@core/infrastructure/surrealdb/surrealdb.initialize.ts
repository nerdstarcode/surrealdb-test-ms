import { Surreal } from 'surrealdb';

export async function initializeSurrealDBTables(client: Surreal): Promise<void> {

  const tables = [
    {
      name: 'user',
      schema: `DEFINE TABLE user SCHEMAFULL;
               DEFINE FIELD name ON user TYPE string;
               DEFINE FIELD email ON user TYPE string;
               DEFINE FIELD age ON user TYPE number;
               DEFINE FIELD createdAt ON user TYPE datetime;`
    },
    // Add more tables here if needed
  ];
  // await client.query(`DEFINE BUCKET vaccines BACKEND "memory";`);
  for (const table of tables) {
    try {
      await client.query(`SELECT * FROM ${table.name} LIMIT 1`);
    } catch (err) {
      console.error(`Error checking table ${table.name}:`, err);
      console.log(`Table ${table.name} does not exist. Creating...`);
      await client.query(table.schema);
    }
  }
}