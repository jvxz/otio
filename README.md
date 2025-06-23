<h1 align="center">📟 otio</h1>
<p align="center"><em>Latin, short for 'otiosa', meaning leisure or free</em></p>
<p align="center">Freely forget about your dev servers.</p>

<p align="center">
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

## idea

`otio` is a single-purpose CLI tool that elegantly terminates processes after inactivity is detected. 


### inactivity

The main factor that deterimines inactivity is <strong>the chosen directory</strong>. After the directory has not been modified for <strong>a given amount of time</strong>, the processes are gracefully terminated.

Both the directory and the timeout duration are customizable.

### use cases

This tool is most useful for running development servers. Forgetting about them happens often, consuming resources on your system without you knowing. `otio` was made to solve this problem.

`otio` <em>can</em> be used for any process that is not an ongoing server, but it was not made for such purposes. <strong>Do not expect a stable experience if you decide to use it for other purposes.</strong>

## usage

```bash
otio "npm run dev"
```

> Runs `npm run dev` inside `otio` with default settings.

### custom timeout

```bash
otio "npm run dev" --timeout 300
```

> Runs `npm run dev` with a timeout of 300 seconds (5 minutes).

### custom directory

```bash
otio "npm run dev" --dir /foo/bar/baz
```

> Runs `npm run dev`, watching for changes in `/foo/bar/baz`.

### custom timeout and directory

```bash
otio "npm run dev" --timeout 120 --dir /foo/bar/baz
```

> Runs `npm run dev`, watching for changes in `/foo/bar/baz` with a timeout of 120 seconds (2 minutes).

## installation

```bash
npm i -D otio
```

> Installs `otio` as a dev dependency in the current node project. Ideal for running it via `npm run dev`.

```bash
npx otio
```

> Runs `otio` without installing.

```bash
npm i -g otio
```

> Installs `otio` globally. Ideal for running it everywhere.

## example

### package.json

```json
{
  "devDependencies": {
    "otio": "1.0.0"
  },
  "name": "my-project",
  "scripts": {
    "dev:watch": "bun build --watch --target node --outdir dist src/index.ts",
    "dev": "otio \"bun run dev:watch\" --dir \"./src\" --timeout 120",
  },
  "type": "module",
  "version": "0.0.0"
}

```

> Doing `bun run dev` will run `bun run dev:watch` inside `otio`, watching for changes in the `./src` directory with a timeout of 120 seconds (2 minutes).

## license

MIT License © 2025 [Jamie Jacobs](https://github.com/jvxz)
