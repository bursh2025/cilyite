import { cp, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const checkout = join(root, '.sites-preview');
const manifestPath = join(checkout, '.openai', 'hosting.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (!manifest.project_id) throw new Error('Missing Sites project ID');
delete manifest.static;

const dist = join(checkout, 'dist');
const server = join(dist, 'server');
await mkdir(server, { recursive: true });
await cp(join(root, 'out'), join(dist, 'client'), {
  recursive: true,
  filter: (source) => !['backend', '.htaccess'].includes(basename(source)),
});
await copyFile(join(root, 'scripts', 'sites-telegram-worker.mjs'), join(server, 'index.js'));
await writeFile(join(server, 'wrangler.json'), JSON.stringify({
  main: 'index.js',
  compatibility_date: '2025-06-01',
  assets: {
    directory: '../client',
    binding: 'ASSETS',
    html_handling: 'force-trailing-slash',
    not_found_handling: '404-page',
  },
}, null, 2) + '\n');
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
