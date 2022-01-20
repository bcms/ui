const path = require('path');
const fse = require('fs-extra');
const childProcess = require('child_process');

/**
 * 
 * "cypress": "^6.9.1",
    "cypress-file-upload": "^5.0.7",
 */

const exec = async (cmd, output) => {
  return new Promise((resolve, reject) => {
    const proc = childProcess.exec(cmd);
    if (output) {
      proc.stdout.on('data', (data) => {
        output('stdout', data);
      });
      proc.stderr.on('data', (data) => {
        output('stderr', data);
      });
    }
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve();
      }
    });
  });
};
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

async function startTests() {
  await spawn('cypress', ['run'], {
    stdio: 'inherit',
  });
}

async function main() {
  process.env.CYPRESS = 'true';
  await fse.copy(
    path.join(__dirname, 'bcms.db.test.json'),
    path.join(__dirname, 'bcms.db.json')
  );
  await new Promise((resolve, reject) => {
    let testStarted = false;
    let backendStarted = false;
    let uiStarted = false;
    const onData = (type, chunk) => {
      process[type].write(chunk);
      if (!testStarted) {
        if (chunk.includes('PORT: 1280')) {
          backendStarted = true;
          console.log('Backend started.');
        } else if (chunk.includes('Your application is ready~!')) {
          uiStarted = true;
          console.log('UI started.');
        }
        if (uiStarted && backendStarted) {
          testStarted = true;
          startTests()
            .then(() => {
              backendProc.kill('SIGKILL');
              uiProc.kill('SIGKILL');
              resolve();
            })
            .catch((error) => {
              backendProc.kill('SIGKILL');
              uiProc.kill('SIGKILL');
              reject(error);
            });
        }
      }
    };
    let errData = '';
    const uiProc = childProcess.exec('npm run dev');
    uiProc.stdout.on('data', (data) => {
      onData('stdout', data);
    });
    uiProc.stderr.on('data', (data) => {
      errData += data;
    });
    uiProc.on('close', (code) => {
      backendProc.kill('SIGKILL');
      if (code !== 0) {
        reject(errData);
      } else {
        resolve();
      }
    });
    const backendProc = childProcess.exec('bcms --dev --backend');
    backendProc.stdout.on('data', (data) => {
      onData('stdout', data);
    });
    backendProc.stderr.on('data', (data) => {
      errData += data;
    });
    backendProc.on('close', (code) => {
      uiProc.kill('SIGKILL');
      if (code !== 0) {
        reject(errData);
      } else {
        resolve();
      }
    });
  });
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
