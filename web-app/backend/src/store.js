import fs from 'node:fs';
import path from 'node:path';

const file = process.env.DATA_FILE || path.resolve('data/progress.json');
const empty = { users: [], problems: [], revisions: [], goals: [] };
let state = empty;
try { state = { ...empty, ...JSON.parse(fs.readFileSync(file, 'utf8')) }; } catch { /* first run */ }
export const store = state;
export function persist() {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(state, null, 2));
  fs.renameSync(temp, file);
}
export const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const isoDay = (date = new Date()) => new Date(date).toISOString().slice(0, 10);
