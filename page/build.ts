import * as esbuild from 'npm:esbuild';
import { denoPlugin } from 'jsr:@deno/esbuild-plugin';
import { copy } from 'jsr:@std/fs/copy';

await esbuild.build({
    entryPoints: ['src/main.ts'],
    outfile: './dist/main.js',
    bundle: true,
    format: 'iife',
    sourcemap: true,
    target: 'es2022',
    platform: 'browser',
    loader: { '.ts': 'ts' },
    plugins: [denoPlugin()],
});

// Copy files to dist directory
await copy('./static/', './dist', { overwrite: true });
await copy('../data/', './dist/data', { overwrite: true });

esbuild.stop();
