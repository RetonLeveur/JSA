import * as SQLite from "expo-sqlite";
import { Piece } from "@/types/piece";

const db = () => SQLite.openDatabaseAsync("japp_db");

export const create_piece = async (
  piece: Omit<Piece, "id">
): Promise<number> => {
  const database = await db();
  const result = await database.runAsync(
    "INSERT INTO piece (name, description) VALUES (?, ?)",
    [piece.name, piece.description ?? null]
  );
  return result.lastInsertRowId;
};

export const get_piece = async (id: number): Promise<Piece | null> => {
  const database = await db();
  return await database.getFirstAsync<Piece>(
    "SELECT * FROM piece WHERE id = ?",
    [id]
  );
};

export const get_pieces = async (): Promise<Piece[]> => {
  const database = await db();
  return await database.getAllAsync<Piece>(
    "SELECT * FROM piece ORDER BY name ASC"
  );
};

export const update_piece = async (piece: Piece): Promise<void> => {
  const database = await db();
  await database.runAsync(
    "UPDATE piece SET name = ?, description = ? WHERE id = ?",
    [piece.name, piece.description ?? null, piece.id]
  );
};

export const delete_piece = async (id: number): Promise<void> => {
  const database = await db();
  await database.runAsync("DELETE FROM piece WHERE id = ?", [id]);
};
