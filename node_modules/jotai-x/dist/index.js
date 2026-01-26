"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  HydrateAtoms: () => HydrateAtoms,
  atomWithFn: () => atomWithFn,
  createAtomProvider: () => createAtomProvider,
  createAtomStore: () => createAtomStore,
  useAtomStore: () => useAtomStore,
  useAtomStoreSet: () => useAtomStoreSet,
  useAtomStoreState: () => useAtomStoreState,
  useAtomStoreValue: () => useAtomStoreValue,
  useHydrateStore: () => useHydrateStore,
  useStoreAtomState: () => useStoreAtomState,
  useStoreAtomValue: () => useStoreAtomValue,
  useStoreSetAtom: () => useStoreSetAtom,
  useSyncStore: () => useSyncStore
});
module.exports = __toCommonJS(src_exports);

// src/atomWithFn.ts
var import_jotai = require("jotai");
var wrapFn = (fnOrValue) => typeof fnOrValue === "function" ? { __fn: fnOrValue } : fnOrValue;
var unwrapFn = (wrappedFnOrValue) => wrappedFnOrValue && typeof wrappedFnOrValue === "object" && "__fn" in wrappedFnOrValue ? wrappedFnOrValue.__fn : wrappedFnOrValue;
var atomWithFn = (initialValue) => {
  const baseAtom = (0, import_jotai.atom)(wrapFn(initialValue));
  return (0, import_jotai.atom)(
    (get) => unwrapFn(get(baseAtom)),
    (_get, set, value) => set(baseAtom, wrapFn(value))
  );
};

// src/createAtomProvider.tsx
var import_react2 = __toESM(require("react"));
var import_vanilla = require("jotai/vanilla");

// src/useHydrateStore.ts
var import_react = __toESM(require("react"));
var import_jotai2 = require("jotai");
var import_utils = require("jotai/utils");
var useHydrateStore = (atoms, initialValues, options = {}) => {
  const values = [];
  for (const key of Object.keys(atoms)) {
    const initialValue = initialValues[key];
    if (initialValue !== void 0) {
      values.push([atoms[key], initialValue]);
    }
  }
  (0, import_utils.useHydrateAtoms)(values, options);
};
var useSyncStore = (atoms, values, { store } = {}) => {
  for (const key of Object.keys(atoms)) {
    const value = values[key];
    const atom2 = atoms[key];
    const set = (0, import_jotai2.useSetAtom)(atom2, { store });
    import_react.default.useEffect(() => {
      if (value !== void 0 && value !== null) {
        set(value);
      }
    }, [set, value]);
  }
};

// src/createAtomProvider.tsx
var getFullyQualifiedScope = (storeName, scope) => {
  return `${storeName}:${scope}`;
};
var PROVIDER_SCOPE = "provider";
var AtomStoreContext = import_react2.default.createContext(
  /* @__PURE__ */ new Map()
);
var useAtomStore = (storeName, scope = PROVIDER_SCOPE, warnIfUndefined = true) => {
  var _a;
  const storeContext = import_react2.default.useContext(AtomStoreContext);
  const store = (_a = storeContext.get(getFullyQualifiedScope(storeName, scope))) != null ? _a : storeContext.get(getFullyQualifiedScope(storeName, PROVIDER_SCOPE));
  if (!store && warnIfUndefined) {
    console.warn(
      `Tried to access jotai store '${storeName}' outside of a matching provider.`
    );
  }
  return store;
};
var HydrateAtoms = (_a) => {
  var _b = _a, {
    initialValues,
    children,
    store,
    atoms
  } = _b, props = __objRest(_b, [
    "initialValues",
    "children",
    "store",
    "atoms"
  ]);
  useHydrateStore(atoms, __spreadValues(__spreadValues({}, initialValues), props), {
    store
  });
  useSyncStore(atoms, props, {
    store
  });
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, children);
};
var createAtomProvider = (storeScope, atoms, options = {}) => {
  const Effect = options.effect;
  return (_a) => {
    var _b = _a, { store, scope, children, resetKey } = _b, props = __objRest(_b, ["store", "scope", "children", "resetKey"]);
    const [storeState, setStoreState] = import_react2.default.useState((0, import_vanilla.createStore)());
    import_react2.default.useEffect(() => {
      if (resetKey) {
        setStoreState((0, import_vanilla.createStore)());
      }
    }, [resetKey]);
    const previousStoreContext = import_react2.default.useContext(AtomStoreContext);
    const storeContext = import_react2.default.useMemo(() => {
      const newStoreContext = new Map(previousStoreContext);
      if (scope) {
        newStoreContext.set(
          getFullyQualifiedScope(storeScope, scope),
          storeState
        );
      }
      newStoreContext.set(
        getFullyQualifiedScope(storeScope, PROVIDER_SCOPE),
        storeState
      );
      return newStoreContext;
    }, [previousStoreContext, scope, storeState]);
    return /* @__PURE__ */ import_react2.default.createElement(AtomStoreContext.Provider, { value: storeContext }, /* @__PURE__ */ import_react2.default.createElement(HydrateAtoms, __spreadValues({ store: storeState, atoms }, props), !!Effect && /* @__PURE__ */ import_react2.default.createElement(Effect, null), children));
  };
};

// src/createAtomStore.ts
var import_react3 = __toESM(require("react"));
var import_jotai3 = require("jotai");
var import_utils2 = require("jotai/utils");
var capitalizeFirstLetter = (str = "") => str.length > 0 ? str[0].toUpperCase() + str.slice(1) : "";
var getProviderIndex = (name = "") => `${capitalizeFirstLetter(name)}Provider`;
var getStoreIndex = (name = "") => name.length > 0 ? `${name}Store` : "store";
var getUseStoreIndex = (name = "") => `use${capitalizeFirstLetter(name)}Store`;
var getUseValueIndex = (key = "") => `use${capitalizeFirstLetter(key)}Value`;
var getGetIndex = (key = "") => `get${capitalizeFirstLetter(key)}`;
var getUseSetIndex = (key = "") => `useSet${capitalizeFirstLetter(key)}`;
var getSetIndex = (key = "") => `set${capitalizeFirstLetter(key)}`;
var getUseStateIndex = (key = "") => `use${capitalizeFirstLetter(key)}State`;
var getSubscribeIndex = (key = "") => `subscribe${capitalizeFirstLetter(key)}`;
var isAtom = (possibleAtom) => !!possibleAtom && typeof possibleAtom === "object" && "read" in possibleAtom && typeof possibleAtom.read === "function";
var withStoreAndOptions = (fnRecord, getIndex, store, options) => Object.fromEntries(
  Object.entries(fnRecord).map(([key, fn]) => [
    getIndex(key),
    (...args) => fn(store, options, ...args)
  ])
);
var withKeyAndStoreAndOptions = (fnRecord, store, options) => (key, ...args) => fnRecord[key](store, options, ...args);
var convertScopeShorthand = (optionsOrScope = {}) => typeof optionsOrScope === "string" ? { scope: optionsOrScope } : optionsOrScope;
var useConvertScopeShorthand = (optionsOrScope) => {
  const convertedOptions = convertScopeShorthand(optionsOrScope);
  return (0, import_react3.useMemo)(() => convertedOptions, Object.values(convertedOptions));
};
var identity = (x) => x;
var createAtomStore = (initialState, {
  name,
  delay: delayRoot,
  effect,
  extend,
  infiniteRenderDetectionLimit = 1e5,
  suppressWarnings
}) => {
  const providerIndex = getProviderIndex(name);
  const useStoreIndex = getUseStoreIndex(name);
  const storeIndex = getStoreIndex(name);
  const atomsWithoutExtend = {};
  const writableAtomsWithoutExtend = {};
  const atomIsWritable = {};
  for (const [key, atomOrValue] of Object.entries(initialState)) {
    const atomConfig = isAtom(atomOrValue) ? atomOrValue : atomWithFn(atomOrValue);
    atomsWithoutExtend[key] = atomConfig;
    const writable = "write" in atomConfig;
    atomIsWritable[key] = writable;
    if (writable) {
      writableAtomsWithoutExtend[key] = atomConfig;
    }
  }
  const atoms = __spreadValues({}, atomsWithoutExtend);
  if (extend) {
    const extendedAtoms = extend(atomsWithoutExtend);
    for (const [key, atomConfig] of Object.entries(extendedAtoms)) {
      atoms[key] = atomConfig;
      atomIsWritable[key] = "write" in atomConfig;
    }
  }
  const atomsOfUseValue = {};
  const atomsOfGet = {};
  const atomsOfUseSet = {};
  const atomsOfSet = {};
  const atomsOfUseState = {};
  const atomsOfSubscribe = {};
  const useStore = (optionsOrScope = {}) => {
    const {
      scope,
      store,
      warnIfNoStore = !suppressWarnings
    } = convertScopeShorthand(optionsOrScope);
    const contextStore = useAtomStore(name, scope, !store && warnIfNoStore);
    return store != null ? store : contextStore;
  };
  let renderCount = 0;
  const useAtomValueWithStore = (atomConfig, store, optionsOrScope, selector, equalityFnOrDeps, deps) => {
    var _a, _b;
    if (process.env.NODE_ENV !== "production" && infiniteRenderDetectionLimit) {
      renderCount += 1;
      if (renderCount > infiniteRenderDetectionLimit) {
        throw new Error(
          `
use<Key>Value/useValue/use<StoreName>Value has rendered ${infiniteRenderDetectionLimit} times in the same render.
It is very likely to have fallen into an infinite loop.
That is because you do not memoize the selector/equalityFn function param.
Please wrap them with useCallback or configure the deps array correctly.`
        );
      }
      setTimeout(() => {
        renderCount = 0;
      });
    }
    const options = convertScopeShorthand(optionsOrScope);
    selector != null ? selector : selector = identity;
    const equalityFn = typeof equalityFnOrDeps === "function" ? equalityFnOrDeps : void 0;
    deps = (_a = typeof equalityFnOrDeps === "function" ? deps : equalityFnOrDeps) != null ? _a : [selector, equalityFn];
    const [memoizedSelector, memoizedEqualityFn] = import_react3.default.useMemo(
      () => [selector, equalityFn],
      deps
    );
    const selectorAtom = (0, import_utils2.selectAtom)(
      atomConfig,
      memoizedSelector,
      memoizedEqualityFn
    );
    return (0, import_jotai3.useAtomValue)(selectorAtom, {
      store,
      delay: (_b = options.delay) != null ? _b : delayRoot
    });
  };
  const getAtomWithStore = (atomConfig, store, _optionsOrScope) => {
    return (store != null ? store : (0, import_jotai3.getDefaultStore)()).get(atomConfig);
  };
  const useSetAtomWithStore = (atomConfig, store, _optionsOrScope) => {
    return (0, import_jotai3.useSetAtom)(atomConfig, { store });
  };
  const setAtomWithStore = (atomConfig, store, _optionsOrScope) => {
    return (...args) => (store != null ? store : (0, import_jotai3.getDefaultStore)()).set(
      atomConfig,
      ...args
    );
  };
  const useAtomStateWithStore = (atomConfig, store, optionsOrScope) => {
    const { delay = delayRoot } = convertScopeShorthand(optionsOrScope);
    return (0, import_jotai3.useAtom)(atomConfig, { store, delay });
  };
  const subscribeAtomWithStore = (atomConfig, store, _optionsOrScope) => {
    return (callback) => {
      store != null ? store : store = (0, import_jotai3.getDefaultStore)();
      const unsubscribe = store.sub(atomConfig, () => {
        callback(store.get(atomConfig));
      });
      return () => unsubscribe();
    };
  };
  for (const key of Object.keys(atoms)) {
    const atomConfig = atoms[key];
    const isWritable = atomIsWritable[key];
    atomsOfUseValue[key] = (store, optionsOrScope = {}, selector, equalityFnOrDeps, deps) => useAtomValueWithStore(
      atomConfig,
      store,
      optionsOrScope,
      selector,
      equalityFnOrDeps,
      deps
    );
    atomsOfGet[key] = (store, optionsOrScope = {}) => getAtomWithStore(atomConfig, store, optionsOrScope);
    atomsOfSubscribe[key] = (store, optionsOrScope = {}, callback) => subscribeAtomWithStore(atomConfig, store, optionsOrScope)(callback);
    if (isWritable) {
      atomsOfUseSet[key] = (store, optionsOrScope = {}) => useSetAtomWithStore(
        atomConfig,
        store,
        optionsOrScope
      );
      atomsOfSet[key] = (store, optionsOrScope = {}, ...args) => setAtomWithStore(
        atomConfig,
        store,
        optionsOrScope
      )(...args);
      atomsOfUseState[key] = (store, optionsOrScope = {}) => useAtomStateWithStore(
        atomConfig,
        store,
        optionsOrScope
      );
    }
  }
  const Provider = createAtomProvider(
    name,
    writableAtomsWithoutExtend,
    { effect }
  );
  const storeApi = {
    atom: atoms,
    name
  };
  const useStoreApi = (options = {}) => {
    const convertedOptions = useConvertScopeShorthand(options);
    const store = useStore(convertedOptions);
    return (0, import_react3.useMemo)(
      () => __spreadProps(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, withStoreAndOptions(
        atomsOfUseValue,
        getUseValueIndex,
        store,
        convertedOptions
      )), withStoreAndOptions(
        atomsOfGet,
        getGetIndex,
        store,
        convertedOptions
      )), withStoreAndOptions(
        atomsOfUseSet,
        getUseSetIndex,
        store,
        convertedOptions
      )), withStoreAndOptions(
        atomsOfSet,
        getSetIndex,
        store,
        convertedOptions
      )), withStoreAndOptions(
        atomsOfUseState,
        getUseStateIndex,
        store,
        convertedOptions
      )), withStoreAndOptions(
        atomsOfSubscribe,
        getSubscribeIndex,
        store,
        convertedOptions
      )), {
        // store.useValue('key')
        useValue: withKeyAndStoreAndOptions(
          atomsOfUseValue,
          store,
          convertedOptions
        ),
        // store.get('key')
        get: withKeyAndStoreAndOptions(
          atomsOfGet,
          store,
          convertedOptions
        ),
        // store.useSet('key')
        useSet: withKeyAndStoreAndOptions(
          atomsOfUseSet,
          store,
          convertedOptions
        ),
        // store.set('key', ...args)
        set: withKeyAndStoreAndOptions(
          atomsOfSet,
          store,
          convertedOptions
        ),
        // store.useState('key')
        useState: withKeyAndStoreAndOptions(
          atomsOfUseState,
          store,
          convertedOptions
        ),
        // store.subscribe('key', callback)
        subscribe: withKeyAndStoreAndOptions(
          atomsOfSubscribe,
          store,
          convertedOptions
        ),
        // store.useAtomValue(atomConfig)
        useAtomValue: (atomConfig, selector, equalityFnOrDeps, deps) => (
          // eslint-disable-next-line react-compiler/react-compiler
          useAtomValueWithStore(
            atomConfig,
            store,
            convertedOptions,
            selector,
            equalityFnOrDeps,
            deps
          )
        ),
        // store.getAtom(atomConfig)
        getAtom: (atomConfig) => getAtomWithStore(atomConfig, store, convertedOptions),
        // store.useSetAtom(atomConfig)
        useSetAtom: (atomConfig) => (
          // eslint-disable-next-line react-compiler/react-compiler
          useSetAtomWithStore(atomConfig, store, convertedOptions)
        ),
        // store.setAtom(atomConfig, ...args)
        setAtom: (atomConfig) => setAtomWithStore(atomConfig, store, convertedOptions),
        // store.useAtomState(atomConfig)
        useAtomState: (atomConfig) => (
          // eslint-disable-next-line react-compiler/react-compiler
          useAtomStateWithStore(atomConfig, store, convertedOptions)
        ),
        // store.subscribeAtom(atomConfig, callback)
        subscribeAtom: (atomConfig) => subscribeAtomWithStore(atomConfig, store, convertedOptions),
        store
      }),
      [store, convertedOptions]
    );
  };
  const useNameState = (key, options) => {
    var _a;
    const store = (_a = useStore(options)) != null ? _a : (0, import_jotai3.getDefaultStore)();
    return useAtomStateWithStore(atoms[key], store, options);
  };
  const useNameValue = (key, _a = {}, deps) => {
    var _b = _a, {
      equalityFn,
      selector
    } = _b, options = __objRest(_b, [
      "equalityFn",
      "selector"
    ]);
    var _a2;
    const store = (_a2 = useStore(options)) != null ? _a2 : (0, import_jotai3.getDefaultStore)();
    return useAtomValueWithStore(
      atoms[key],
      store,
      options,
      selector,
      equalityFn != null ? equalityFn : deps,
      equalityFn && deps
    );
  };
  const useNameSet = (key, options) => {
    var _a;
    const store = (_a = useStore(options)) != null ? _a : (0, import_jotai3.getDefaultStore)();
    return useSetAtomWithStore(atoms[key], store, options);
  };
  return {
    [providerIndex]: Provider,
    [useStoreIndex]: useStoreApi,
    [storeIndex]: storeApi,
    [`use${capitalizeFirstLetter(name)}State`]: useNameState,
    [`use${capitalizeFirstLetter(name)}Value`]: useNameValue,
    [`use${capitalizeFirstLetter(name)}Set`]: useNameSet,
    name
  };
};
function useAtomStoreValue(store, key, selector, equalityFnOrDeps, deps) {
  return store.useValue(key, selector, equalityFnOrDeps, deps);
}
function useAtomStoreSet(store, key) {
  return store.useSet(key);
}
function useAtomStoreState(store, key) {
  return store.useState(key);
}
function useStoreAtomValue(store, atom2, selector, equalityFnOrDeps, deps) {
  return store.useAtomValue(atom2, selector, equalityFnOrDeps, deps);
}
function useStoreSetAtom(store, atom2) {
  return store.useSetAtom(atom2);
}
function useStoreAtomState(store, atom2) {
  return store.useAtomState(atom2);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HydrateAtoms,
  atomWithFn,
  createAtomProvider,
  createAtomStore,
  useAtomStore,
  useAtomStoreSet,
  useAtomStoreState,
  useAtomStoreValue,
  useHydrateStore,
  useStoreAtomState,
  useStoreAtomValue,
  useStoreSetAtom,
  useSyncStore
});
//# sourceMappingURL=index.js.map