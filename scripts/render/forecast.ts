import { readFile } from "node:fs/promises";

/** One reading from a ridge-top weather station. */
interface Reading {
  station: string;
  visibility: number; // metres
  humidity: number;
  at: Date;
}

const FOG_LIMIT = 1_000;
const RIDGE = /^ridge-(\d{2})$/;

export async function foggyStations(path: string): Promise<string[]> {
  const readings: Reading[] = JSON.parse(await readFile(path, "utf8"));
  return readings
    .filter((r) => RIDGE.test(r.station) && r.visibility < FOG_LIMIT)
    .map((r) => `${r.station}: ${r.visibility} m\n`);
}

export class Forecast {
  readonly #seen = new Map<string, Reading>();

  constructor(readonly region = "mistpine") {}

  record(reading: Reading): boolean {
    if (reading.humidity < 0.95 || this.#seen.has(reading.station)) {
      return false;
    }
    this.#seen.set(reading.station, reading);
    return true;
  }
}
