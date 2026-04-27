import { Machine } from "./machine";

export interface Hebdomadaire {
  machines: HebdomadaireList[];
  date: string;
}

export interface HebdomadaireList {
  machines: Machine;
  amount: number;
}
