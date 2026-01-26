var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/createStore.ts
import { createTrackedSelector } from "react-tracked";
import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn as createStoreZustand } from "zustand/traditional";

// src/middlewares/devtools.ts
import { devtools } from "zustand/middleware";

// src/middlewares/immer.ts
import { produce } from "immer";
var immerImpl = (initializer) => (set, get, store) => {
  store.setState = (updater, replace, ...a) => {
    const nextState = typeof updater === "function" ? produce(updater) : updater;
    return set(
      nextState,
      typeof replace === "boolean" ? replace : true,
      ...a
    );
  };
  return initializer(store.setState, get, store);
};
var immerMiddleware = immerImpl;

// src/middlewares/mutative.ts
import { create } from "mutative";
var mutativeImpl = (initializer, options) => (set, get, store) => {
  store.setState = (updater, replace, ...a) => {
    const nextState = typeof updater === "function" ? create(
      updater,
      options ? __spreadProps(__spreadValues({}, options), { enablePatches: false }) : options
    ) : updater;
    return set(
      nextState,
      typeof replace === "boolean" ? replace : true,
      ...a
    );
  };
  return initializer(store.setState, get, store);
};
var mutativeMiddleware = mutativeImpl;

// src/middlewares/persist.ts
import { persist } from "zustand/middleware";

// src/utils/helpers.ts
var getOptions = (option, fallbackEnabled = false) => {
  const isBooleanValue = typeof option === "boolean";
  const _a = isBooleanValue ? {} : option || {}, { enabled } = _a, config = __objRest(_a, ["enabled"]);
  const isValueProvided = isBooleanValue ? option : enabled;
  return __spreadValues({
    enabled: isValueProvided != null ? isValueProvided : fallbackEnabled
  }, config);
};

// src/utils/extendActions.ts
var extendActions = (builder, api) => {
  const newActions = builder(api);
  const actions = __spreadValues(__spreadValues({}, api.actions), newActions);
  return __spreadProps(__spreadValues({}, api), {
    actions,
    set: (key, ...args) => {
      if (key in actions) {
        const action = actions[key];
        return action(...args);
      }
      return api.set(key, args[0]);
    }
  });
};

// src/utils/extendSelectors.ts
var identity = (arg) => arg;
var extendSelectors = (builder, api) => {
  const newSelectors = builder(api);
  const selectors = __spreadValues(__spreadValues({}, api.selectors), newSelectors);
  return __spreadProps(__spreadValues({}, api), {
    get: (key, ...args) => {
      if (key in selectors) {
        const selector = selectors[key];
        return selector(...args);
      }
      return api.get(key);
    },
    subscribe: (key, ...args) => {
      if (key in selectors) {
        let options;
        let selector;
        let listener;
        const lastArg1 = args.at(-1);
        const lastArg2 = args.at(-2);
        const lastArg3 = args.at(-3);
        let argsEndIdx = -1;
        if (typeof lastArg1 === "function") {
          listener = lastArg1;
          selector = typeof lastArg2 === "function" ? lastArg2 : identity;
          argsEndIdx = typeof lastArg2 === "function" ? -2 : -1;
        } else {
          options = lastArg1;
          listener = lastArg2;
          selector = lastArg3;
          argsEndIdx = -3;
        }
        return api.subscribe(
          // The key `state` does not matter, as selectors are closures over the `api`
          "state",
          () => selector(
            selectors[key](
              ...args.slice(0, argsEndIdx)
            )
          ),
          listener,
          options
        );
      }
      return api.subscribe(key, ...args);
    },
    selectors,
    useValue: (key, ...args) => {
      if (key in selectors) {
        const selector = selectors[key];
        const lastArg = args.at(-1);
        const equalityFn = typeof lastArg === "function" ? lastArg : void 0;
        const selectorArgs = equalityFn ? args.slice(0, -1) : args;
        return api.useStore(() => selector(...selectorArgs), equalityFn);
      }
      return api.useValue(
        key,
        args[0]
      );
    }
  });
};

// src/utils/storeFactory.ts
var storeFactory = (api) => {
  return __spreadProps(__spreadValues({}, api), {
    actions: api.actions || {},
    extendSelectors: (builder) => storeFactory(extendSelectors(builder, api)),
    extendActions: (builder) => storeFactory(extendActions(builder, api))
  });
};

// src/createStore.ts
var createStore = (initializer, options) => {
  const {
    name,
    devtools: devtoolsOptions,
    immer: immerOptions,
    mutative: mutativeOptions,
    persist: persistOptions,
    isMutativeState
  } = options;
  const middlewares = [];
  const _devtoolsOptionsInternal = getOptions(devtoolsOptions);
  if (_devtoolsOptionsInternal.enabled) {
    middlewares.push(
      (config) => {
        var _a;
        return devtools(config, __spreadProps(__spreadValues({}, _devtoolsOptionsInternal), {
          name: (_a = _devtoolsOptionsInternal == null ? void 0 : _devtoolsOptionsInternal.name) != null ? _a : name
        }));
      }
    );
  }
  const _persistOptionsInternal = getOptions(persistOptions);
  if (_persistOptionsInternal.enabled) {
    middlewares.push(
      (config) => {
        var _a;
        return persist(config, __spreadProps(__spreadValues({}, _persistOptionsInternal), {
          name: (_a = _persistOptionsInternal.name) != null ? _a : name
        }));
      }
    );
  }
  const _immerOptionsInternal = getOptions(immerOptions);
  if (_immerOptionsInternal.enabled) {
    middlewares.push(
      (config) => immerMiddleware(config, _immerOptionsInternal)
    );
  }
  const _mutativeOptionsInternal = getOptions(mutativeOptions);
  if (_mutativeOptionsInternal.enabled) {
    middlewares.push(
      (config) => mutativeMiddleware(config, _mutativeOptionsInternal)
    );
  }
  const stateMutators = middlewares.reverse().reduce(
    (y, fn) => fn(y),
    typeof initializer === "function" ? initializer : () => initializer
  );
  const store = createStoreZustand(subscribeWithSelector(stateMutators));
  const useTrackedStore2 = createTrackedSelector(store);
  const useTracked2 = (key) => {
    return useTrackedStore2()[key];
  };
  const getFn = (key) => {
    if (key === "state") {
      return store.getState();
    }
    return store.getState()[key];
  };
  const subscribeFn = (key, selector, listener, subscribeOptions) => {
    if (key === "state") {
      return store.subscribe(selector, listener, subscribeOptions);
    }
    let wrappedSelector;
    if (listener) {
      wrappedSelector = (state) => selector(state[key]);
    } else {
      listener = selector;
      wrappedSelector = (state) => state[key];
    }
    return store.subscribe(wrappedSelector, listener, subscribeOptions);
  };
  const isMutative = isMutativeState || _immerOptionsInternal.enabled || _mutativeOptionsInternal.enabled;
  const setFn = (key, value) => {
    var _a;
    if (key === "state") {
      return store.setState(value);
    }
    const typedKey = key;
    const prevValue = store.getState()[typedKey];
    if (prevValue === value)
      return;
    const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
    const debugLog = name ? `@@${name}/set${actionKey}` : void 0;
    (_a = store.setState) == null ? void 0 : _a.call(
      store,
      isMutative ? (draft) => {
        draft[typedKey] = value;
      } : { [typedKey]: value },
      void 0,
      debugLog
    );
  };
  const useValue = (key, equalityFn) => {
    return store((state) => state[key], equalityFn);
  };
  const useState = (key, equalityFn) => {
    const value = useValue(key, equalityFn);
    return [value, (val) => setFn(key, val)];
  };
  const apiInternal = {
    get: getFn,
    name,
    set: setFn,
    subscribe: subscribeFn,
    store,
    useStore: store,
    useValue,
    useState,
    useTracked: useTracked2,
    useTrackedStore: useTrackedStore2,
    actions: {},
    selectors: {}
  };
  return storeFactory(apiInternal);
};
var createZustandStore = createStore;

// src/useStore.ts
function useStoreValue(store, key, ...args) {
  return store.useValue(key, ...args);
}
function useStoreState(store, key, equalityFn) {
  return store.useState(key, equalityFn);
}
function useTrackedStore(store) {
  return store.useTrackedStore();
}
function useTracked(store, key) {
  return store.useTracked(key);
}
var useStoreSelect = (store, selector, equalityFn) => {
  return store.useStore(selector, equalityFn);
};
export {
  createStore,
  createZustandStore,
  devtools as devToolsMiddleware,
  extendActions,
  extendSelectors,
  getOptions,
  immerMiddleware,
  mutativeMiddleware,
  persist as persistMiddleware,
  storeFactory,
  useStoreSelect,
  useStoreState,
  useStoreValue,
  useTracked,
  useTrackedStore
};
//# sourceMappingURL=index.mjs.map