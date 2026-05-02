import * as SQLite from "expo-sqlite";
import { Machine } from "@/types/machine";
import { Piece } from "@/types/piece";

const db = () => SQLite.openDatabaseAsync("japp_db");

type MachineRow = {
  id: number;
  name: string;
  description: string | null;
  estimate_time: number | null;
};
type PieceRow = {
  id: number;
  name: string;
  description: string | null;
  estimate_time: number | null;
  quantity: number;
};

const getPiecesForMachine = async (
  database: SQLite.SQLiteDatabase,
  machineId: number
): Promise<Piece[]> => {
  const rows = await database.getAllAsync<PieceRow>(
    `SELECT p.id, p.name, p.description, p.estimate_time, mp.quantity
     FROM piece p
     INNER JOIN machine_piece mp ON mp.piece_id = p.id
     WHERE mp.machine_id = ?
     ORDER BY p.name ASC`,
    [machineId]
  );
  return rows.map((r) => ({
    ...r,
    description: r.description ?? undefined,
    estimate_time: r.estimate_time ?? undefined
  }));
};

export const create_machine = async (
  machine: Omit<Machine, "id">
): Promise<number> => {
  const database = await db();
  const result = await database.runAsync(
    "INSERT INTO machine (name, description, estimate_time) VALUES (?, ?, ?)",
    [machine.name, machine.description ?? null, machine.estimate_time ?? null]
  );
  const machineId = Number(result.lastInsertRowId);
  for (const piece of machine.pieces) {
    await database.runAsync(
      "INSERT INTO machine_piece (machine_id, piece_id, quantity) VALUES (?, ?, ?)",
      [machineId, Number(piece.id), piece.quantity ?? 1]
    );
  }
  return machineId;
};

export const get_machine = async (id: number): Promise<Machine | null> => {
  const database = await db();
  const row = await database.getFirstAsync<MachineRow>(
    "SELECT * FROM machine WHERE id = ?",
    [id]
  );
  if (!row) return null;
  const pieces = await getPiecesForMachine(database, row.id);
  return {
    ...row,
    description: row.description ?? undefined,
    estimate_time: row.estimate_time ?? undefined,
    pieces
  };
};

export const get_machines = async (): Promise<Machine[]> => {
  const database = await db();
  const rows = await database.getAllAsync<MachineRow>(
    "SELECT * FROM machine ORDER BY name ASC"
  );
  const machines: Machine[] = [];
  for (const row of rows) {
    const pieces = await getPiecesForMachine(database, row.id);
    machines.push({
      ...row,
      description: row.description ?? undefined,
      estimate_time: row.estimate_time ?? undefined,
      pieces
    });
  }
  return machines;
};

export const update_machine = async (
  machine: Machine & { id: number }
): Promise<void> => {
  const database = await db();
  await database.runAsync(
    "UPDATE machine SET name = ?, description = ?, estimate_time = ? WHERE id = ?",
    [
      machine.name,
      machine.description ?? null,
      machine.estimate_time ?? null,
      machine.id
    ]
  );
  await database.runAsync("DELETE FROM machine_piece WHERE machine_id = ?", [
    machine.id
  ]);
  for (const piece of machine.pieces) {
    await database.runAsync(
      "INSERT INTO machine_piece (machine_id, piece_id, quantity) VALUES (?, ?, ?)",
      [machine.id, Number(piece.id), piece.quantity ?? 1]
    );
  }
};

export const delete_machine = async (id: number): Promise<void> => {
  const database = await db();
  await database.runAsync("DELETE FROM machine WHERE id = ?", [id]);
};
