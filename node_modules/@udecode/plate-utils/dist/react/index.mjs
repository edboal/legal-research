// src/react/createNodeHOC.tsx
import React from "react";
var createNodeHOC = (HOC) => (Component, props) => function hoc(childrenProps) {
  return /* @__PURE__ */ React.createElement(HOC, { ...{ ...childrenProps, ...props } }, /* @__PURE__ */ React.createElement(Component, { ...childrenProps }));
};

// src/react/createNodesHOC.tsx
import castArray from "lodash/castArray.js";
import merge from "lodash/merge.js";
var createHOC = (withHOC) => {
  return (components, options) => {
    const _components = { ...components };
    const optionsByKey = {};
    const optionsList = castArray(options);
    optionsList.forEach(({ key, keys, ...opt }) => {
      const _keys = key ? [key] : keys ?? Object.keys(_components);
      _keys.forEach((_key) => {
        optionsByKey[_key] = merge(optionsByKey[_key], opt);
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
import { useEditorSelector } from "@udecode/plate-core/react";
var useEditorString = () => {
  return useEditorSelector((editor) => editor.api.string([]), []);
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
import { useEditorRef, useEditorSelector as useEditorSelector2 } from "@udecode/plate-core/react";
var useMarkToolbarButtonState = ({
  clear,
  nodeType
}) => {
  const pressed = useEditorSelector2(
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
  const editor = useEditorRef();
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
import {
  useComposing,
  useEditorRef as useEditorRef2,
  useFocused,
  useSelected
} from "@udecode/plate-core/react";
import { queryNode } from "@udecode/slate";
var usePlaceholderState = ({
  element,
  hideOnBlur = true,
  path,
  query
}) => {
  const focused = useFocused();
  const selected = useSelected();
  const composing = useComposing();
  const editor = useEditorRef2();
  const isEmptyBlock = editor.api.isEmpty(element) && !composing;
  const enabled = isEmptyBlock && (!query || queryNode([element, path], query)) && (!hideOnBlur || editor.api.isCollapsed() && hideOnBlur && focused && selected);
  return {
    enabled
  };
};

// src/react/useRemoveNodeButton.ts
import { useEditorRef as useEditorRef3 } from "@udecode/plate-core/react";
var useRemoveNodeButton = ({ element }) => {
  const editor = useEditorRef3();
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
import { useEditorSelector as useEditorSelector3 } from "@udecode/plate-core/react";
function useSelectionCollapsed() {
  return useEditorSelector3((editor) => !editor.api.isExpanded(), []);
}
function useSelectionExpanded() {
  return useEditorSelector3((editor) => editor.api.isExpanded(), []);
}
function useSelectionWithinBlock() {
  return useEditorSelector3((editor) => editor.api.isAt({ block: true }), []);
}
function useSelectionAcrossBlocks() {
  return useEditorSelector3((editor) => editor.api.isAt({ blocks: true }), []);
}

// src/react/useSelectionFragment.ts
import { useEditorSelector as useEditorSelector4 } from "@udecode/plate-core/react";
var useSelectionFragment = (options) => {
  return useEditorSelector4((editor) => {
    return editor.api.fragment(editor.selection, options);
  }, []);
};
var useSelectionFragmentProp = ({
  structuralTypes,
  ...options
} = {}) => {
  return useEditorSelector4((editor) => {
    const fragment = editor.api.fragment(editor.selection, {
      structuralTypes
    });
    return editor.api.prop({ nodes: fragment, ...options });
  }, []);
};
export {
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
};
//# sourceMappingURL=index.mjs.map