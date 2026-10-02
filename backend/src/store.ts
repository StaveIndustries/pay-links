import * as fs from 'node:fs';
import * as path from 'node:path';
import { PaymentLink } from './types.js';

// Tiny JSON-file store. No database needed to run the app.
// Data file lives next to the backend (DATA_FILE env override for tests).
function dataFile(): string {
  return process.env.DATA_FILE ?? path.join(process.cwd(), 'data', 'links.json');
}

function readAll(): PaymentLink[] {
  try {
    const raw = fs.readFileSync(dataFile(), 'utf8');
    return JSON.parse(raw) as PaymentLink[];
  } catch {
    return [];
  }
}

function writeAll(links: PaymentLink[]): void {
  fs.mkdirSync(path.dirname(dataFile()), { recursive: true });
  fs.writeFileSync(dataFile(), JSON.stringify(links, null, 2));
}

export function listLinks(): PaymentLink[] {
  return readAll();
}

export function getLink(id: string): PaymentLink | undefined {
  return readAll().find((l) => l.id === id);
}

export function saveLink(link: PaymentLink): void {
  const links = readAll().filter((l) => l.id !== link.id);
  links.push(link);
  writeAll(links);
}
