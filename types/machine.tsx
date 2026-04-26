import { Piece } from "./piece";

export interface Machine {
  id: number;
  name: string;
  description: string | undefined;
  pieces: Piece[];
}
