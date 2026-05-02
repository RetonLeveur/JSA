import * as SQLite from "expo-sqlite";
import { Piece } from "@/types/piece";

const db = () => SQLite.openDatabaseAsync("japp_db");

type PieceRow = {
  id: number;
  name: string;
  description: string | null;
  estimate_time: number | null;
};

const rowToPiece = (r: PieceRow): Piece => ({
  id: r.id,
  name: r.name,
  description: r.description ?? undefined,
  estimate_time: r.estimate_time ?? undefined
});

export const create_piece = async (
  piece: Omit<Piece, "id">
): Promise<number> => {
  const database = await db();
  const result = await database.runAsync(
    "INSERT INTO piece (name, description, estimate_time) VALUES (?, ?, ?)",
    [piece.name, piece.description ?? null, piece.estimate_time ?? null]
  );
  return Number(result.lastInsertRowId);
};

export const get_piece = async (id: number): Promise<Piece | null> => {
  const database = await db();
  const row = await database.getFirstAsync<PieceRow>(
    "SELECT * FROM piece WHERE id = ?",
    [id]
  );
  return row ? rowToPiece(row) : null;
};

export const get_pieces = async (): Promise<Piece[]> => {
  const database = await db();
  const rows = await database.getAllAsync<PieceRow>(
    "SELECT * FROM piece ORDER BY name ASC"
  );
  return rows.map(rowToPiece);
};

export const update_piece = async (piece: Piece): Promise<void> => {
  const database = await db();
  await database.runAsync(
    "UPDATE piece SET name = ?, description = ?, estimate_time = ? WHERE id = ?",
    [
      piece.name,
      piece.description ?? null,
      piece.estimate_time ?? null,
      Number(piece.id)
    ]
  );
};

export const delete_piece = async (id: number): Promise<void> => {
  const database = await db();
  await database.runAsync("DELETE FROM piece WHERE id = ?", [id]);
};
