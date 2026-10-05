import { cp, rm } from 'node:fs/promises';

await rm('dist/public', { force: true, recursive: true });
await cp('src/public', 'dist/public', { recursive: true });
