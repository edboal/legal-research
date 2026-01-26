"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var index_exports = {};
__export(index_exports, {
  Box: () => Box,
  CAN_USE_DOM: () => CAN_USE_DOM,
  DEFAULT_IGNORE_CLASS: () => DEFAULT_IGNORE_CLASS,
  MemoizedChildren: () => MemoizedChildren,
  PortalBody: () => PortalBody,
  Text: () => Text,
  composeEventHandlers: () => composeEventHandlers,
  composeRefs: () => composeRefs,
  createPrimitiveComponent: () => createPrimitiveComponent,
  createPrimitiveElement: () => createPrimitiveElement,
  createSlotComponent: () => createSlotComponent,
  useComposedRef: () => useComposedRef,
  useEffectOnce: () => useEffectOnce,
  useIsomorphicLayoutEffect: () => useIsomorphicLayoutEffect,
  useMemoOnce: () => useMemoOnce,
  useMemoizedSelector: () => useMemoizedSelector,
  useOnClickOutside: () => useOnClickOutside,
  useStableFn: () => useStableFn,
  useStableMemo: () => useStableMemo,
  withProviders: () => withProviders,
  withRef: () => withRef
});
module.exports = __toCommonJS(index_exports);

// src/createSlotComponent.tsx
var import_react = __toESM(require("react"));
var import_react_slot = require("@radix-ui/react-slot");
var createSlotComponent = (element) => import_react.default.forwardRef(({ as, asChild = false, ...props }, ref) => {
  const Comp = asChild ? import_react_slot.Slot : as || element;
  return /* @__PURE__ */ import_react.default.createElement(Comp, { ref, ...props });
});

// src/Box.tsx
var Box = createSlotComponent("div");

// src/MemoizedChildren.tsx
var import_react2 = __toESM(require("react"));
var MemoizedChildren = import_react2.default.memo(
  ({ children }) => {
    return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, children);
  }
);

// src/PortalBody.tsx
var import_react3 = __toESM(require("react"));
var import_react_dom = __toESM(require("react-dom"));
var PortalBody = ({
  children,
  element
}) => {
  const container = element || typeof window !== "undefined" ? document.body : void 0;
  if (!container) return /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, children);
  return import_react_dom.default.createPortal(children, element || document.body);
};

// src/Text.tsx
var Text = createSlotComponent("span");

// src/composeEventHandlers.ts
var composeEventHandlers = (originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) => (event) => {
  originalEventHandler?.(event);
  if (checkForDefaultPrevented === false || !event.defaultPrevented) {
    return ourEventHandler?.(event);
  }
};

// src/createPrimitiveComponent.tsx
var import_react5 = __toESM(require("react"));
var import_utils = require("@udecode/utils");
var import_clsx = require("clsx");

// src/useComposedRef.ts
var import_react4 = __toESM(require("react"));
var setRef = (ref, value) => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
};
var composeRefs = (...refs) => (node) => refs.forEach((ref) => setRef(ref, node));
var useComposedRef = (...refs) => {
  return import_react4.default.useCallback(composeRefs(...refs), refs);
};

// src/createPrimitiveComponent.tsx
var createPrimitiveComponent = (element) => {
  const Comp = createSlotComponent(element);
  return ({
    propsHook,
    stateHook
  } = {}) => {
    return import_react5.default.forwardRef(
      ({
        asChild,
        className: classNameProp,
        getClassName,
        options,
        state: stateProp,
        ...props
      }, ref) => {
        const state = (0, import_utils.isDefined)(stateProp) ? stateProp : stateHook ? stateHook(options) : void 0;
        const {
          hidden,
          props: hookProps,
          ref: hookRef
        } = propsHook ? propsHook(state) : { hidden: false, props: {}, ref: null };
        const _ref = useComposedRef(ref, hookRef);
        const className = (0, import_utils.isDefined)(hookProps?.className) || (0, import_utils.isDefined)(classNameProp) ? (0, import_clsx.clsx)(hookProps?.className, classNameProp) : void 0;
        const style = hookProps?.style || props.style ? { ...hookProps?.style, ...props.style } : void 0;
        if (!asChild && hidden) return null;
        return /* @__PURE__ */ import_react5.default.createElement(
          Comp,
          {
            ref: _ref,
            asChild,
            ...hookProps,
            className,
            style,
            ...props,
            ...props.setProps?.(hookProps ?? {}) ?? {}
          }
        );
      }
    );
  };
};

// src/createPrimitiveElement.tsx
var import_react6 = __toESM(require("react"));
function createPrimitiveElement(tag) {
  return import_react6.default.forwardRef(
    function CreateComponent(props, ref) {
      return import_react6.default.createElement(tag, { ...props, ref });
    }
  );
}

// src/useEffectOnce.ts
var import_react7 = __toESM(require("react"));
function useEffectOnce(effect, deps) {
  const initialized = import_react7.default.useRef(false);
  const prevDepsRef = import_react7.default.useRef(deps);
  import_react7.default.useEffect(() => {
    const depsChanged = deps.some((dep, i) => dep !== prevDepsRef.current[i]);
    if (!initialized.current || depsChanged) {
      initialized.current = true;
      prevDepsRef.current = deps;
      effect();
    }
  }, deps);
}

// src/useIsomorphicLayoutEffect.ts
var import_react8 = __toESM(require("react"));
var CAN_USE_DOM = typeof window !== "undefined" && window.document?.createElement !== void 0;
var useIsomorphicLayoutEffect = CAN_USE_DOM ? import_react8.default.useLayoutEffect : import_react8.default.useEffect;

// src/useMemoOnce.ts
var import_react9 = __toESM(require("react"));
function useMemoOnce(factory, deps) {
  const initialized = import_react9.default.useRef(false);
  const prevDepsRef = import_react9.default.useRef(deps);
  const memoizedValueRef = import_react9.default.useRef(void 0);
  if (!initialized.current || deps.some((dep, i) => dep !== prevDepsRef.current[i])) {
    initialized.current = true;
    prevDepsRef.current = deps;
    memoizedValueRef.current = factory();
  }
  return memoizedValueRef.current;
}

// src/useMemoizedSelector.ts
var import_react10 = __toESM(require("react"));
function useMemoizedSelector(selector, deps, equalityFn = (a, b) => a === b) {
  const [memoizedValue, setMemoizedValue] = import_react10.default.useState(() => selector());
  const previousValueRef = import_react10.default.useRef(memoizedValue);
  import_react10.default.useEffect(() => {
    const newValue = selector();
    if (!equalityFn(previousValueRef.current, newValue)) {
      setMemoizedValue(newValue);
      previousValueRef.current = newValue;
    }
  }, deps);
  return memoizedValue;
}

// src/useOnClickOutside.ts
var import_react11 = __toESM(require("react"));
var canUsePassiveEvents = () => {
  if (typeof window === "undefined" || typeof window.addEventListener !== "function")
    return false;
  let passive = false;
  const options = Object.defineProperty({}, "passive", {
    get() {
      passive = true;
    }
  });
  const noop = () => null;
  window.addEventListener("test", noop, options);
  window.removeEventListener("test", noop, options);
  return passive;
};
var DEFAULT_IGNORE_CLASS = "ignore-onclickoutside";
var checkClass = (el, cl) => el.classList?.contains(cl);
var hasIgnoreClass = (e, ignoreClass) => {
  let el = e.target || e;
  while (el) {
    if (Array.isArray(ignoreClass)) {
      if (ignoreClass.some((c) => checkClass(el, c))) return true;
    } else if (checkClass(el, ignoreClass)) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
};
var clickedOnScrollbar = (e) => document.documentElement.clientWidth <= e.clientX || document.documentElement.clientHeight <= e.clientY;
var getEventOptions = (type) => type.includes("touch") && canUsePassiveEvents() ? { passive: true } : false;
var useOnClickOutside = (callback, {
  detectIFrame = true,
  disabled,
  eventTypes = ["mousedown", "touchstart"],
  excludeScrollbar,
  ignoreClass = DEFAULT_IGNORE_CLASS,
  refs: refsOpt
} = {}) => {
  const [refsState, setRefsState] = import_react11.default.useState([]);
  const callbackRef = import_react11.default.useRef(callback);
  callbackRef.current = callback;
  const ref = import_react11.default.useCallback(
    (el) => setRefsState((prevState) => [...prevState, { current: el }]),
    []
  );
  import_react11.default.useEffect(
    () => {
      if (!refsOpt?.length && refsState.length === 0) return;
      const getEls = () => {
        const els = [];
        (refsOpt || refsState).forEach(
          ({ current }) => current && els.push(current)
        );
        return els;
      };
      const handler = (e) => {
        if (!hasIgnoreClass(e, ignoreClass) && !(excludeScrollbar && clickedOnScrollbar(e)) && getEls().every((el) => !el.contains(e.target)))
          callbackRef.current(e);
      };
      const blurHandler = (e) => (
        // On firefox the iframe becomes document.activeElement in the next event loop
        setTimeout(() => {
          const { activeElement } = document;
          if (activeElement?.tagName === "IFRAME" && !hasIgnoreClass(activeElement, ignoreClass) && !getEls().includes(activeElement))
            callbackRef.current(e);
        }, 0)
      );
      const removeEventListener = () => {
        eventTypes.forEach(
          (type) => document.removeEventListener(
            type,
            handler,
            getEventOptions(type)
          )
        );
        if (detectIFrame) window.removeEventListener("blur", blurHandler);
      };
      if (disabled) {
        removeEventListener();
        return;
      }
      eventTypes.forEach(
        (type) => document.addEventListener(type, handler, getEventOptions(type))
      );
      if (detectIFrame) window.addEventListener("blur", blurHandler);
      return () => removeEventListener();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      refsState,
      ignoreClass,
      excludeScrollbar,
      disabled,
      detectIFrame,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(eventTypes)
    ]
  );
  return ref;
};

// src/useStableFn.ts
var import_react12 = __toESM(require("react"));
var useStableFn = (fn, deps = []) => {
  const fnRef = import_react12.default.useRef(fn);
  fnRef.current = fn;
  return import_react12.default.useCallback((...args) => fnRef.current(...args), deps);
};

// src/useStableMemo.ts
var import_react13 = __toESM(require("react"));
var useStableMemo = (producer, deps) => {
  const [value, setValue] = import_react13.default.useState(producer);
  import_react13.default.useLayoutEffect(() => {
    setValue(producer);
  }, deps);
  return value;
};

// src/withProviders.tsx
var import_react14 = __toESM(require("react"));
var withProviders = (...providers) => (WrappedComponent) => (props) => providers.reduceRight(
  (acc, prov) => {
    let Provider = prov;
    if (Array.isArray(prov)) {
      [Provider] = prov;
      return /* @__PURE__ */ import_react14.default.createElement(Provider, { ...prov[1] }, acc);
    }
    return /* @__PURE__ */ import_react14.default.createElement(Provider, null, acc);
  },
  /* @__PURE__ */ import_react14.default.createElement(WrappedComponent, { ...props })
);

// src/withRef.tsx
var import_react15 = __toESM(require("react"));
function withRef(renderFunction) {
  return import_react15.default.forwardRef(renderFunction);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Box,
  CAN_USE_DOM,
  DEFAULT_IGNORE_CLASS,
  MemoizedChildren,
  PortalBody,
  Text,
  composeEventHandlers,
  composeRefs,
  createPrimitiveComponent,
  createPrimitiveElement,
  createSlotComponent,
  useComposedRef,
  useEffectOnce,
  useIsomorphicLayoutEffect,
  useMemoOnce,
  useMemoizedSelector,
  useOnClickOutside,
  useStableFn,
  useStableMemo,
  withProviders,
  withRef
});
//# sourceMappingURL=index.js.map