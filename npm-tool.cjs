const path = require('path');
const { createConfig, createTasks } = require('@banez/npm-tool');
const { createFS } = require('@banez/fs');
const { ChildProcess } = require('@banez/child_process');

const fs = createFS({
  base: process.cwd(),
});

module.exports = createConfig({
  bundle: {
    override: [
      {
        title: 'Remove dist and lib directories.',
        task: async () => {
          if (await fs.exist('dist')) {
            await fs.deleteDir('dist');
          }
          if (await fs.exist('dist-components')) {
            await fs.deleteDir('dist-components');
          }
          if (await fs.exist('lib')) {
            await fs.deleteDir('lib');
          }
        },
      },
      {
        title: 'Build Vue.',
        task: async () => {
          await ChildProcess.spawn('npm', ['run', 'build:vue']);
        },
      },
      {
        title: 'Create lib.',
        task: async () => {
          await fs.mkdir('lib');
          await fs.copy('dist', ['lib', 'public']);
          await fs.copy(['src', 'components'], ['lib', 'components']);
          await fs.copy(['src', 'types'], ['lib', 'types']);
          await fs.copy(['src', 'services'], ['lib', 'services']);
          await fs.copy(['src', 'directives'], ['lib', 'directives']);
          await fs.copy(['src', 'util'], ['lib', 'util']);
          await fs.copy(['src', 'translations'], ['lib', 'translations']);
          await fs.copy(['src', 'styles'], ['lib', 'styles']);
          await fs.copy('tailwind.config.cjs', ['lib', 'tw.js']);
          await fs.copy('tailwind.config.cjs', ['lib', 'tailwind.config.js']);
          await fs.copy('tailwind.config.cjs', ['lib', 'tailwind.config.cjs']);
        },
      },
      {
        title: 'Copy package.json.',
        task: async () => {
          const data = JSON.parse(await fs.readString('package.json'));
          data.devDependencies = undefined;
          data.nodemonConfig = undefined;
          data.scripts = undefined;
          await fs.save(
            ['lib', 'package.json'],
            JSON.stringify(data, null, '  ')
          );
        },
      },
      {
        title: 'Copy README',
        task: async () => {
          await fs.copy(['README.md'], ['lib', 'README.md']);
        },
      },
      {
        title: 'Copy LICENSE',
        task: async () => {
          await fs.copy('LICENSE', ['lib', 'LICENSE']);
        },
      },
    ],
  },

  pack: {
    override: [
      {
        title: 'Package lib',
        task: async () => {
          await ChildProcess.spawn('npm', ['pack'], {
            cwd: path.join(process.cwd(), 'lib'),
            stdio: 'inherit',
          });
        },
      },
    ],
  },

  publish: {
    override: [
      {
        title: 'Public to registry',
        task: async () => {
          if (await fs.exist('lib', 'node_modules')) {
            throw new Error(
              `Please remove "${path.join(__dirname, 'lib', 'node_modules')}"`
            );
          }
          await ChildProcess.spawn('npm', ['publish', '--access=public'], {
            cwd: path.join(process.cwd(), 'lib'),
            stdio: 'inherit',
          });
        },
      },
    ],
  },

  custom: {
    '--setup': async () => {
      await createTasks([
        {
          title: 'Create directories',
          task: async () => {
            if (!(await fs.exist('db'))) {
              await fs.mkdir('db');
            }
            if (!(await fs.exist('uploads'))) {
              await fs.mkdir('uploads');
            }
          },
        },
      ]).run();
    },
  },
});
