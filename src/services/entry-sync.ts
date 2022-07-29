import { v4 as uuidv4 } from 'uuid';
import {
  BCMSSocketEventName,
  BCMSSocketSyncChangeDataFocus,
  BCMSSocketSyncChangeDataMouse,
  BCMSSocketSyncChangeEvent,
  BCMSSocketSyncChangeType,
  BCMSSocketSyncEvent,
  BCMSSocketUnsyncEvent,
} from '@becomes/cms-sdk/types';
import type {
  BCMSEntrySync,
  BCMSEntrySyncFocusContainer,
  BCMSEntrySyncUser,
} from '../types';

const cursorColors = [
  'text-green',
  'text-pink',
  'text-yellow',
  'text-red',
  'text-dark',
  'text-grey',
];
const avatarRingColors = [
  'bg-green',
  'bg-pink',
  'bg-yellow',
  'bg-red',
  'bg-dark',
  'bg-grey',
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

  function findPropPath(el: HTMLElement): string {
    const propPath = el.getAttribute('data-bcms-prop-path');
    if (propPath) {
      return propPath;
    }
    if (el.parentElement) {
      return findPropPath(el.parentElement as HTMLElement);
    }
    return '';
  }

  function onMouseClick(event: MouseEvent) {
    if (event.buttons === 1) {
      const el = event.target as HTMLElement;
      const propPath = findPropPath(el);
      self.emit.focus({
        propPath: propPath || 'n',
      });
      self.mouse.click.left = true;
    } else if (event.buttons === 0) {
      self.mouse.click.left = false;
    }
  }

  function createAvatarElement(user: BCMSEntrySyncUser): HTMLElement {
    const root = document.createElement('div');
    root.setAttribute('class', 'select-none inline-block');
    root.innerHTML = `
    ${
      user.avatar
        ? `
        <div class="w-10 h-10 rounded-full ring-2 ring-white ${user.colors.avatarRing} overflow-hidden">
          <img
            src="${user.avatar}"
            alt="${user.name}"
            class="w-full h-full"
          />
        </div>
    `
        : `
      <div class="w-10 h-10 rounded-full ${
        user.colors.avatarRing
      } flex justify-center items-center">
        <span class="text-white font-semibold relative top-0.5 text-l">
          ${user.name
            .split(' ')
            .map((word) => word[0])
            .slice(0, 2)
            .join('')}
        </span>
      </div>
    `
    }
    `;
    return root;
  }

  function addUserToFocusContainer(
    user: BCMSEntrySyncUser,
    focusElement: HTMLElement
  ): BCMSEntrySyncFocusContainer {
    if (user.focusElement) {
      removeUserFromFocusContainer(user);
    }
    user.focusElement = focusElement;
    let target: BCMSEntrySyncFocusContainer | undefined = undefined;
    for (const id in focusContainers) {
      const focusContainer = focusContainers[id];
      if (focusContainer.focus === focusElement) {
        target = focusContainer;
        break;
      }
    }
    if (!target) {
      const root = document.createElement('div');
      root.setAttribute(
        'class',
        'absolute flex flex-col -space-y-2 flex-shrink-0 transition-all'
      );
      const bb = focusElement.getBoundingClientRect();
      root.setAttribute(
        'style',
        `top: ${bb.top + document.body.scrollTop}px; left: ${bb.right + 10}px;`
      );
      root.appendChild(user.avatarMoveEl);
      document.body.appendChild(root);
      const id = uuidv4();
      target = {
        id,
        root,
        focus: focusElement,
        bb,
        conns: {},
        destroy() {
          document.body.removeChild(root);
          delete focusContainers[id];
        },
      };
      focusContainers[id] = target;
    } else {
      target.root.style.top =
        target.bb.top +
        target.bb.height / 2 -
        target.root.offsetHeight +
        document.body.scrollTop +
        'px';
      target.conns[user.connId] = true;
      target.root.appendChild(user.avatarMoveEl);
    }
    return target;
  }

  function removeUserFromFocusContainer(user: BCMSEntrySyncUser): void {
    if (user.focusElement) {
      for (const id in focusContainers) {
        const focusContainer = focusContainers[id];
        if (focusContainer.focus === user.focusElement) {
          focusContainer.root.removeChild(user.avatarMoveEl);
          user.focusElement = undefined;
          delete focusContainer.conns[user.connId];
          const connCount = focusContainer.root.childNodes.length;
          if (connCount === 0) {
            document.body.removeChild(focusContainer.root);
            delete focusContainers[focusContainer.id];
          } else if (connCount === 1) {
            focusContainer.root.style.top =
              focusContainer.bb.top + document.body.scrollTop + 'px';
          } else {
            focusContainer.root.style.top =
              focusContainer.bb.top +
              focusContainer.bb.height / 2 -
              focusContainer.root.offsetHeight +
              document.body.scrollTop +
              'px';
          }
          break;
        }
      }
    }
  }

  function handlerFocusEvent(event: BCMSSocketSyncChangeEvent) {
    const data = event.data as BCMSSocketSyncChangeDataFocus;
    const el = document.querySelector(
      `[data-bcms-prop-path="${data.p}"]`
    ) as HTMLElement;
    const syncUser = self.users[event.connId as string];
    if (el) {
      addUserToFocusContainer(syncUser, el);
      syncUser.avatarMoveEl.style.display = 'block';
    } else {
      syncUser.avatarMoveEl.style.display = 'none';
      removeUserFromFocusContainer(syncUser);
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
  }, 100);
  let colorIndex = 0;
  const focusContainers: {
    [id: string]: BCMSEntrySyncFocusContainer;
  } = {};
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
            const event = ev as BCMSSocketSyncEvent;
            if (event.p === uri) {
              const me = await window.bcms.sdk.user.get();
              if (event.connId !== `${me._id}_${window.bcms.sdk.socket.id}`) {
                self.createUser(event.connId + '');
              }
            }
          }),
          soc.subscribe(BCMSSocketEventName.UNSYNC_FSERV, async (ev) => {
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
              } else if (event.sct === BCMSSocketSyncChangeType.FOCUS) {
                handlerFocusEvent(event);
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
        for (const id in focusContainers) {
          document.body.removeChild(focusContainers[id].root);
        }
      });
    },

    async createUser(connId) {
      const uid = connId.split('_')[0];
      const user = await window.bcms.sdk.user.get(uid);
      const colorIdx = colorIndex;
      colorIndex++;
      self.users[connId] = {
        connId,
        colors: {
          cursor: cursorColors[colorIdx % cursorColors.length],
          avatarRing: avatarRingColors[colorIdx % avatarRingColors.length],
        },
        uid,
        mouse: [0, 0],
        name: user.username,
        avatar: user.customPool.personal.avatarUri,
        avatarEl: undefined as never,
        avatarMoveEl: undefined as never,
        _handlers: [],
        pointerElements: undefined as never,
        onUpdate: () => {
          // Do nothing
        },
        destroy() {
          document.body.removeChild(self.users[connId].avatarMoveEl);
          const avatarContainer = document.getElementById(
            'bcms-avatar-container'
          );
          if (avatarContainer) {
            avatarContainer.removeChild(self.users[connId].avatarEl);
          }
          if (self.users[connId].pointerElements) {
            document.body.removeChild(self.users[connId].pointerElements.root);
          }
          delete self.users[connId];
        },
      };
      self.users[connId].onUpdate = (handler) => {
        self.users[connId]._handlers.push(handler);
      };
      self.users[connId].avatarEl = createAvatarElement(self.users[connId]);
      const avatarMoveEl = createAvatarElement(self.users[connId]);
      self.users[connId].avatarMoveEl = avatarMoveEl;
      // self.users[connId].avatarMoveEl.style.display = 'none';
      document.body.appendChild(self.users[connId].avatarMoveEl);
      const avatarContainer = document.getElementById('bcms-avatar-container');
      if (avatarContainer) {
        avatarContainer.appendChild(self.users[connId].avatarEl);
      }
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
      root.style.transition = 'all 0.1s';
      root.addEventListener('mouseenter', () => {
        username.style.display = 'block';
      });
      root.addEventListener('mouseleave', () => {
        username.style.display = 'none';
      });

      const cursor = document.createElement('div');
      cursor.innerHTML = `
      <svg class="w-4 h-4 ${user.colors.cursor}" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="fill-current" d="M14.2737 32L0 0L36 9.58755L19.2 16.0623L14.2737 32Z" />
      </svg>`;
      root.appendChild(cursor);

      const username = document.createElement('div');
      username.setAttribute(
        'class',
        `${user.colors.cursor} font-semibold relative left-3 bottom-2 text-sm`
      );
      username.innerText = user.name;
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

    updateEntry(entry, data) {
      /**
       * Prop in meta
       */
      if (data.p.startsWith('m')) {
        const path: Array<string | number> = data.p.substring(1).split('.');
        for (let i = 0; i < path.length; i++) {
          const p = path[i];
          const num = parseInt(p as string);
          if (!isNaN(num)) {
            path[i] = num;
          }
        }
        if (data.sd) {
          window.bcms.prop.mutateValue.string(
            entry.meta[data.li].props,
            path,
            data.sd
          );
        }
      }
    },

    emit: {
      propValueChange(data) {
        window.bcms.sdk.socket.emit(BCMSSocketEventName.SYNC_CHANGE_TSERV, {
          p: window.location.pathname,
          sct: BCMSSocketSyncChangeType.PROP,
          data: {
            p: data.propPath,
            l: data.languageCode,
            li: data.languageIndex,
            sd: data.sd,
          },
        });
      },

      focus(data) {
        window.bcms.sdk.socket.emit(BCMSSocketEventName.SYNC_CHANGE_TSERV, {
          p: window.location.pathname,
          sct: BCMSSocketSyncChangeType.FOCUS,
          data: {
            p: data.propPath,
          },
        });
      },
    },
  };

  return self;
}
