import * as SQLite from "expo-sqlite";
import { Hebdomadaire, HebdomadaireList } from "@/types/hebdomadaire";
import { Machine } from "@/types/machine";
import { Piece } from "@/types/piece";

const db = () => SQLite.openDatabaseAsync("japp_db");

type HebRow = { id: number; date: string };
type ListRow = {
  machine_id: number;
  amount: number;
  machine_name: string;
  machine_description: string | null;
};
type PieceRow = { id: number; name: string; description: string | null };

const getPiecesForMachine = async (
  database: SQLite.SQLiteDatabase,
  machineId: number
): Promise<Piece[]> => {
  const rows = await database.getAllAsync<PieceRow>(
    `SELECT p.id, p.name, p.description
     FROM piece p
     INNER JOIN machine_piece mp ON mp.piece_id = p.id
     WHERE mp.machine_id = ?
     ORDER BY p.name ASC`,
    [machineId]
  );
  return rows.map((r) => ({ ...r, description: r.description ?? undefined }));
};

export const get_hebdomadaire = async (): Promise<Hebdomadaire | null> => {
  const database = await db();

  const row = await database.getFirstAsync<HebRow>(
    "SELECT id, date FROM hebdomadaire LIMIT 1"
  );
  if (!row) return null;

  const listRows = await database.getAllAsync<ListRow>(
    `SELECT hl.machine_id, hl.amount,
            m.name  AS machine_name,
            m.description AS machine_description
     FROM hebdomadaire_list hl
     INNER JOIN machine m ON m.id = hl.machine_id
     WHERE hl.hebdomadaire_id = ?
     ORDER BY m.name ASC`,
    [row.id]
  );

  const machines: HebdomadaireList[] = [];
  for (const lr of listRows) {
    const pieces = await getPiecesForMachine(database, lr.machine_id);
    const machine: Machine = {
      id: lr.machine_id,
      name: lr.machine_name,
      description: lr.machine_description ?? undefined,
      pieces
    };
    machines.push({ machines: machine, amount: lr.amount });
  }

  return { date: row.date, machines };
};

// Creates a new hebdomadaire, wiping any existing one.
export const new_hebdomadaire = async (
  date: string,
  list: HebdomadaireList[]
): Promise<void> => {
  const database = await db();

  // Explicit delete order avoids relying on ON DELETE CASCADE
  // (PRAGMA foreign_keys is OFF on new connections by default).
  await database.runAsync("DELETE FROM hebdomadaire_list");
  await database.runAsync("DELETE FROM hebdomadaire");

  const result = await database.runAsync(
    "INSERT INTO hebdomadaire (date) VALUES (?)",
    [date]
  );
  const hebId = Number(result.lastInsertRowId);

  for (const entry of list) {
    await database.runAsync(
      "INSERT INTO hebdomadaire_list (hebdomadaire_id, machine_id, amount) VALUES (?, ?, ?)",
      [hebId, Number(entry.machines.id), entry.amount]
    );
  }
};

export const update_hebdomadaire_amount = async (
  machineId: number,
  amount: number
): Promise<void> => {
  const database = await db();
  await database.runAsync(
    `UPDATE hebdomadaire_list
     SET amount = ?
     WHERE machine_id = ?
       AND hebdomadaire_id = (SELECT id FROM hebdomadaire LIMIT 1)`,
    [amount, machineId]
  );
};

export const add_hebdomadaire = async (
  machine: Machine,
  amount: number = 0
): Promise<void> => {
  const database = await db();
  const row = await database.getFirstAsync<{ id: number }>(
    "SELECT id FROM hebdomadaire LIMIT 1"
  );
  if (!row) return;
  await database.runAsync(
    "INSERT OR IGNORE INTO hebdomadaire_list (hebdomadaire_id, machine_id, amount) VALUES (?, ?, ?)",
    [row.id, machine.id!, amount]
  );
};

export const remove_hebdomadaire_machine = async (
  machineId: number
): Promise<void> => {
  const database = await db();
  const row = await database.getFirstAsync<{ id: number }>(
    "SELECT id FROM hebdomadaire LIMIT 1"
  );
  if (!row) return;
  await database.runAsync(
    "DELETE FROM hebdomadaire_list WHERE hebdomadaire_id = ? AND machine_id = ?",
    [row.id, machineId]
  );
};
