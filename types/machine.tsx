import { Piece } from "./piece";

export interface Machine {
  id?: number;
  name: string;
  description: string | undefined;
  estimate_time?: number;
  pieces: Piece[];
}
