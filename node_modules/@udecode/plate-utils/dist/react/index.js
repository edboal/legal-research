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

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  createNodeHOC: () => createNodeHOC,
  createNodesHOC: () => createNodesHOC,
  createNodesWithHOC: () => createNodesWithHOC,
  useEditorString: () => useEditorString,
  useFormInputProps: () => useFormInputProps,
  useMarkToolbarButton: () => useMarkToolbarButton,
  useMarkToolbarButtonState: () => useMarkToolbarButtonState,
  usePlaceholderState: () => usePlaceholderState,
  useRemoveNodeButton: () => useRemoveNodeButton,
  useSelectionAcrossBlocks: () => useSelectionAcrossBlocks,
  useSelectionCollapsed: () => useSelectionCollapsed,
  useSelectionExpanded: () => useSelectionExpanded,
  useSelectionFragment: () => useSelectionFragment,
  useSelectionFragmentProp: () => useSelectionFragmentProp,
  useSelectionWithinBlock: () => useSelectionWithinBlock
});
module.exports = __toCommonJS(react_exports);

// src/react/createNodeHOC.tsx
var import_react = __toESM(require("react"));
var createNodeHOC = (HOC) => (Component, props) => function hoc(childrenProps) {
  return /* @__PURE__ */ import_react.default.createElement(HOC, { ...{ ...childrenProps, ...props } }, /* @__PURE__ */ import_react.default.createElement(Component, { ...childrenProps }));
};

// src/react/createNodesHOC.tsx
var import_castArray = __toESM(require("lodash/castArray.js"));
var import_merge = __toESM(require("lodash/merge.js"));
var createHOC = (withHOC) => {
  return (components, options) => {
    const _components = { ...components };
    const optionsByKey = {};
    const optionsList = (0, import_castArray.default)(options);
    optionsList.forEach(({ key, keys, ...opt }) => {
      const _keys = key ? [key] : keys ?? Object.keys(_components);
      _keys.forEach((_key) => {
        optionsByKey[_key] = (0, import_merge.default)(optionsByKey[_key], opt);
      });
    });
    Object.keys(optionsByKey).forEach((key) => {
      if (!_components[key]) return;
      _components[key] = withHOC(_components[key], optionsByKey[key]);
    });
    return _components;
  };
};
var createNodesHOC = (HOC) => {
  return createHOC(createNodeHOC(HOC));
};
var createNodesWithHOC = (withHOC) => {
  return createHOC(withHOC);
};

// src/react/useEditorString.ts
var import_react2 = require("@udecode/plate-core/react");
var useEditorString = () => {
  return (0, import_react2.useEditorSelector)((editor) => editor.api.string([]), []);
};

// src/react/useFormInputProps.ts
var useFormInputProps = (options) => {
  if (!options) return { props: {} };
  const { preventDefaultOnEnterKeydown } = options;
  const handleEnterKeydownCapture = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
    }
  };
  return {
    props: {
      onKeyDownCapture: preventDefaultOnEnterKeydown ? (e) => handleEnterKeydownCapture(e) : void 0
    }
  };
};

// src/react/useMarkToolbarButton.ts
var import_react3 = require("@udecode/plate-core/react");
var useMarkToolbarButtonState = ({
  clear,
  nodeType
}) => {
  const pressed = (0, import_react3.useEditorSelector)(
    (editor) => editor.api.hasMark(nodeType),
    [nodeType]
  );
  return {
    clear,
    nodeType,
    pressed
  };
};
var useMarkToolbarButton = (state) => {
  const editor = (0, import_react3.useEditorRef)();
  return {
    props: {
      pressed: state.pressed,
      onClick: () => {
        editor.tf.toggleMark(state.nodeType, { remove: state.clear });
        editor.tf.focus();
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};

// src/react/usePlaceholder.ts
var import_react4 = require("@udecode/plate-core/react");
var import_slate = require("@udecode/slate");
var usePlaceholderState = ({
  element,
  hideOnBlur = true,
  path,
  query
}) => {
  const focused = (0, import_react4.useFocused)();
  const selected = (0, import_react4.useSelected)();
  const composing = (0, import_react4.useComposing)();
  const editor = (0, import_react4.useEditorRef)();
  const isEmptyBlock = editor.api.isEmpty(element) && !composing;
  const enabled = isEmptyBlock && (!query || (0, import_slate.queryNode)([element, path], query)) && (!hideOnBlur || editor.api.isCollapsed() && hideOnBlur && focused && selected);
  return {
    enabled
  };
};

// src/react/useRemoveNodeButton.ts
var import_react5 = require("@udecode/plate-core/react");
var useRemoveNodeButton = ({ element }) => {
  const editor = (0, import_react5.useEditorRef)();
  return {
    props: {
      onClick: () => {
        const path = editor.api.findPath(element);
        editor.tf.removeNodes({ at: path });
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};

// src/react/useSelection.ts
var import_react6 = require("@udecode/plate-core/react");
function useSelectionCollapsed() {
  return (0, import_react6.useEditorSelector)((editor) => !editor.api.isExpanded(), []);
}
function useSelectionExpanded() {
  return (0, import_react6.useEditorSelector)((editor) => editor.api.isExpanded(), []);
}
function useSelectionWithinBlock() {
  return (0, import_react6.useEditorSelector)((editor) => editor.api.isAt({ block: true }), []);
}
function useSelectionAcrossBlocks() {
  return (0, import_react6.useEditorSelector)((editor) => editor.api.isAt({ blocks: true }), []);
}

// src/react/useSelectionFragment.ts
var import_react7 = require("@udecode/plate-core/react");
var useSelectionFragment = (options) => {
  return (0, import_react7.useEditorSelector)((editor) => {
    return editor.api.fragment(editor.selection, options);
  }, []);
};
var useSelectionFragmentProp = ({
  structuralTypes,
  ...options
} = {}) => {
  return (0, import_react7.useEditorSelector)((editor) => {
    const fragment = editor.api.fragment(editor.selection, {
      structuralTypes
    });
    return editor.api.prop({ nodes: fragment, ...options });
  }, []);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNodeHOC,
  createNodesHOC,
  createNodesWithHOC,
  useEditorString,
  useFormInputProps,
  useMarkToolbarButton,
  useMarkToolbarButtonState,
  usePlaceholderState,
  useRemoveNodeButton,
  useSelectionAcrossBlocks,
  useSelectionCollapsed,
  useSelectionExpanded,
  useSelectionFragment,
  useSelectionFragmentProp,
  useSelectionWithinBlock
});
//# sourceMappingURL=index.js.map