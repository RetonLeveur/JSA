import { Machine } from "./machine";

export interface Hebdomadaire {
  machines: HebomadaireList[];
  date: string;
}

export interface HebomadaireList {
  machines: Machine;
  amount: number;
}
