import {
  BCMSSocketEventName,
  BCMSSocketSyncChangeDataMouse,
  BCMSSocketSyncChangeEvent,
  BCMSSocketSyncChangeType,
  BCMSSocketSyncEvent,
  BCMSSocketUnsyncEvent,
} from '@becomes/cms-sdk/types';
import type { BCMSEntrySync, BCMSEntrySyncUser } from '../types';

const colors = [
  'text-green',
  'text-pink',
  'text-yellow',
  'text-red',
  'text-dark',
  'text-grey',
];

export function createBcmsEntrySync({ uri }: { uri: string }): BCMSEntrySync {
  function onMouseMove(event: MouseEvent) {
    self.mouse.pos.curr[0] = event.clientX;
    self.mouse.pos.curr[1] = event.clientY + document.body.scrollTop;
  }

  function onScroll() {
    self.scroll.y.curr = document.body.scrollTop;
    const scrollDelta = self.scroll.y.curr - self.scroll.y.last;
    self.scroll.y.last = document.body.scrollTop;
    self.mouse.pos.curr[1] = self.mouse.pos.curr[1] + scrollDelta;
  }

  function onMouseClick(event: MouseEvent) {
    if (event.buttons === 1) {
      self.mouse.click.left = true;
    } else if (event.buttons === 0) {
      self.mouse.click.left = false;
    }
  }

  const ticker = setInterval(() => {
    if (
      self.mouse.pos.curr[0] !== self.mouse.pos.last[0] ||
      self.mouse.pos.curr[1] !== self.mouse.pos.last[1]
    ) {
      self.mouse.pos.last[0] = self.mouse.pos.curr[0];
      self.mouse.pos.last[1] = self.mouse.pos.curr[1];
      window.bcms.sdk.socket.emit(BCMSSocketEventName.SYNC_CHANGE_TSERV, {
        p: uri,
        sct: BCMSSocketSyncChangeType.MOUSE,
        data: {
          x: self.mouse.pos.curr[0],
          y: self.mouse.pos.curr[1],
        },
      });
    }
  }, 20);

  const socketSubs: Array<() => void> = [];
  const onChange: Array<(data: BCMSSocketSyncChangeEvent) => void> = [];

  const self: BCMSEntrySync = {
    scroll: {
      y: {
        curr: 0,
        last: 0,
      },
    },
    mouse: {
      pos: {
        curr: [0, 0],
        last: [0, 0],
      },
      click: {
        left: false,
      },
    },
    users: {},

    async sync() {
      await window.bcms.util.throwable(async () => {
        window.bcms.sdk.socket.emit(BCMSSocketEventName.SYNC_TSERV, {
          p: uri,
        });
        window.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('scroll', onScroll);
        window.addEventListener('mousedown', onMouseClick);
        window.addEventListener('mouseup', onMouseClick);

        const soc = window.bcms.sdk.socket;
        socketSubs.push(
          soc.subscribe(BCMSSocketEventName.SYNC_FSERV, async (ev) => {
            console.log('a');
            const event = ev as BCMSSocketSyncEvent;
            if (event.p === uri) {
              const me = await window.bcms.sdk.user.get();
              if (event.connId !== `${me._id}_${window.bcms.sdk.socket.id}`) {
                self.createUser(event.connId + '');
              }
            }
          }),
          soc.subscribe(BCMSSocketEventName.UNSYNC_FSERV, async (ev) => {
            console.log('b');
            const event = ev as BCMSSocketUnsyncEvent;
            if (event.p === uri) {
              const connId = event.connId as string;
              if (self.users[connId]) {
                self.users[connId].destroy();
              }
            }
          }),
          soc.subscribe(BCMSSocketEventName.SYNC_CHANGE_FSERV, async (ev) => {
            const event = ev as BCMSSocketSyncChangeEvent;
            if (event.p === uri) {
              if (event.sct === BCMSSocketSyncChangeType.MOUSE) {
                const data = event.data as BCMSSocketSyncChangeDataMouse;
                const connId = event.connId as string;
                if (self.users[connId]) {
                  self.users[connId].mouse = [data.x, data.y];
                  self.users[connId]._handlers.forEach((e) =>
                    e(self.users[connId])
                  );
                }
              } else {
                onChange.forEach((e) => e(event));
              }
            }
          })
        );
      });
    },

    async unsync() {
      clearInterval(ticker);
      socketSubs.forEach((e) => e());
      await window.bcms.util.throwable(async () => {
        window.bcms.sdk.socket.emit(BCMSSocketEventName.UNSYNC_TSERV, {
          p: uri,
        });
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousedown', onMouseClick);
        window.removeEventListener('mouseup', onMouseClick);
        document.body.removeEventListener('scroll', onScroll);
        for (const connId in self.users) {
          self.users[connId].destroy();
        }
      });
    },

    async createUser(connId) {
      const uid = connId.split('_')[0];
      const user = await window.bcms.sdk.user.get(uid);
      self.users[connId] = {
        color: colors[Object.keys(self.users).length % 5],
        uid,
        mouse: [0, 0],
        name: user.username,
        _handlers: [],
        pointerElements: undefined as never,
        onUpdate: () => {
          // Do nothing
        },
        destroy() {
          if (self.users[connId].pointerElements) {
            document.body.removeChild(self.users[connId].pointerElements.root);
          }
          delete self.users[connId];
        },
      };
      self.users[connId].onUpdate = (handler) => {
        self.users[connId]._handlers.push(handler);
      };
      self.users[connId].pointerElements = self.createUserPointer(
        self.users[connId]
      );
      return self.users[connId];
    },

    async createUsers() {
      const me = await window.bcms.sdk.user.get();
      const connIds = await window.bcms.sdk.socket.calls.entrySync();
      const output: BCMSEntrySyncUser[] = [];
      for (let i = 0; i < connIds.length; i++) {
        const connId = connIds[i];
        if (connId !== `${me._id}_${window.bcms.sdk.socket.id()}`) {
          await self.createUser(connId);
          output.push(self.users[connId]);
        }
      }
      return output;
    },

    createUserPointer(user) {
      const root = document.createElement('div');
      root.setAttribute('class', 'fixed z-[1000000]');
      root.style.left = '0px';
      root.style.top = '0px';
      root.addEventListener('mouseenter', () => {
        username.style.display = 'block';
      });
      root.addEventListener('mouseleave', () => {
        username.style.display = 'none';
      });

      const cursor = document.createElement('div');
      cursor.innerHTML = `
      <svg class="w-4 h-4 ${user.color}" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="fill-current" d="M14.2737 32L0 0L36 9.58755L19.2 16.0623L14.2737 32Z" />
      </svg>`;
      root.appendChild(cursor);

      const username = document.createElement('div');
      username.setAttribute(
        'class',
        `${user.color} font-semibold relative left-3 bottom-2 text-sm`
      );
      username.innerText = user.name;
      username.style.display = 'none';
      root.appendChild(username);
      document.body.appendChild(root);

      user.onUpdate((u) => {
        root.style.left = u.mouse[0] + 'px';
        root.style.top = u.mouse[1] - document.body.scrollTop + 'px';
      });

      return {
        cursor,
        root,
        name: username,
      };
    },

    onChange(handler) {
      onChange.push(handler);
    },
  };

  return self;
}
