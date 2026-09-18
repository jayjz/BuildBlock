export type CuratedDeveloper = { id: number; login: string; address: number; color: string; shape: "tower" | "row" | "workshop" };
export const curatedDevelopers: CuratedDeveloper[] = [
  { id: 161224442, login: "jayjz", address: 1, color: "ochre", shape: "workshop" },
  { id: 11247099, login: "antfu", address: 5, color: "terracotta", shape: "tower" },
  { id: 3676859, login: "shuding", address: 11, color: "slate", shape: "row" },
];
export const findDeveloper = (login: string) => curatedDevelopers.find((developer) => developer.login === login);
