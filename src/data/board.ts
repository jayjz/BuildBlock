import { curatedDevelopers } from "./developers";
export type BoardSpace = { index: number; kind: "developer" | "open" | "civic"; label: string; login?: string };
const civic = new Map([[0, "District Gate"], [10, "Workshop"], [20, "Commons"], [30, "Observatory"]]);
export const boardSpaces: BoardSpace[] = Array.from({ length: 40 }, (_, index) => {
  const developer = curatedDevelopers.find((entry) => entry.address === index);
  if (developer) return { index, kind: "developer", label: developer.login, login: developer.login };
  if (civic.has(index)) return { index, kind: "civic", label: civic.get(index)! };
  return { index, kind: "open", label: "Open plot" };
});
