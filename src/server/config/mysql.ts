import { createPool } from "mysql2/promise";

export const mysqlPool = createPool({
  host: import.meta.env.MYSQL_HOST,
  user: import.meta.env.MYSQL_USERNAME,
  password: import.meta.env.MYSQL_PASSWORD,
  port: Number(import.meta.env.MYSQL_PORT) || 3306,
  database: import.meta.env.MYSQL_DB,
});
