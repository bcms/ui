/* eslint-disable @typescript-eslint/no-explicit-any */
import * as uuid from 'uuid';

export interface Route {
  path: string;
  component: any;
  props?: any;
  children?: Route[];
}
export interface RouteOptions {
  data?: any;
  replace: boolean;
}
export interface RouteParams {
  [key: string]: string;
}
export interface RouterPrototype {
  setTitle(title: string): void;
  listen(listener: RouterListener): void;
  register(routes: Route[], defaultRoute?: RouteInternal, base?: string): void;
  unregister(path: string): void;
  navigate(path: string, options?: RouteOptions): void;
  path(): string;
  subscribeToPathChange(callback: (path: string) => void): () => void;
}

interface RouteInternal {
  path: string;
  component: any;
  props?: any;
}
type RouterRegistry = {
  [path: string]: {
    id: string;
    pathParts: string[];
    route: RouteInternal;
  };
};
type RouterListener = (
  component: any,
  params?: RouteParams,
  props?: any,
  options?: RouteOptions
) => void;

function onPathChange(
  registry: RouterRegistry,
  listener: RouterListener,
  defaultRoute: Route,
  path: string,
  options: RouteOptions
) {
  const exec = registry[path];
  if (exec) {
    listener(exec.route.component, {}, exec.route.props, options);
    return;
  }
  const pathParts = path.split('?')[0].split('/');
  for (const key in registry) {
    const reg = registry[key];
    if (reg.pathParts.length === pathParts.length) {
      const params: RouteParams = {};
      let match = true;
      for (const i in reg.pathParts) {
        if (reg.pathParts[i].charAt(0) === ':') {
          params[reg.pathParts[i].substring(1)] = pathParts[i];
        } else if (reg.pathParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        listener(reg.route.component, params, reg.route.props, options);
        return;
      }
    }
  }
  if (defaultRoute) {
    console.log(path);
    listener(defaultRoute.component, {}, defaultRoute.props, options);
  }
}

function router() {
  const registry: RouterRegistry = {};
  const pathChangeSubs: Array<{
    id: string;
    callback: (path: string) => void;
  }> = [];
  let defaultRoute: Route;
  let currentPath = window.location.pathname;
  let listener: RouterListener;

  const self: RouterPrototype = {
    setTitle(title) {
      document.title = `${title} | BCMS`;
    },
    listen(_listener) {
      listener = _listener;
    },
    register(_routes, dRoute, base) {
      if (dRoute) {
        defaultRoute = dRoute;
      }
      if (typeof base === 'undefined') {
        base = '';
      }
      _routes.forEach((route) => {
        if (route.children) {
          self.register(route.children, undefined, route.path);
        }
        registry[base + route.path] = {
          id: uuid.v4(),
          pathParts: (base + route.path).split('/'),
          route: {
            component: route.component,
            path: route.path,
            props: route.props,
          },
        };
      });
    },
    unregister(path) {
      if (registry[path]) {
        delete registry[path];
      }
    },
    navigate(path: string, options) {
      currentPath = path;
      if (options) {
        if (options.replace) {
          window.history.replaceState(options.data, '', path);
        } else {
          window.history.pushState(options.data, '', path);
        }
      } else {
        window.history.pushState(undefined, '', path);
      }
      onPathChange(registry, listener, defaultRoute, path, options);
      pathChangeSubs.forEach((e) => {
        e.callback(path);
      });
    },
    path() {
      return currentPath;
    },
    subscribeToPathChange(callback) {
      const id = uuid.v4();
      pathChangeSubs.push({
        id,
        callback,
      });
      return () => {
        for (let i = 0; i < pathChangeSubs.length; i++) {
          if (pathChangeSubs[i].id === id) {
            pathChangeSubs.splice(i, 1);
            break;
          }
        }
      };
    },
  };
  return self;
}

export const Router = router();
