import * as SQLite from "expo-sqlite";

export const initDB = async (): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("japp_db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS piece (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS machine (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT,
    );

    CREATE TABLE IF NOT EXISTS machine_piece (
      machine_id  INTEGER NOT NULL REFERENCES machine(id) ON DELETE CASCADE,
      piece_id    INTEGER NOT NULL REFERENCES piece(id)   ON DELETE CASCADE,
      PRIMARY KEY (machine_id, piece_id)
    );

  `);
};
