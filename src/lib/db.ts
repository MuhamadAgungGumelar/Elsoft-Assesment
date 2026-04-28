import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool | null {
  if (!process.env.MYSQL_HOST) return null;
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'elsoft_app',
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T>(sql: string, params?: any[]): Promise<T[]> {
  const db = getPool();
  if (!db) return [];
  try {
    const [rows] = await db.execute(sql, params);
    return rows as T[];
  } catch {
    return [];
  }
}
