import * as SQLite from "expo-sqlite";

export const initDB = async (): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("japp_db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS piece (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      description   TEXT,
      estimate_time INTEGER
    );

    CREATE TABLE IF NOT EXISTS machine (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      description   TEXT,
      estimate_time INTEGER
    );

    CREATE TABLE IF NOT EXISTS machine_piece (
      machine_id  INTEGER NOT NULL REFERENCES machine(id) ON DELETE CASCADE,
      piece_id    INTEGER NOT NULL REFERENCES piece(id)   ON DELETE CASCADE,
      quantity    INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (machine_id, piece_id)
    );

    CREATE TABLE IF NOT EXISTS hebdomadaire (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      date  TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hebdomadaire_list (
      hebdomadaire_id  INTEGER NOT NULL REFERENCES hebdomadaire(id) ON DELETE CASCADE,
      machine_id       INTEGER NOT NULL REFERENCES machine(id)      ON DELETE CASCADE,
      amount           INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (hebdomadaire_id, machine_id)
    );

  `);

  try {
    await db.runAsync(
      "ALTER TABLE machine_piece ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1"
    );
  } catch {}

  try {
    await db.runAsync("ALTER TABLE machine ADD COLUMN estimate_time INTEGER");
  } catch {}

  try {
    await db.runAsync("ALTER TABLE piece ADD COLUMN estimate_time INTEGER");
  } catch {}
};
