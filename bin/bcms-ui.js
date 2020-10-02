#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');

/**
 * @param {string[]} rawArgs
 */
function parseArgs(rawArgs) {
  const args = {};
  let i = 2;
  while (i < rawArgs.length) {
    const a = rawArgs[i];
    let value = '';
    if (rawArgs[i + 1]) {
      value = rawArgs[i + 1].startsWith('--') ? '' : rawArgs[i + 1];
    }
    args[a] = value;
    if (value === '') {
      i = i + 1;
    } else {
      i = i + 2;
    }
  }
  return {
    dev: args['--dev'] === '' || args['--dev'] === 'true' || false,
  };
}
/**
 * @param {string} cmd
 * @param {string[]} args
 * @param {childProcess.SpawnOptions} options
 * @return {Promise<void>}
 */
async function spawn(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const proc = childProcess.spawn(cmd, args, options);
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve();
      }
    });
  });
}

async function main() {
  console.log(process.cwd());
  const options = parseArgs(process.argv);
  if (options.dev) {
    await spawn(
      'npm',
      [
        'run',
        'local:dev'
        // `${path.join(
        //   __dirname,
        //   '..',
        //   'node_modules',
        //   'rollup',
        //   'dist',
        //   'bin',
        //   'rollup'
        // )}`,
        // '-c',
        // 'rollup.config.js',
        // '-w',
      ],
      {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
      }
    );
  }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
