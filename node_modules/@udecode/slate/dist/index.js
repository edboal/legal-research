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
  CAN_USE_DOM: () => import_slate_dom28.CAN_USE_DOM,
  ElementApi: () => ElementApi,
  HAS_BEFORE_INPUT_SUPPORT: () => import_slate_dom28.HAS_BEFORE_INPUT_SUPPORT,
  HistoryApi: () => HistoryApi,
  IS_ANDROID: () => import_slate_dom28.IS_ANDROID,
  IS_CHROME: () => import_slate_dom28.IS_CHROME,
  IS_FIREFOX: () => import_slate_dom28.IS_FIREFOX,
  IS_FIREFOX_LEGACY: () => import_slate_dom28.IS_FIREFOX_LEGACY,
  IS_IOS: () => import_slate_dom28.IS_IOS,
  IS_UC_MOBILE: () => import_slate_dom28.IS_UC_MOBILE,
  IS_WEBKIT: () => import_slate_dom28.IS_WEBKIT,
  IS_WECHATBROWSER: () => import_slate_dom28.IS_WECHATBROWSER,
  LocationApi: () => LocationApi,
  NodeApi: () => NodeApi,
  OperationApi: () => OperationApi,
  PathApi: () => PathApi,
  PathRefApi: () => PathRefApi,
  PointApi: () => PointApi,
  PointRefApi: () => PointRefApi,
  RangeApi: () => RangeApi,
  RangeRefApi: () => RangeRefApi,
  SpanApi: () => SpanApi,
  TRIPLE_CLICK: () => import_slate_dom25.TRIPLE_CLICK,
  TextApi: () => TextApi,
  applyStringDiff: () => import_slate_dom26.applyStringDiff,
  assignLegacyApi: () => assignLegacyApi,
  assignLegacyTransforms: () => assignLegacyTransforms,
  combineMatch: () => combineMatch,
  combineMatchOptions: () => combineMatchOptions,
  createEditor: () => createEditor,
  deleteMerge: () => deleteMerge,
  getActiveElement: () => import_slate_dom27.getActiveElement,
  getAt: () => getAt,
  getDefaultView: () => import_slate_dom27.getDefaultView,
  getMatch: () => getMatch,
  getQueryOptions: () => getQueryOptions,
  getSelection: () => import_slate_dom27.getSelection,
  hasShadowRoot: () => import_slate_dom27.hasShadowRoot,
  isAfter: () => import_slate_dom27.isAfter,
  isBefore: () => import_slate_dom27.isBefore,
  isDOMElement: () => import_slate_dom27.isDOMElement,
  isDOMNode: () => import_slate_dom27.isDOMNode,
  isDOMSelection: () => import_slate_dom27.isDOMSelection,
  isElementDecorationsEqual: () => import_slate_dom29.isElementDecorationsEqual,
  isPlainTextOnlyPaste: () => import_slate_dom27.isPlainTextOnlyPaste,
  isTextDecorationsEqual: () => import_slate_dom29.isTextDecorationsEqual,
  isTrackedMutation: () => import_slate_dom27.isTrackedMutation,
  match: () => match,
  mergeStringDiffs: () => import_slate_dom26.mergeStringDiffs,
  normalizeDOMPoint: () => import_slate_dom27.normalizeDOMPoint,
  normalizePoint: () => import_slate_dom26.normalizePoint,
  normalizeRange: () => import_slate_dom26.normalizeRange,
  normalizeStringDiff: () => import_slate_dom26.normalizeStringDiff,
  queryEditor: () => queryEditor,
  queryNode: () => queryNode,
  syncLegacyMethods: () => syncLegacyMethods,
  targetRange: () => import_slate_dom26.targetRange,
  verifyDiffState: () => import_slate_dom26.verifyDiffState,
  withDOM: () => import_slate_dom24.withDOM,
  withHistory: () => withHistory
});
module.exports = __toCommonJS(index_exports);

// src/create-editor.ts
var import_utils32 = require("@udecode/utils");
var import_slate75 = require("slate");

// src/interfaces/element.ts
var import_slate = require("slate");
var ElementApi = {
  ...import_slate.Element
};

// src/interfaces/location-ref.ts
var import_slate3 = require("slate");

// src/interfaces/path.ts
var import_slate2 = require("slate");
var PathApi = {
  ...import_slate2.Path,
  child: (path2, index) => path2.concat([index]),
  firstChild: (path2) => PathApi.child(path2, 0),
  lastIndex: (path2) => path2.at(-1) ?? -1,
  next: (path2) => {
    try {
      return import_slate2.Path.next(path2);
    } catch {
      return path2;
    }
  },
  parent: (path2) => {
    try {
      return import_slate2.Path.parent(path2);
    } catch {
      return path2;
    }
  },
  previous: (path2) => {
    if (path2.length === 0) return;
    const last2 = path2.at(-1);
    if (last2 <= 0) return;
    return path2.slice(0, -1).concat(last2 - 1);
  }
};

// src/interfaces/location-ref.ts
var PathRefApi = {
  transform(ref, op) {
    const { affinity, current } = ref;
    if (current == null) {
      return;
    }
    const path2 = PathApi.transform(current, op, { affinity });
    ref.current = path2;
    if (path2 == null) {
      ref.unref();
    }
  }
};
var PointRefApi = import_slate3.PointRef;
var RangeRefApi = import_slate3.RangeRef;

// src/interfaces/location.ts
var import_slate7 = require("slate");

// src/interfaces/node.ts
var import_slate6 = require("slate");

// src/internal/editor-extension/node-extension.ts
var import_slate4 = require("slate");
var NodeExtension = {
  *children(root, path2, options = {}) {
    const { from, reverse = false, to } = options;
    const ancestor = NodeApi.ancestor(root, path2);
    if (!ancestor) return;
    const { children } = ancestor;
    let index = reverse ? children.length - 1 : 0;
    const endIndex = to ?? (reverse ? 0 : children.length);
    if (from !== void 0) {
      index = from;
    }
    while (reverse ? index >= endIndex : index < endIndex) {
      const child = NodeApi.child(ancestor, index);
      const childPath = path2.concat(index);
      yield [child, childPath];
      index = reverse ? index - 1 : index + 1;
    }
  },
  firstChild(root, path2) {
    const children = NodeApi.children(root, path2);
    const firstChild = children.next().value;
    return firstChild;
  },
  firstText(root, options) {
    const texts = NodeApi.texts(root, options);
    const firstText = texts.next().value;
    return firstText;
  },
  isEditor: (value) => (0, import_slate4.isEditor)(value),
  isLastChild(root, path2) {
    if (path2.length === 0) return false;
    const parent2 = NodeApi.parent(root, path2);
    if (!parent2) return false;
    const index = path2.at(-1);
    return index === parent2.children.length - 1;
  },
  lastChild(root, path2) {
    const children = NodeApi.children(root, path2, { reverse: true });
    const lastChild = children.next().value;
    return lastChild;
  }
};

// src/interfaces/text.ts
var import_slate5 = require("slate");
var TextApi = import_slate5.Text;

// src/interfaces/node.ts
var NodeApi = {
  ...import_slate6.Node,
  isAncestor: ElementApi.isAncestor,
  ancestor: (...args) => {
    try {
      return import_slate6.Node.ancestor(...args);
    } catch {
    }
  },
  common: (...args) => {
    try {
      return import_slate6.Node.common(...args);
    } catch {
    }
  },
  descendant: (...args) => {
    try {
      return import_slate6.Node.descendant(...args);
    } catch {
    }
  },
  first: (...args) => {
    try {
      return import_slate6.Node.first(...args);
    } catch {
    }
  },
  fragment: (...args) => {
    try {
      return import_slate6.Node.fragment(...args);
    } catch {
      return [];
    }
  },
  get: (...args) => {
    try {
      return import_slate6.Node.get(...args);
    } catch {
    }
  },
  hasSingleChild: (node2) => {
    if (TextApi.isText(node2)) return true;
    return node2.children.length === 1 && NodeApi.hasSingleChild(node2.children[0]);
  },
  isDescendant: (node2) => ElementApi.isElement(node2) || TextApi.isText(node2),
  last: (...args) => {
    try {
      return import_slate6.Node.last(...args);
    } catch {
    }
  },
  leaf: (...args) => {
    try {
      return import_slate6.Node.leaf(...args);
    } catch {
    }
  },
  parent: (...args) => {
    try {
      return import_slate6.Node.parent(...args);
    } catch {
    }
  },
  ...NodeExtension
};

// src/interfaces/location.ts
var LocationApi = {
  ...import_slate7.Location,
  isAt: (value) => LocationApi.isLocation(value) || NodeApi.isNode(value)
};
var SpanApi = import_slate7.Span;

// src/interfaces/operation.ts
var import_slate8 = require("slate");
var OperationApi = import_slate8.Operation;

// src/interfaces/point.ts
var import_slate10 = require("slate");

// src/interfaces/range.ts
var import_slate9 = require("slate");
var RangeApi = {
  ...import_slate9.Range,
  contains: (range2, target) => {
    const [targetStart, targetEnd] = RangeApi.edges(target);
    return RangeApi.includes(range2, targetStart) && RangeApi.includes(range2, targetEnd);
  },
  isCollapsed: (range2) => !!range2 && import_slate9.Range.isCollapsed(range2),
  isExpanded: (range2) => !!range2 && import_slate9.Range.isExpanded(range2)
};

// src/interfaces/point.ts
var PointApi = {
  ...import_slate10.Point,
  get: (at, { focus: focus2 } = {}) => {
    let point2;
    if (RangeApi.isRange(at)) point2 = focus2 ? at.focus : at.anchor;
    if (PointApi.isPoint(at)) point2 = at;
    if (PathApi.isPath(at)) point2 = { offset: 0, path: at };
    return point2;
  }
};

// src/internal/dom-editor/blur.ts
var import_slate_dom = require("slate-dom");
var blur = (editor) => import_slate_dom.DOMEditor.blur(editor);

// src/internal/dom-editor/deselectDOM.ts
var import_slate_dom2 = require("slate-dom");
var deselectDOM = (editor) => import_slate_dom2.DOMEditor.deselect(editor);

// src/internal/dom-editor/findDocumentOrShadowRoot.ts
var import_slate_dom3 = require("slate-dom");
var findDocumentOrShadowRoot = (editor) => {
  try {
    return import_slate_dom3.DOMEditor.findDocumentOrShadowRoot(editor);
  } catch {
  }
};

// src/internal/dom-editor/findEventRange.ts
var import_slate_dom4 = require("slate-dom");
var findEventRange = (editor, event) => {
  try {
    return import_slate_dom4.DOMEditor.findEventRange(editor, event);
  } catch {
  }
};

// src/internal/dom-editor/findKey.ts
var import_slate_dom5 = require("slate-dom");
var findKey = (editor, node2) => {
  try {
    return import_slate_dom5.DOMEditor.findKey(editor, node2);
  } catch {
  }
};

// src/internal/dom-editor/findPath.ts
var import_slate_dom6 = require("slate-dom");
var findPath = (editor, node2, options) => {
  const findNodePath = () => {
    const nodeEntry = editor.api.node({
      ...options,
      at: [],
      match: (n2) => n2 === node2
    });
    return nodeEntry?.[1];
  };
  if (options) {
    return findNodePath();
  }
  try {
    return import_slate_dom6.DOMEditor.findPath(editor, node2);
  } catch {
    return findNodePath();
  }
};

// src/internal/dom-editor/focus.ts
var import_slate_dom7 = require("slate-dom");
var focus = (editor, { at, edge, retries = 5 } = {}) => {
  const reselect = (at2) => {
    editor.tf.withoutNormalizing(() => {
      editor.tf.deselect();
      editor.tf.select(at2);
    });
  };
  if (edge) {
    const target = edge === "startEditor" || edge === "endEditor" ? [] : at ?? editor.selection;
    if (target) {
      reselect(
        edge === "start" ? editor.api.start(target) : editor.api.end(target)
      );
    }
  } else if (at) {
    reselect(at);
  }
  try {
    import_slate_dom7.DOMEditor.focus(editor, { retries });
  } catch (error) {
    console.error(error);
  }
};

// src/internal/dom-editor/getWindow.ts
var import_slate_dom8 = require("slate-dom");
var getWindow = (editor) => {
  try {
    return import_slate_dom8.DOMEditor.getWindow(editor);
  } catch {
  }
};

// src/internal/dom-editor/hasDOMNode.ts
var import_slate_dom9 = require("slate-dom");
var hasDOMNode = (editor, target, options) => {
  try {
    return import_slate_dom9.DOMEditor.hasDOMNode(editor, target, options);
  } catch {
  }
  return false;
};

// src/internal/dom-editor/hasEditableTarget.ts
var import_slate_dom10 = require("slate-dom");
var hasEditableTarget = (editor, target) => {
  try {
    return import_slate_dom10.DOMEditor.hasEditableTarget(editor, target);
  } catch {
  }
  return false;
};

// src/internal/dom-editor/hasRange.ts
var import_slate_dom11 = require("slate-dom");
var hasRange = (editor, range2) => {
  try {
    return import_slate_dom11.DOMEditor.hasRange(editor, range2);
  } catch {
  }
  return false;
};

// src/internal/dom-editor/hasSelectableTarget.ts
var import_slate_dom12 = require("slate-dom");
var hasSelectableTarget = (editor, target) => {
  try {
    return import_slate_dom12.DOMEditor.hasSelectableTarget(editor, target);
  } catch {
  }
  return false;
};

// src/internal/dom-editor/hasTarget.ts
var import_slate_dom13 = require("slate-dom");
var hasTarget = (editor, target) => {
  try {
    return import_slate_dom13.DOMEditor.hasTarget(editor, target);
  } catch {
  }
  return false;
};

// src/internal/dom-editor/isComposing.ts
var import_slate_dom14 = require("slate-dom");
var isComposing = (editor) => import_slate_dom14.DOMEditor.isComposing(editor);

// src/internal/dom-editor/isFocused.ts
var import_slate_dom15 = require("slate-dom");
var isFocused = (editor) => import_slate_dom15.DOMEditor.isFocused(editor);

// src/internal/dom-editor/isReadOnly.ts
var import_slate_dom16 = require("slate-dom");
var isReadOnly = (editor) => import_slate_dom16.DOMEditor.isReadOnly(editor);

// src/internal/dom-editor/isTargetInsideNonReadonlyVoid.ts
var import_slate_dom17 = require("slate-dom");
var isTargetInsideNonReadonlyVoid = (editor, target) => {
  try {
    return import_slate_dom17.DOMEditor.isTargetInsideNonReadonlyVoid(editor, target);
  } catch {
  }
  return false;
};

// src/internal/dom-editor/toDOMNode.ts
var import_slate_dom18 = require("slate-dom");
var toDOMNode = (editor, node2) => {
  try {
    return import_slate_dom18.DOMEditor.toDOMNode(editor, node2);
  } catch {
  }
};

// src/internal/dom-editor/toDOMPoint.ts
var import_slate_dom19 = require("slate-dom");
var toDOMPoint = (editor, point2) => {
  try {
    return import_slate_dom19.DOMEditor.toDOMPoint(editor, point2);
  } catch {
  }
};

// src/internal/dom-editor/toDOMRange.ts
var import_slate_dom20 = require("slate-dom");
var toDOMRange = (editor, range2) => {
  try {
    return import_slate_dom20.DOMEditor.toDOMRange(editor, range2);
  } catch {
  }
};

// src/internal/dom-editor/toSlateNode.ts
var import_slate_dom21 = require("slate-dom");
var toSlateNode = (editor, domNode) => {
  try {
    return import_slate_dom21.DOMEditor.toSlateNode(editor, domNode);
  } catch {
  }
};

// src/internal/dom-editor/toSlatePoint.ts
var import_slate_dom22 = require("slate-dom");
var toSlatePoint = (editor, domPoint, options) => {
  try {
    return import_slate_dom22.DOMEditor.toSlatePoint(editor, domPoint, options);
  } catch {
  }
};

// src/internal/dom-editor/toSlateRange.ts
var import_slate_dom23 = require("slate-dom");
var toSlateRange = (editor, domRange, options) => {
  try {
    return import_slate_dom23.DOMEditor.toSlateRange(editor, domRange, options);
  } catch {
  }
};

// src/internal/editor-extension/edge-blocks.ts
var edgeBlocks = (editor, { at: _at, ...options } = {}) => {
  const at = _at ?? editor.selection;
  if (!at) return null;
  const [start2, end2] = editor.api.edges(at ?? editor.selection);
  const startBlock = editor.api.block({
    at: start2,
    ...options
  });
  if (!startBlock) return null;
  const endBlock = editor.api.block({
    at: end2,
    ...options
  });
  if (!endBlock) return null;
  return [startBlock, endBlock];
};

// src/internal/editor-extension/editor-block.ts
var block = (editor, { above: above2, highest, ...options } = {}) => {
  if (highest) {
    const target = options.at ?? editor.selection;
    if (!target) return;
    const index = editor.api.path(target)?.[0];
    if (index === void 0) return;
    return editor.api.node([index]);
  }
  if (above2) {
    return editor.api.above({
      ...options,
      block: true
    });
  }
  return editor.api.node({
    ...options,
    block: true,
    mode: "lowest"
  });
};

// src/internal/editor-extension/editor-blocks.ts
var blocks = (editor, options) => {
  return [
    ...editor.api.nodes({
      ...options,
      block: true
    })
  ];
};

// src/utils/assignLegacyTransforms.ts
var LEGACY_TRANSFORMS = /* @__PURE__ */ new Set([
  "addMark",
  "apply",
  "blur",
  "collapse",
  "delete",
  "deleteBackward",
  "deleteForward",
  "deleteFragment",
  "deselect",
  "deselectDOM",
  "focus",
  "insertBreak",
  "insertData",
  "insertFragment",
  "insertFragmentData",
  "insertNode",
  "insertNodes",
  "insertSoftBreak",
  "insertText",
  "insertTextData",
  "liftNodes",
  "mergeNodes",
  "move",
  "moveNodes",
  "normalize",
  "normalizeNode",
  "redo",
  "removeMark",
  "removeNodes",
  "select",
  "setFragmentData",
  "setNodes",
  "setPoint",
  "setSelection",
  "setSplittingOnce",
  "splitNodes",
  "undo",
  "unsetNodes",
  "unwrapNodes",
  "withMerging",
  "withNewBatch",
  "withoutMerging",
  "withoutNormalizing",
  "withoutSaving",
  "wrapNodes",
  "writeHistory"
]);
var LEGACY_API = /* @__PURE__ */ new Set([
  "above",
  "after",
  "before",
  "edges",
  "elementReadOnly",
  "end",
  "findDocumentOrShadowRoot",
  "findEventRange",
  "findKey",
  "findPath",
  "first",
  "fragment",
  "getDirtyPaths",
  "getFragment",
  "getMarks",
  "getWindow",
  "hasBlocks",
  "hasDOMNode",
  "hasEditableTarget",
  "hasInlines",
  "hasPath",
  "hasRange",
  "hasSelectableTarget",
  "hasTarget",
  "hasTexts",
  "highestBlock",
  "isBlock",
  "isComposing",
  "isEdge",
  "isElementReadOnly",
  "isEmpty",
  "isEnd",
  "isFocused",
  "isInline",
  "isMerging",
  "isNormalizing",
  "isReadOnly",
  "isSaving",
  "isSelectable",
  "isSplittingOnce",
  "isStart",
  "isTargetInsideNonReadonlyVoid",
  "isVoid",
  "last",
  "leaf",
  "levels",
  "markableVoid",
  // 'marks',
  "next",
  "node",
  "nodes",
  "normalize",
  "onChange",
  "operations",
  "parent",
  "path",
  "pathRef",
  "pathRefs",
  "point",
  "pointRef",
  "pointRefs",
  "positions",
  "previous",
  "range",
  "rangeRef",
  "rangeRefs",
  "selection",
  "setNormalizing",
  "shouldMergeNodesRemovePrevNode",
  "shouldNormalize",
  "start",
  "string",
  "toDOMNode",
  "toDOMPoint",
  "toDOMRange",
  "toSlateNode",
  "toSlatePoint",
  "toSlateRange",
  "unhangRange",
  "void"
]);
var assignLegacyTransforms = (editor, transforms) => {
  if (!transforms) return;
  const e3 = editor;
  const legacyTransforms = Object.entries(transforms).reduce(
    (acc, [key, value]) => {
      if (LEGACY_TRANSFORMS.has(key)) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
  Object.assign(e3, legacyTransforms);
};
var assignLegacyApi = (editor, api) => {
  if (!api) return;
  const e3 = editor;
  const legacyApi = Object.entries(api).reduce(
    (acc, [key, value]) => {
      if (LEGACY_API.has(key)) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
  Object.assign(e3, legacyApi);
  if (api.marks) {
    e3.getMarks = api.marks;
  }
};
var syncLegacyMethods = (editor) => {
  const e3 = editor;
  LEGACY_API.forEach((key) => {
    if (e3[key]) {
      if (key === "getMarks") {
        e3.api.marks = e3.getMarks;
      } else {
        e3.api[key] = e3[key];
      }
    }
  });
  LEGACY_TRANSFORMS.forEach((key) => {
    if (e3[key]) {
      e3.tf[key] = e3[key];
    }
  });
};

// src/utils/deleteMerge.ts
var import_slate22 = require("slate");

// src/internal/editor/createPathRef.ts
var import_slate11 = require("slate");
var createPathRef = (editor, at, options) => (0, import_slate11.pathRef)(editor, at, options);

// src/internal/editor/createPointRef.ts
var import_slate12 = require("slate");
var createPointRef = (editor, point2, options) => (0, import_slate12.pointRef)(editor, point2, options);

// src/internal/editor/getEndPoint.ts
var import_slate13 = require("slate");

// src/utils/getAt.ts
var import_isPlainObject = __toESM(require("lodash/isPlainObject.js"));
var getAt = (editor, at) => {
  if (at && (0, import_isPlainObject.default)(at) && NodeApi.isNode(at)) {
    return editor.api.findPath(at);
  }
  return at ?? void 0;
};

// src/internal/editor/getEndPoint.ts
var getEndPoint = (editor, at, options = {}) => {
  try {
    if (options.previous) {
      const prevEntry = editor.api.previous({ at: getAt(editor, at) });
      if (!prevEntry) return;
      return (0, import_slate13.end)(editor, prevEntry[1]);
    }
    return (0, import_slate13.end)(editor, getAt(editor, at));
  } catch {
  }
};

// src/internal/editor/getLeafNode.ts
var import_slate14 = require("slate");
var getLeafNode = (editor, at, options) => {
  try {
    return (0, import_slate14.leaf)(editor, getAt(editor, at), options);
  } catch {
  }
};

// src/internal/editor/getPointAfter.ts
var import_slate15 = require("slate");
var getPointAfter = (editor, at, options) => {
  try {
    return (0, import_slate15.after)(editor, getAt(editor, at), options);
  } catch {
  }
};

// src/internal/editor/getPointBefore.ts
var import_castArray = __toESM(require("lodash/castArray.js"));
var import_map = __toESM(require("lodash/map.js"));
var import_slate16 = require("slate");
var getPointBefore = (editor, at, options) => {
  if (!options || !options.match && !options.matchString) {
    try {
      return (0, import_slate16.before)(editor, getAt(editor, at), options);
    } catch {
    }
    return;
  }
  const unitOffset = !options.unit || options.unit === "offset";
  const matchStrings = options.matchString ? (0, import_castArray.default)(options.matchString) : [""];
  const matchByRegex = options.matchByRegex ?? false;
  let point2;
  matchStrings.some((matchString) => {
    let beforeAt = at;
    let previousBeforePoint = editor.api.point(at, { edge: "end" });
    const stackLength = matchString.length + 1;
    const stack = Array.from({ length: stackLength });
    let count = 0;
    while (true) {
      const beforePoint = (0, import_slate16.before)(
        editor,
        getAt(editor, beforeAt),
        options
      );
      if (!beforePoint) {
        if (options.matchBlockStart) {
          point2 = previousBeforePoint;
        }
        return;
      }
      if (editor.api.isAt({
        at: {
          anchor: beforePoint,
          focus: previousBeforePoint
        },
        blocks: true
      })) {
        if (options.matchBlockStart) {
          point2 = previousBeforePoint;
        }
        return;
      }
      const beforeString = editor.api.string({
        anchor: beforePoint,
        focus: previousBeforePoint
      });
      let beforeStringToMatch = beforeString;
      if (unitOffset && stackLength) {
        stack.unshift({
          point: beforePoint,
          text: beforeString
        });
        stack.pop();
        beforeStringToMatch = (0, import_map.default)(stack.slice(0, -1), "text").join("");
      }
      const isMatched = matchByRegex ? !!matchString.match(beforeStringToMatch) : beforeStringToMatch === matchString;
      if (isMatched || options.match?.({ at, beforePoint, beforeString: beforeStringToMatch })) {
        if (options.afterMatch) {
          if (stackLength && unitOffset) {
            point2 = stack.at(-1)?.point;
            return !!point2;
          }
          point2 = previousBeforePoint;
          return true;
        }
        point2 = beforePoint;
        return true;
      }
      previousBeforePoint = beforePoint;
      beforeAt = beforePoint;
      count += 1;
      if (!options.skipInvalid && (!matchString || count >= matchString.length))
        return;
    }
  });
  return point2;
};

// src/internal/editor/getStartPoint.ts
var import_slate17 = require("slate");
var getStartPoint = (editor, at, options = {}) => {
  try {
    if (options.next) {
      const nextEntry = editor.api.next({ at: getAt(editor, at) });
      if (!nextEntry) return;
      return (0, import_slate17.start)(editor, nextEntry[1]);
    }
    return (0, import_slate17.start)(editor, getAt(editor, at));
  } catch {
  }
};

// src/internal/editor/getVoidNode.ts
var import_slate18 = require("slate");
var getVoidNode = (editor, options) => (0, import_slate18.getVoid)(editor, {
  ...options,
  at: getAt(editor, options?.at)
});

// src/internal/editor/isBlock.ts
var import_slate19 = require("slate");
var isBlock = (editor, value) => ElementApi.isElement(value) && (0, import_slate19.isBlock)(editor, value);

// src/utils/match.ts
function castArray2(value) {
  return Array.isArray(value) ? value : [value];
}
var match = (obj, path2, predicate) => {
  if (!predicate) return true;
  if (typeof predicate === "object") {
    return Object.entries(predicate).every(([key, value]) => {
      const values = castArray2(value);
      return values.includes(obj[key]);
    });
  }
  return predicate(obj, path2);
};
var getMatch = (editor, { id, block: block2, empty, match: matchObjOrFn, text } = {}) => {
  let hasMatch = false;
  let matchFn = () => true;
  if (text !== void 0) {
    hasMatch = true;
    matchFn = combineMatch(matchFn, (n2) => TextApi.isText(n2) === text);
  }
  if (empty !== void 0) {
    hasMatch = true;
    matchFn = combineMatch(matchFn, (n2) => {
      return TextApi.isText(n2) ? n2.text.length > 0 === !empty : editor.api.isEmpty(n2) === empty;
    });
  }
  if (block2 !== void 0) {
    hasMatch = true;
    matchFn = combineMatch(matchFn, (n2) => editor.api.isBlock(n2) === block2);
  }
  if (id !== void 0) {
    hasMatch = true;
    matchFn = combineMatch(matchFn, (n2) => {
      return id === true && !!n2.id || n2.id === id;
    });
  }
  if (typeof matchObjOrFn === "object") {
    hasMatch = true;
    matchFn = combineMatch(matchFn, (n2, p) => match(n2, p, matchObjOrFn));
  } else if (typeof matchObjOrFn === "function") {
    hasMatch = true;
    matchFn = combineMatch(matchFn, matchObjOrFn);
  }
  return hasMatch ? matchFn : void 0;
};
var getQueryOptions = (editor, { id, empty, match: match2, text, ...options } = {}) => {
  const { at, block: block2 } = options;
  return {
    ...options,
    at: getAt(editor, at),
    match: getMatch(editor, { id, block: block2, empty, match: match2, text })
  };
};
var combineMatch = (match1, match2) => {
  return (node2, path2) => {
    return match1(node2, path2) && (!match2 || match2(node2, path2));
  };
};
var combineMatchOptions = (editor, match1, options) => {
  return (node2, path2) => {
    const match2 = getMatch(editor, options);
    return (!match1 || match1(node2, path2)) && (!match2 || match2(node2, path2));
  };
};

// src/internal/editor/nodes.ts
function* nodes(editor, options = {}) {
  options = getQueryOptions(editor, options);
  const {
    ignoreNonSelectable = false,
    mode = "all",
    reverse = false,
    universal = false,
    voids = false
  } = options;
  const at = getAt(editor, options.at) ?? editor.selection;
  let match2 = getMatch(editor, options);
  if (!match2) {
    match2 = () => true;
  }
  if (!at) {
    return;
  }
  let from;
  let to;
  if (SpanApi.isSpan(at)) {
    from = at[0];
    to = at[1];
  } else {
    const first2 = editor.api.path(at, { edge: "start" });
    const last2 = editor.api.path(at, { edge: "end" });
    from = reverse ? last2 : first2;
    to = reverse ? first2 : last2;
    if (!first2 || !last2) {
      return;
    }
  }
  const nodeEntries = NodeApi.nodes(editor, {
    from,
    reverse,
    to,
    pass: ([node2]) => {
      if (!ElementApi.isElement(node2)) return false;
      if (!voids && (editor.api.isVoid(node2) || editor.api.isElementReadOnly(node2))) {
        return true;
      }
      if (ignoreNonSelectable && !editor.api.isSelectable(node2)) {
        return true;
      }
      return false;
    }
  });
  const matches = [];
  let hit;
  for (const [node2, path2] of nodeEntries) {
    if (ignoreNonSelectable && ElementApi.isElement(node2) && !editor.api.isSelectable(node2)) {
      continue;
    }
    const isLower = hit && PathApi.compare(path2, hit[1]) === 0;
    if (mode === "highest" && isLower) {
      continue;
    }
    if (!match2(node2, path2)) {
      if (universal && !isLower && TextApi.isText(node2)) {
        return;
      } else {
        continue;
      }
    }
    if (mode === "lowest" && isLower) {
      hit = [node2, path2];
      continue;
    }
    const emit = mode === "lowest" ? hit : [node2, path2];
    if (emit) {
      if (universal) {
        matches.push(emit);
      } else {
        yield emit;
      }
    }
    hit = [node2, path2];
  }
  if (mode === "lowest" && hit) {
    if (universal) {
      matches.push(hit);
    } else {
      yield hit;
    }
  }
  if (universal) {
    yield* matches;
  }
}

// src/internal/editor/withoutNormalizing.ts
var import_slate20 = require("slate");
var withoutNormalizing = (editor, fn) => {
  let normalized = false;
  (0, import_slate20.withoutNormalizing)(editor, () => {
    normalized = !!fn();
  });
  return normalized;
};

// src/internal/transforms/select.ts
var import_slate21 = require("slate");
var select = (editor, target, options = {}) => {
  const { edge, focus: focus2, next: next2, previous: previous2 } = options;
  if (focus2) {
    editor.tf.focus();
  }
  if (next2 || previous2) {
    const at2 = getAt(editor, target) ?? editor.selection;
    if (!at2) return;
    const path2 = editor.api.path(at2);
    if (!path2) return;
    const point2 = previous2 ? editor.api.end(path2, { previous: true }) : editor.api.start(path2, { next: true });
    if (!point2) return;
    (0, import_slate21.select)(editor, point2);
    return;
  }
  if (edge) {
    const at2 = getAt(editor, target) ?? editor.selection;
    if (!at2) return;
    const path2 = PathApi.isPath(at2) ? at2 : editor.api.node({ at: at2, block: true })?.[1];
    if (!path2) return;
    const point2 = edge === "end" ? editor.api.end(path2) : editor.api.start(path2);
    if (!point2) return;
    (0, import_slate21.select)(editor, point2);
    return;
  }
  const at = getAt(editor, target);
  if (!at) return;
  (0, import_slate21.select)(editor, at);
};

// src/utils/deleteMerge.ts
var deleteMerge = (editor, options = {}) => {
  const e3 = editor;
  withoutNormalizing(e3, () => {
    const {
      distance = 1,
      reverse = false,
      unit = "character",
      voids = false
    } = options;
    let { at = e3.selection, hanging = false } = options;
    if (!at) {
      return;
    }
    if (RangeApi.isRange(at) && RangeApi.isCollapsed(at)) {
      at = at.anchor;
    }
    if (PointApi.isPoint(at)) {
      const furthestVoid = getVoidNode(e3, { at, mode: "highest" });
      if (!voids && furthestVoid) {
        const [, voidPath] = furthestVoid;
        at = voidPath;
      } else {
        const opts = { distance, unit };
        const target = reverse ? getPointBefore(e3, at, opts) || getStartPoint(e3, []) : getPointAfter(e3, at, opts) || getEndPoint(e3, []);
        at = { anchor: at, focus: target };
        hanging = true;
      }
    }
    if (PathApi.isPath(at)) {
      e3.tf.removeNodes({ at, voids });
      return;
    }
    if (RangeApi.isCollapsed(at)) {
      return;
    }
    if (!hanging) {
      at = import_slate22.Editor.unhangRange(e3, at, { voids });
    }
    let [start2, end2] = RangeApi.edges(at);
    const startBlock = e3.api.above({
      at: start2,
      voids,
      match: (n2) => isBlock(e3, n2)
    });
    const endBlock = e3.api.above({
      at: end2,
      voids,
      match: (n2) => isBlock(e3, n2)
    });
    const isAcrossBlocks = startBlock && endBlock && !PathApi.equals(startBlock[1], endBlock[1]);
    const isSingleText = PathApi.equals(start2.path, end2.path);
    const startVoid = voids ? null : getVoidNode(e3, { at: start2, mode: "highest" });
    const endVoid = voids ? null : getVoidNode(e3, { at: end2, mode: "highest" });
    if (startVoid) {
      const before = getPointBefore(e3, start2);
      if (before && startBlock && PathApi.isAncestor(startBlock[1], before.path)) {
        start2 = before;
      }
    }
    if (endVoid) {
      const after2 = getPointAfter(e3, end2);
      if (after2 && endBlock && PathApi.isAncestor(endBlock[1], after2.path)) {
        end2 = after2;
      }
    }
    const matches = [];
    let lastPath;
    const _nodes = nodes(e3, { at, voids });
    for (const entry of _nodes) {
      const [node2, path2] = entry;
      if (lastPath && PathApi.compare(path2, lastPath) === 0) {
        continue;
      }
      if (!voids && e3.api.isVoid(node2) || !PathApi.isCommon(path2, start2.path) && !PathApi.isCommon(path2, end2.path)) {
        matches.push(entry);
        lastPath = path2;
      }
    }
    const pathRefs2 = Array.from(matches, ([, p]) => createPathRef(e3, p));
    const startRef = createPointRef(e3, start2);
    const endRef = createPointRef(e3, end2);
    if (!isSingleText && !startVoid) {
      const point3 = startRef.current;
      const [node2] = getLeafNode(e3, point3);
      const { path: path2 } = point3;
      const { offset } = start2;
      const text = node2.text.slice(offset);
      e3.apply({ offset, path: path2, text, type: "remove_text" });
    }
    for (const pathRef2 of pathRefs2) {
      const path2 = pathRef2.unref();
      e3.tf.removeNodes({ at: path2, voids });
    }
    if (!endVoid) {
      const point3 = endRef.current;
      const [node2] = getLeafNode(e3, point3);
      const { path: path2 } = point3;
      const offset = isSingleText ? start2.offset : 0;
      const text = node2.text.slice(offset, end2.offset);
      e3.apply({ offset, path: path2, text, type: "remove_text" });
    }
    if (!isSingleText && isAcrossBlocks && endRef.current && startRef.current) {
      e3.tf.mergeNodes({
        at: endRef.current,
        hanging: true,
        voids
      });
    }
    const point2 = endRef.unref() || startRef.unref();
    if (options.at == null && point2) {
      select(e3, point2);
    }
  });
};

// src/utils/queryEditor.ts
var import_castArray2 = __toESM(require("lodash/castArray.js"));
var queryEditor = (editor, {
  allow,
  at = editor.selection || [],
  exclude,
  filter,
  selectionAtBlockEnd,
  selectionAtBlockStart
} = {}) => {
  if (filter && !filter(editor) || selectionAtBlockStart && !editor.api.isAt({ start: true }) || selectionAtBlockEnd && !editor.api.isAt({ end: true })) {
    return false;
  }
  const allows = (0, import_castArray2.default)(allow);
  if (allows.length > 0 && !editor.api.some({ at, match: { type: allows } })) {
    return false;
  }
  const excludes = (0, import_castArray2.default)(exclude);
  if (excludes.length > 0 && editor.api.some({ at, match: { type: excludes } })) {
    return false;
  }
  return true;
};

// src/utils/queryNode.ts
function castArray4(value) {
  return Array.isArray(value) ? value : [value];
}
var queryNode = (entry, { allow, exclude, filter, level, maxLevel } = {}) => {
  if (!entry) return false;
  const [node2, path2] = entry;
  if (level) {
    const levels2 = castArray4(level);
    if (!levels2.includes(path2.length)) {
      return false;
    }
  }
  if (maxLevel && path2.length > maxLevel) {
    return false;
  }
  if (filter && !filter(entry)) {
    return false;
  }
  if (allow) {
    const allows = castArray4(allow);
    if (allows.length > 0 && !allows.includes(node2.type)) {
      return false;
    }
  }
  if (exclude) {
    const excludes = castArray4(exclude);
    if (excludes.length > 0 && excludes.includes(node2.type)) {
      return false;
    }
  }
  return true;
};

// src/internal/editor-extension/editor-descendant.ts
var descendant = (editor, options) => {
  try {
    const {
      at = editor.selection,
      match: _match,
      reverse = false,
      voids = false
    } = options;
    if (!at) return;
    let from;
    let to;
    if (SpanApi.isSpan(at)) {
      [from, to] = at;
    } else if (RangeApi.isRange(at)) {
      const first2 = editor.api.path(at, { edge: "start" });
      const last2 = editor.api.path(at, { edge: "end" });
      from = reverse ? last2 : first2;
      to = reverse ? first2 : last2;
    }
    let root = [editor, []];
    if (PathApi.isPath(at)) {
      root = editor.api.node(at);
    }
    const nodeEntries = NodeApi.descendants(root[0], {
      from,
      reverse,
      to,
      pass: ([n2]) => voids ? false : editor.api.isVoid(n2)
    });
    for (const [node2, path2] of nodeEntries) {
      if (match(node2, path2, _match)) {
        return [node2, at.concat(path2)];
      }
    }
  } catch {
    return void 0;
  }
};

// src/internal/editor-extension/editor-mark.ts
var mark = (editor, key) => {
  const marks2 = editor.api.marks();
  return marks2?.[key];
};

// src/internal/editor-extension/hasMark.ts
var hasMark = (editor, key) => {
  return !!editor.api.mark(key);
};

// src/internal/editor-extension/is-selected.ts
var isSelected = (editor, target, options = {}) => {
  const { contains = false } = options;
  if (!editor.selection) return false;
  const range2 = RangeApi.isRange(target) ? target : editor.api.range(target);
  if (!range2) return false;
  if (contains) {
    return RangeApi.contains(editor.selection, range2);
  }
  return !!RangeApi.intersection(editor.selection, range2);
};

// src/internal/editor-extension/isAt.ts
var isAt = (editor, {
  at = editor.selection,
  block: block2,
  blocks: blocks2,
  end: end2,
  start: start2,
  text,
  word,
  ...options
} = {}) => {
  if (!at) return false;
  if (PointApi.isPoint(at)) {
    if (word && end2) {
      const after2 = editor.api.after(at);
      if (!after2) return true;
      const afterRange = editor.api.range(at, after2);
      const afterText = editor.api.string(afterRange);
      return /^(?:\s|$)/.test(afterText);
    }
    return false;
  }
  if (RangeApi.isRange(at)) {
    const [startPoint, endPoint] = RangeApi.edges(at);
    if (text) {
      return PathApi.equals(startPoint.path, endPoint.path);
    }
    const startBlock = editor.api.block({
      at: startPoint,
      ...options
    });
    const endBlock = editor.api.block({
      at: endPoint,
      ...options
    });
    if (blocks2) {
      if (!startBlock && !endBlock) return false;
      if (!startBlock || !endBlock) return true;
      return !PathApi.equals(startBlock[1], endBlock[1]);
    }
    if (!startBlock || !endBlock) return false;
    if (block2) {
      return PathApi.equals(startBlock[1], endBlock[1]);
    }
    if (start2) {
      return editor.api.isStart(startPoint, startBlock[1]) || RangeApi.isExpanded(at) && editor.api.isStart(endPoint, startBlock[1]);
    }
    if (end2) {
      return editor.api.isEnd(endPoint, endBlock[1]);
    }
  }
  return false;
};

// src/internal/editor-extension/isEditorEnd.ts
var isEditorEnd = (editor) => {
  if (editor.selection) {
    const point2 = editor.selection.focus;
    const endPoint = editor.api.end([]);
    return endPoint.offset === 0 && editor.api.isEnd(point2, point2) && PathApi.equals(PathApi.next(PathApi.parent(point2.path)), endPoint.path);
  }
  return false;
};

// src/internal/editor-extension/isText.ts
var isText = (editor, at) => {
  const node2 = editor.api.node(at)?.[0];
  return TextApi.isText(node2);
};

// src/internal/editor-extension/nodes-range.ts
var nodesRange = (editor, nodes2) => {
  if (nodes2.length === 0) return;
  const firstBlockPath = nodes2[0][1];
  const lastBlockPath = nodes2.at(-1)[1];
  return editor.api.range(firstBlockPath, lastBlockPath);
};

// src/internal/editor-extension/prop.ts
function prop({
  key,
  defaultValue,
  getProp,
  mode = "block",
  nodes: nodes2
}) {
  if (nodes2.length === 0) return defaultValue;
  const getNodeValue = getProp ?? ((node2) => {
    return node2[key];
  });
  let value;
  for (const node2 of nodes2) {
    if (mode === "block" || mode === "all") {
      const nodeValue = getNodeValue(node2);
      if (nodeValue !== void 0) {
        if (value === void 0) {
          value = nodeValue;
        } else if (value !== nodeValue) {
          return;
        }
        if (mode === "block") continue;
      } else if (mode === "block") {
        return defaultValue;
      }
    }
    if (mode === "text" || mode === "all") {
      const textEntries = Array.from(NodeApi.texts(node2));
      for (const [text] of textEntries) {
        const textValue = getNodeValue(text);
        if (textValue !== void 0) {
          if (value === void 0) {
            value = textValue;
          } else if (value !== textValue) {
            return;
          }
        } else if (mode === "text") {
          return defaultValue;
        }
      }
    }
  }
  return value;
}

// ../../node_modules/compute-scroll-into-view/dist/index.js
var t = (t2) => "object" == typeof t2 && null != t2 && 1 === t2.nodeType;
var e = (t2, e3) => (!e3 || "hidden" !== t2) && ("visible" !== t2 && "clip" !== t2);
var n = (t2, n2) => {
  if (t2.clientHeight < t2.scrollHeight || t2.clientWidth < t2.scrollWidth) {
    const o3 = getComputedStyle(t2, null);
    return e(o3.overflowY, n2) || e(o3.overflowX, n2) || ((t3) => {
      const e3 = ((t4) => {
        if (!t4.ownerDocument || !t4.ownerDocument.defaultView) return null;
        try {
          return t4.ownerDocument.defaultView.frameElement;
        } catch (t5) {
          return null;
        }
      })(t3);
      return !!e3 && (e3.clientHeight < t3.scrollHeight || e3.clientWidth < t3.scrollWidth);
    })(t2);
  }
  return false;
};
var o = (t2, e3, n2, o3, l2, r2, i, s) => r2 < t2 && i > e3 || r2 > t2 && i < e3 ? 0 : r2 <= t2 && s <= n2 || i >= e3 && s >= n2 ? r2 - t2 - o3 : i > e3 && s < n2 || r2 < t2 && s > n2 ? i - e3 + l2 : 0;
var l = (t2) => {
  const e3 = t2.parentElement;
  return null == e3 ? t2.getRootNode().host || null : e3;
};
var r = (e3, r2) => {
  var i, s, d, h;
  if ("undefined" == typeof document) return [];
  const { scrollMode: c, block: f, inline: u, boundary: a, skipOverflowHiddenElements: g } = r2, p = "function" == typeof a ? a : (t2) => t2 !== a;
  if (!t(e3)) throw new TypeError("Invalid target");
  const m = document.scrollingElement || document.documentElement, w = [];
  let W = e3;
  for (; t(W) && p(W); ) {
    if (W = l(W), W === m) {
      w.push(W);
      break;
    }
    null != W && W === document.body && n(W) && !n(document.documentElement) || null != W && n(W, g) && w.push(W);
  }
  const b = null != (s = null == (i = window.visualViewport) ? void 0 : i.width) ? s : innerWidth, H = null != (h = null == (d = window.visualViewport) ? void 0 : d.height) ? h : innerHeight, { scrollX: y, scrollY: M } = window, { height: v, width: E, top: x, right: C, bottom: I, left: R } = e3.getBoundingClientRect(), { top: T, right: B, bottom: F, left: V } = ((t2) => {
    const e4 = window.getComputedStyle(t2);
    return { top: parseFloat(e4.scrollMarginTop) || 0, right: parseFloat(e4.scrollMarginRight) || 0, bottom: parseFloat(e4.scrollMarginBottom) || 0, left: parseFloat(e4.scrollMarginLeft) || 0 };
  })(e3);
  let k = "start" === f || "nearest" === f ? x - T : "end" === f ? I + F : x + v / 2 - T + F, D = "center" === u ? R + E / 2 - V + B : "end" === u ? C + B : R - V;
  const L = [];
  for (let t2 = 0; t2 < w.length; t2++) {
    const e4 = w[t2], { height: l2, width: r3, top: i2, right: s2, bottom: d2, left: h2 } = e4.getBoundingClientRect();
    if ("if-needed" === c && x >= 0 && R >= 0 && I <= H && C <= b && (e4 === m && !n(e4) || x >= i2 && I <= d2 && R >= h2 && C <= s2)) return L;
    const a2 = getComputedStyle(e4), g2 = parseInt(a2.borderLeftWidth, 10), p2 = parseInt(a2.borderTopWidth, 10), W2 = parseInt(a2.borderRightWidth, 10), T2 = parseInt(a2.borderBottomWidth, 10);
    let B2 = 0, F2 = 0;
    const V2 = "offsetWidth" in e4 ? e4.offsetWidth - e4.clientWidth - g2 - W2 : 0, S = "offsetHeight" in e4 ? e4.offsetHeight - e4.clientHeight - p2 - T2 : 0, X = "offsetWidth" in e4 ? 0 === e4.offsetWidth ? 0 : r3 / e4.offsetWidth : 0, Y = "offsetHeight" in e4 ? 0 === e4.offsetHeight ? 0 : l2 / e4.offsetHeight : 0;
    if (m === e4) B2 = "start" === f ? k : "end" === f ? k - H : "nearest" === f ? o(M, M + H, H, p2, T2, M + k, M + k + v, v) : k - H / 2, F2 = "start" === u ? D : "center" === u ? D - b / 2 : "end" === u ? D - b : o(y, y + b, b, g2, W2, y + D, y + D + E, E), B2 = Math.max(0, B2 + M), F2 = Math.max(0, F2 + y);
    else {
      B2 = "start" === f ? k - i2 - p2 : "end" === f ? k - d2 + T2 + S : "nearest" === f ? o(i2, d2, l2, p2, T2 + S, k, k + v, v) : k - (i2 + l2 / 2) + S / 2, F2 = "start" === u ? D - h2 - g2 : "center" === u ? D - (h2 + r3 / 2) + V2 / 2 : "end" === u ? D - s2 + W2 + V2 : o(h2, s2, r3, g2, W2 + V2, D, D + E, E);
      const { scrollLeft: t3, scrollTop: n2 } = e4;
      B2 = 0 === Y ? 0 : Math.max(0, Math.min(n2 + B2 / Y, e4.scrollHeight - l2 / Y + S)), F2 = 0 === X ? 0 : Math.max(0, Math.min(t3 + F2 / X, e4.scrollWidth - r3 / X + V2)), k += n2 - B2, D += t3 - F2;
    }
    L.push({ el: e4, top: B2, left: F2 });
  }
  return L;
};

// ../../node_modules/scroll-into-view-if-needed/dist/index.js
var o2 = (t2) => false === t2 ? { block: "end", inline: "nearest" } : ((t3) => t3 === Object(t3) && 0 !== Object.keys(t3).length)(t2) ? t2 : { block: "start", inline: "nearest" };
function e2(e3, r2) {
  if (!e3.isConnected || !((t2) => {
    let o3 = t2;
    for (; o3 && o3.parentNode; ) {
      if (o3.parentNode === document) return true;
      o3 = o3.parentNode instanceof ShadowRoot ? o3.parentNode.host : o3.parentNode;
    }
    return false;
  })(e3)) return;
  const n2 = ((t2) => {
    const o3 = window.getComputedStyle(t2);
    return { top: parseFloat(o3.scrollMarginTop) || 0, right: parseFloat(o3.scrollMarginRight) || 0, bottom: parseFloat(o3.scrollMarginBottom) || 0, left: parseFloat(o3.scrollMarginLeft) || 0 };
  })(e3);
  if (((t2) => "object" == typeof t2 && "function" == typeof t2.behavior)(r2)) return r2.behavior(r(e3, r2));
  const l2 = "boolean" == typeof r2 || null == r2 ? void 0 : r2.behavior;
  for (const { el: a, top: i, left: s } of r(e3, o2(r2))) {
    const t2 = i - n2.top + n2.bottom, o3 = s - n2.left + n2.right;
    a.scroll({ top: t2, left: o3, behavior: l2 });
  }
}

// src/internal/editor-extension/scrollIntoView.ts
var defaultOptions = {
  scrollMode: "if-needed"
};
function scrollIntoView(editor, target, options = defaultOptions) {
  requestAnimationFrame(() => {
    let domRange;
    if (PointApi.isPoint(target)) {
      const { offset = 0, path: path2 } = target;
      domRange = editor.api.toDOMRange({
        anchor: { offset, path: path2 },
        focus: { offset, path: path2 }
      });
    } else {
      domRange = target;
    }
    if (!domRange) return;
    const leafEl = domRange.startContainer.parentElement;
    leafEl.getBoundingClientRect = domRange.getBoundingClientRect.bind(domRange);
    e2(leafEl, options);
    setTimeout(() => delete leafEl.getBoundingClientRect, 0);
  });
}

// src/internal/editor-extension/some.ts
var some = (editor, options) => {
  return !!editor.api.node(options);
};

// src/internal/editor/above.ts
var import_slate23 = require("slate");
var above = (editor, options) => {
  try {
    return (0, import_slate23.above)(editor, getQueryOptions(editor, options));
  } catch {
    return void 0;
  }
};

// src/internal/editor/addMark.ts
var import_slate24 = require("slate");
var addMark = (editor, key, value) => (0, import_slate24.addMark)(editor, key, value);

// src/internal/editor/createRangeRef.ts
var import_slate25 = require("slate");
var createRangeRef = (editor, range2, options) => (0, import_slate25.rangeRef)(editor, range2, options);

// src/internal/editor/deleteBackward.ts
var import_slate26 = require("slate");
var deleteBackward = (editor, unit = "character") => {
  (0, import_slate26.deleteBackward)(editor, unit);
};

// src/internal/editor/deleteForward.ts
var import_slate27 = require("slate");
var deleteForward = (editor, unit = "character") => {
  (0, import_slate27.deleteForward)(editor, unit);
};

// src/internal/editor/deleteFragment.ts
var import_slate28 = require("slate");
var deleteFragment = (editor, options) => (0, import_slate28.deleteFragment)(editor, options);

// src/internal/editor/editor-node.ts
var import_slate29 = require("slate");
var node = (editor, atOrOptions, nodeOptions) => {
  try {
    if (LocationApi.isAt(atOrOptions)) {
      const at = getAt(editor, atOrOptions);
      return (0, import_slate29.node)(editor, at, nodeOptions);
    }
    const options = atOrOptions;
    const nodeEntries = editor.api.nodes(options);
    return nodeEntries.next().value;
  } catch {
    return void 0;
  }
};

// src/internal/editor/editor-path.ts
var import_slate30 = require("slate");
var path = (editor, at, options) => {
  try {
    return (0, import_slate30.path)(editor, getAt(editor, at), options);
  } catch {
  }
};

// src/internal/editor/getEdgePoints.ts
var import_slate31 = require("slate");
var getEdgePoints = (editor, at) => {
  try {
    return (0, import_slate31.edges)(editor, getAt(editor, at));
  } catch {
  }
};

// src/internal/editor/getEditorString.ts
var import_slate32 = require("slate");
var getEditorString = (editor, at = editor.selection, options) => {
  if (!at) return "";
  try {
    return (0, import_slate32.string)(editor, getAt(editor, at), options);
  } catch {
    return "";
  }
};

// src/internal/editor/getFirstNode.ts
var import_slate33 = require("slate");
var getFirstNode = (editor, at) => {
  try {
    return (0, import_slate33.first)(editor, getAt(editor, at));
  } catch {
  }
};

// src/internal/editor/getFragment.ts
var import_slate34 = require("slate");
var unwrapStructuralNodes = (nodes2, { structuralTypes } = {}) => {
  const unwrap = (nodes3, acc = []) => {
    nodes3.forEach((node2) => {
      if (structuralTypes?.includes(node2.type)) {
        return unwrap(node2.children, acc);
      }
      acc.push(node2);
    });
    return acc;
  };
  return unwrap(nodes2);
};
var getFragment = (editor, at, options) => {
  if (at === null) return [];
  try {
    const result = at === void 0 ? (0, import_slate34.getFragment)(editor) : (0, import_slate34.fragment)(editor, getAt(editor, at));
    if (result.length > 0 && options?.structuralTypes) {
      return unwrapStructuralNodes(result, options);
    }
    return result;
  } catch {
    return [];
  }
};

// src/internal/editor/getLevels.ts
var import_slate35 = require("slate");
var getLevels = (editor, options) => {
  return (0, import_slate35.levels)(editor, getQueryOptions(editor, options));
};

// src/internal/editor/getMarks.ts
var import_slate36 = require("slate");
var getMarks = (editor) => (0, import_slate36.marks)(editor);

// src/internal/editor/getPathRefs.ts
var import_slate37 = require("slate");
var getPathRefs = (editor) => (0, import_slate37.pathRefs)(editor);

// src/internal/editor/getPoint.ts
var import_slate38 = require("slate");
var getPoint = (editor, at, options) => {
  try {
    return (0, import_slate38.point)(editor, getAt(editor, at), options);
  } catch {
  }
};

// src/internal/editor/getPointRefs.ts
var import_slate39 = require("slate");
var getPointRefs = (editor) => (0, import_slate39.pointRefs)(editor);

// src/internal/editor/getPositions.ts
var import_slate40 = require("slate");
var getPositions = (editor, options) => (0, import_slate40.positions)(editor, {
  ...options,
  at: getAt(editor, options?.at)
});

// src/internal/editor/getRangeRefs.ts
var import_slate41 = require("slate");
var getRangeRefs = (editor) => (0, import_slate41.rangeRefs)(editor);

// src/internal/editor/hasBlocks.ts
var import_slate42 = require("slate");
var hasBlocks = (editor, element) => (0, import_slate42.hasBlocks)(editor, element);

// src/internal/editor/hasInlines.ts
var import_slate43 = require("slate");
var hasInlines = (editor, element) => (0, import_slate43.hasInlines)(editor, element);

// src/internal/editor/hasTexts.ts
var import_slate44 = require("slate");
var hasTexts = (editor, element) => (0, import_slate44.hasTexts)(editor, element);

// src/internal/editor/insertBreak.ts
var import_slate45 = require("slate");
var insertBreak = (editor) => (0, import_slate45.insertBreak)(editor);

// src/internal/editor/insertNode.ts
var insertNode = (editor, node2, options) => editor.tf.insertNodes(node2, options);

// src/internal/editor/isEdgePoint.ts
var import_slate46 = require("slate");
var isEdgePoint = (editor, point2, at) => (0, import_slate46.isEdge)(editor, point2, at);

// src/internal/editor/isEditorNormalizing.ts
var import_slate47 = require("slate");
var isEditorNormalizing = (editor) => (0, import_slate47.isNormalizing)(editor);

// src/internal/editor/isElementReadOnly.ts
var import_slate48 = require("slate");
var isElementReadOnly = (editor, options) => (0, import_slate48.elementReadOnly)(editor, options);

// src/internal/editor/isEmpty.ts
var import_slate49 = require("slate");
var isEmpty = (editor, target = [], options) => {
  if (target === null) return true;
  if (PathApi.isPath(target) && target.length === 0 || NodeApi.isEditor(target)) {
    return editor.children.length === 1 && (0, import_slate49.isEmpty)(editor, editor.children[0]);
  }
  if (options?.after) {
    const blockAbove = editor.api.block({ above: true, at: target });
    if (!blockAbove) return false;
    const point2 = editor.api.point(target);
    const selectionParentEntry = editor.api.parent(target);
    if (!selectionParentEntry) return false;
    const [, selectionParentPath] = selectionParentEntry;
    if (!editor.api.isEnd(point2, selectionParentPath)) return false;
    const siblingNodes = Array.from(
      NodeApi.children(editor, blockAbove[1], {
        from: PathApi.lastIndex(point2.path) + 1
      })
    ).map(([node2]) => node2);
    if (siblingNodes.length > 0) {
      for (const siblingNode of siblingNodes) {
        if (TextApi.isText(siblingNode) && siblingNode.text) {
          return false;
        }
      }
    } else {
      return editor.api.isEnd(point2, blockAbove[1]);
    }
    return true;
  }
  if (PathApi.isPath(target)) {
    return (0, import_slate49.isEmpty)(editor, editor.api.node(target)?.[0]);
  }
  if (options?.block) {
    const block2 = editor.api.block({ at: target });
    if (!block2) return false;
    target = block2[0];
  }
  if (!NodeApi.isNode(target)) {
    const nodes2 = editor.api.nodes({ at: target, ...options });
    for (const node2 of nodes2) {
      if (!(0, import_slate49.isEmpty)(editor, node2[0])) {
        return false;
      }
    }
    return true;
  }
  return (0, import_slate49.isEmpty)(editor, target);
};

// src/internal/editor/isEndPoint.ts
var import_slate50 = require("slate");
var isEndPoint = (editor, point2, at) => !!point2 && (0, import_slate50.isEnd)(editor, point2, at);

// src/internal/editor/isStartPoint.ts
var import_slate51 = require("slate");
var isStartPoint = (editor, point2, at) => !!point2 && (0, import_slate51.isStart)(editor, point2, at);

// src/internal/editor/last.ts
var import_slate52 = require("slate");
var getNodeAtLevel = (editor, [node2, path2], level) => {
  const levelPath = path2.slice(0, level + 1);
  const entry = editor.api.node(levelPath);
  if (!entry) return [node2, path2];
  return entry;
};
var last = (editor, at, options = {}) => {
  try {
    const { level } = options;
    const lastNodeEntry = (0, import_slate52.last)(
      editor,
      getAt(editor, at)
    );
    if (lastNodeEntry && typeof level === "number") {
      if (editor.children.length === 0) {
        return;
      }
      return getNodeAtLevel(editor, lastNodeEntry, level);
    }
    return lastNodeEntry;
  } catch {
  }
};

// src/internal/editor/next.ts
var next = (editor, options = {}) => {
  const {
    from = "after",
    mode = from === "child" ? "all" : "lowest",
    voids = false
  } = options;
  let match2 = getMatch(editor, options);
  const at = getAt(editor, options.at) ?? editor.selection;
  if (!at) {
    return;
  }
  let start2;
  if (from === "child" && PathApi.isPath(at)) {
    const path2 = PathApi.firstChild(at);
    const fromNode = editor.api.node(path2);
    if (fromNode) {
      start2 = path2;
      match2 = combineMatch((n2, p) => {
        return !PathApi.isAncestor(p, at) && !PathApi.equals(p, at);
      }, match2);
    }
  }
  if (!start2) {
    const pointAfterLocation = editor.api.after(at, { voids });
    if (!pointAfterLocation) return;
    start2 = pointAfterLocation.path;
  }
  const [, to] = editor.api.last([]);
  const span = [start2, to];
  if (PathApi.isPath(at) && at.length === 0) {
    return;
  }
  if (match2 == null) {
    if (PathApi.isPath(at)) {
      const [parent2] = editor.api.parent(at);
      match2 = (n2) => parent2.children.includes(n2);
    } else {
      match2 = () => true;
    }
  }
  const [next2] = editor.api.nodes({ at: span, match: match2, mode, voids });
  return next2;
};

// src/internal/editor/normalizeEditor.ts
var import_slate53 = require("slate");
var normalizeEditor = (editor, options) => (0, import_slate53.normalize)(editor, options);

// src/internal/editor/parent.ts
var import_slate54 = require("slate");
var parent = (editor, at, options) => {
  try {
    return (0, import_slate54.parent)(editor, getAt(editor, at), options);
  } catch {
  }
};

// src/internal/editor/previous.ts
var previousBase = (editor, options) => {
  const { from = "after", mode = "lowest", voids = false } = options;
  let match2 = getMatch(editor, options);
  const at = getAt(editor, options.at) ?? editor.selection;
  if (!at) {
    return;
  }
  let start2;
  if (from === "parent" && PathApi.isPath(at) && at.length > 1) {
    start2 = at;
    match2 = combineMatch((n2, p) => {
      return !PathApi.isAfter(p, at) && !PathApi.equals(p, at);
    }, match2);
  }
  if (!start2) {
    const pointBeforeLocation = editor.api.before(at, { voids });
    if (!pointBeforeLocation) return;
    start2 = pointBeforeLocation.path;
  }
  const [, to] = editor.api.first([]);
  const span = [start2, to];
  if (PathApi.isPath(at) && at.length === 0) {
    return;
  }
  if (match2 == null) {
    if (PathApi.isPath(at)) {
      const [parent2] = editor.api.parent(at);
      match2 = (n2) => parent2.children.includes(n2);
    } else {
      match2 = () => true;
    }
  }
  const [previous2] = editor.api.nodes({
    at: span,
    match: match2,
    mode,
    reverse: true,
    voids
  });
  return previous2;
};
var previous = (editor, options) => {
  const getPrevious = (o3) => {
    try {
      return previousBase(editor, o3);
    } catch {
    }
  };
  if (options?.sibling) {
    const path2 = getQueryOptions(editor, options).at;
    if (!path2) return;
    const previousPath = PathApi.previous(path2);
    if (!previousPath) return;
    const previousNode = editor.api.node(previousPath);
    return previousNode;
  }
  if (!(options?.id && options?.block)) {
    return getPrevious(options);
  }
  const block2 = editor.api.node({
    id: options.id,
    at: []
  });
  if (!block2) return;
  return getPrevious({ at: block2[1], block: true });
};

// src/internal/editor/range.ts
var import_slate55 = require("slate");
var range = (editor, at, to, options) => {
  let from = getAt(editor, at);
  if (RangeApi.isRange(from) && !to) {
    return from;
  }
  if (from === "start") {
    const path2 = editor.api.block({ at: to })?.[1];
    if (!path2) return;
    const anchor = editor.api.start(path2);
    if (!anchor) return;
    const focus2 = PointApi.get(to);
    if (!focus2) return;
    return { anchor, focus: focus2 };
  }
  if (to && from === "before") {
    const anchor = editor.api.before(to, options?.before);
    from = anchor ?? getAt(editor, to);
  }
  return (0, import_slate55.range)(editor, from, getAt(editor, to));
};

// src/internal/editor/removeEditorMark.ts
var import_slate56 = require("slate");
var removeEditorMark = (editor, key) => (0, import_slate56.removeMark)(editor, key);

// src/internal/editor/unhangRange.ts
var import_slate57 = require("slate");
var unhangRange = (editor, range2, options = {}) => {
  const { character, unhang = true, voids } = options;
  if (!RangeApi.isRange(range2)) return range2;
  if (character) {
    let [start2, end2] = RangeApi.edges(range2);
    if (!PathApi.equals(start2.path, end2.path)) {
      if (end2.offset === 0) {
        const pointAfter = editor.api.after(start2);
        if (pointAfter) {
          end2 = pointAfter;
        }
      } else {
        const pointBefore = editor.api.before(end2);
        if (pointBefore) {
          start2 = pointBefore;
        }
      }
    }
    return { anchor: start2, focus: end2 };
  }
  if (unhang) {
    return (0, import_slate57.unhangRange)(editor, range2, { voids });
  }
  return range2;
};

// src/internal/transforms-extension/addMarks.ts
var import_castArray3 = __toESM(require("lodash/castArray.js"));
var addMarks = (editor, marks2, { remove } = {}) => {
  if (!editor.selection) return;
  editor.tf.withoutNormalizing(() => {
    editor.tf.removeMarks([
      ...(0, import_castArray3.default)(remove),
      ...Object.keys(marks2)
    ]);
    Object.entries(marks2).forEach(([key, value]) => {
      editor.tf.addMark(key, value);
    });
  });
};

// src/internal/transforms-extension/duplicateNodes.ts
var duplicateNodes = (editor, { block: block2, nodes: nodes2, ...options } = {}) => {
  const at = getAt(editor, options.at) ?? editor.selection;
  if (!nodes2 || !at) return;
  const entries = nodes2 ?? (block2 ? editor.api.blocks({ at }) : []);
  if (entries.length === 0) return;
  const lastEntry = entries.at(-1);
  const insertPath = PathApi.next(lastEntry[1]);
  const nodesToInsert = entries.map(([node2]) => node2);
  editor.tf.insertNodes(nodesToInsert, {
    at: insertPath,
    ...options
  });
};

// src/internal/transforms-extension/removeMarks.ts
var import_castArray4 = __toESM(require("lodash/castArray.js"));
var removeMarks = (editor, keys, { at, shouldChange = true, ...options } = {}) => {
  const selection = at ?? editor.selection;
  if (!selection) return;
  const match2 = (node2, path2) => {
    if (!TextApi.isText(node2)) {
      return false;
    }
    const [parentNode] = editor.api.parent(path2);
    return !editor.api.isVoid(parentNode) || editor.api.markableVoid(parentNode);
  };
  const expandedSelection = RangeApi.isExpanded(selection);
  let markAcceptingVoidSelected = false;
  if (!expandedSelection) {
    const [selectedNode, selectedPath] = editor.api.node(selection);
    if (selectedNode && match2(selectedNode, selectedPath)) {
      const [parentNode] = editor.api.parent(selectedPath);
      markAcceptingVoidSelected = parentNode && editor.api.markableVoid(parentNode);
    }
  }
  if (keys && (expandedSelection || markAcceptingVoidSelected)) {
    const props = (0, import_castArray4.default)(keys);
    editor.tf.unsetNodes(props, {
      at: selection,
      match: match2,
      split: true,
      voids: true,
      ...options
    });
  } else if (!at) {
    const marks2 = { ...editor.api.marks() };
    if (keys) {
      (0, import_castArray4.default)(keys).forEach((k) => {
        delete marks2[k];
      });
      editor.marks = marks2;
    } else {
      editor.marks = {};
    }
    shouldChange && editor.api.onChange();
  }
};

// src/internal/transforms-extension/replaceNodes.ts
var replaceNodes = (editor, nodes2, {
  at,
  children,
  removeNodes: removeOptions,
  ...options
}) => {
  editor.tf.withoutNormalizing(() => {
    if (children) {
      if (!at) return;
      at = getAt(editor, at);
      const path2 = editor.api.path(at);
      if (!path2) return;
      editor.tf.removeNodes({
        ...removeOptions,
        at: path2,
        children: true
      });
      editor.tf.insertNodes(nodes2, {
        ...options,
        at: path2.concat([0])
      });
    } else {
      editor.tf.removeNodes({ ...removeOptions, at });
      editor.tf.insertNodes(nodes2, {
        ...options,
        at
      });
    }
  });
};

// src/internal/transforms-extension/reset.ts
var reset = (editor, options = {}) => {
  editor.tf.replaceNodes(editor.api.create.value(), {
    at: [],
    children: true,
    ...options
  });
  if (!options.children) {
    editor.operations = [];
    editor.marks = null;
    if (editor.history?.undos) {
      editor.history.undos = [];
      editor.history.redos = [];
    }
  }
};

// src/internal/transforms-extension/toggleBlock.ts
var toggleBlock = (editor, type, {
  defaultType: defaultTypeProp,
  someOptions,
  wrap,
  ...options
} = {}) => {
  const at = options.at ?? editor.selection;
  if (!at) return;
  const isActive = editor.api.some({
    at,
    ...someOptions,
    match: { type }
  });
  if (wrap) {
    if (isActive) {
      editor.tf.unwrapNodes({ at, match: { type } });
    } else {
      editor.tf.wrapNodes({ children: [], type }, { at });
    }
    return;
  }
  const defaultType = defaultTypeProp ?? editor.api.create.block().type ?? "p";
  if (isActive && type === defaultType) return;
  editor.tf.setNodes(
    {
      type: isActive ? defaultType : type
    },
    { at, ...options }
  );
};

// src/internal/transforms-extension/toggleMark.ts
var import_castArray5 = __toESM(require("lodash/castArray.js"));
var toggleMark = (editor, key, { remove } = {}) => {
  if (!editor.selection) return;
  editor.tf.withoutNormalizing(() => {
    if (editor.api.hasMark(key)) {
      editor.tf.removeMark(key);
      return;
    }
    editor.tf.removeMarks([...(0, import_castArray5.default)(remove), key]);
    editor.tf.addMark(key, true);
  });
};

// src/internal/transforms/collapseSelection.ts
var import_slate58 = require("slate");
var collapseSelection = (editor, options) => {
  (0, import_slate58.collapse)(editor, options);
};

// src/internal/transforms/deleteText.ts
var import_slate59 = require("slate");
var deleteText = (editor, options) => {
  (0, import_slate59.deleteText)(editor, {
    ...options,
    at: getAt(editor, options?.at)
  });
};

// src/internal/transforms/deselect.ts
var import_slate60 = require("slate");
var deselect = (editor) => {
  (0, import_slate60.deselect)(editor);
};

// src/internal/transforms/insertFragment.ts
var import_slate61 = require("slate");
var insertFragment = (editor, fragment2, options) => {
  (0, import_slate61.insertFragment)(editor, fragment2, {
    ...options,
    at: getAt(editor, options?.at)
  });
};

// src/internal/transforms/insertNodes.ts
var import_slate62 = require("slate");
var insertNodes = (editor, nodes2, { nextBlock, removeEmpty, ...options } = {}) => {
  options = getQueryOptions(editor, options);
  editor.tf.withoutNormalizing(() => {
    if (removeEmpty) {
      const blockEntry = editor.api.above({ at: options.at });
      if (blockEntry) {
        const queryNodeOptions = removeEmpty === true ? {
          allow: ["p"]
        } : removeEmpty;
        const { filter } = queryNodeOptions;
        queryNodeOptions.filter = ([node2, path2]) => {
          if (NodeApi.string(node2)) return false;
          const children = node2.children;
          if (children.some((n2) => editor.api.isInline(n2))) return false;
          return !filter || filter([node2, path2]);
        };
        if (queryNode(blockEntry, queryNodeOptions)) {
          editor.tf.removeNodes({ at: blockEntry[1] });
          nextBlock = false;
        }
      }
    }
    if (nextBlock) {
      const { at = editor.selection } = options;
      if (at) {
        const endPoint = editor.api.end(at);
        const blockEntry = editor.api.above({
          at: endPoint,
          block: true
        });
        if (blockEntry) {
          options.at = PathApi.next(blockEntry[1]);
        }
      }
    }
    (0, import_slate62.insertNodes)(editor, nodes2, options);
  });
};

// src/internal/transforms/insertText.ts
var import_slate63 = require("slate");
var insertText = (editor, text, { marks: marks2 = true, ...options } = {}) => {
  const at = getAt(editor, options.at);
  if (at) {
    import_slate63.Transforms.insertText(editor, text, { ...options, at });
    return;
  }
  if (editor.selection) {
    if (marks2 && editor.marks) {
      const node2 = { text, ...editor.marks };
      editor.tf.insertNodes(node2, {
        voids: options.voids
      });
      editor.marks = null;
    } else {
      import_slate63.Transforms.insertText(editor, text, options);
    }
  }
};

// src/internal/transforms/liftNodes.ts
var import_slate64 = require("slate");
var liftNodes = (editor, options) => {
  return (0, import_slate64.liftNodes)(editor, getQueryOptions(editor, options));
};

// src/internal/transforms/mergeNodes.ts
var mergeNodes = (editor, options = {}) => {
  options = getQueryOptions(editor, options);
  editor.tf.withoutNormalizing(() => {
    let { at = editor.selection, match: match2 } = options;
    const {
      hanging = false,
      mergeNode,
      mode = "lowest",
      removeEmptyAncestor,
      voids = false
    } = options;
    if (!at) {
      return;
    }
    if (match2 == null) {
      if (PathApi.isPath(at)) {
        const [parent2] = editor.api.parent(at);
        match2 = (n2) => parent2.children.includes(n2);
      } else {
        match2 = (n2) => editor.api.isBlock(n2);
      }
    }
    if (!hanging && RangeApi.isRange(at)) {
      at = editor.api.unhangRange(at);
    }
    if (RangeApi.isRange(at)) {
      if (RangeApi.isCollapsed(at)) {
        at = at.anchor;
      } else {
        const [, end2] = RangeApi.edges(at);
        const pointRef2 = editor.api.pointRef(end2);
        editor.tf.delete({ at });
        at = pointRef2.unref();
        if (options.at == null) {
          editor.tf.select(at);
        }
      }
    }
    const _nodes = editor.api.nodes({ at, match: match2, mode, voids });
    const [current] = Array.from(_nodes);
    const prev = editor.api.previous({ at, match: match2, mode, voids });
    if (!current || !prev) {
      return;
    }
    const [node2, path2] = current;
    const [prevNode, prevPath] = prev;
    if (path2.length === 0 || prevPath.length === 0) {
      return;
    }
    const newPath = PathApi.next(prevPath);
    const commonPath = PathApi.common(path2, prevPath);
    const isPreviousSibling = PathApi.isSibling(path2, prevPath);
    const _levels = editor.api.levels({ at: path2 });
    const levels2 = new Set(
      Array.from(_levels, ([n2]) => n2).slice(commonPath.length).slice(0, -1)
    );
    const emptyAncestor = editor.api.above({
      at: path2,
      mode: "highest",
      match: (n2) => levels2.has(n2) && ElementApi.isElement(n2) && NodeApi.hasSingleChild(n2)
    });
    const emptyRef = emptyAncestor && editor.api.pathRef(emptyAncestor[1]);
    let properties;
    let position;
    if (TextApi.isText(node2) && TextApi.isText(prevNode)) {
      const { text, ...rest } = node2;
      position = prevNode.text.length;
      properties = rest;
    } else if (ElementApi.isElement(node2) && ElementApi.isElement(prevNode)) {
      const { children, ...rest } = node2;
      position = prevNode.children.length;
      properties = rest;
    } else {
      throw new TypeError(
        `Cannot merge the node at path [${path2}] with the previous sibling because it is not the same kind: ${JSON.stringify(
          node2
        )} ${JSON.stringify(prevNode)}`
      );
    }
    if (!isPreviousSibling && // DIFF
    !mergeNode) {
      editor.tf.moveNodes({ at: path2, to: newPath, voids });
    }
    if (emptyRef) {
      if (removeEmptyAncestor) {
        const emptyPath = emptyRef.current;
        emptyPath && removeEmptyAncestor(editor, { at: emptyPath });
      } else {
        editor.tf.removeNodes({ at: emptyRef.current, voids });
      }
    }
    if (mergeNode) {
      mergeNode(editor, { at: path2, to: newPath });
    } else if (ElementApi.isElement(prevNode) && editor.api.isEmpty(prevNode) || TextApi.isText(prevNode) && prevNode.text === "") {
      editor.tf.removeNodes({ at: prevPath, voids });
    } else {
      editor.tf.apply({
        path: newPath,
        position,
        properties,
        type: "merge_node"
      });
    }
    if (emptyRef) {
      emptyRef.unref();
    }
  });
};

// src/internal/transforms/moveNodes.ts
var import_slate65 = require("slate");
var moveNodes = (editor, { children, fromIndex = 0, ...opt }) => {
  const options = getQueryOptions(editor, opt);
  let moved = false;
  if (children) {
    if (!options.at) return moved;
    const entry = editor.api.node(options.at);
    if (!entry) return moved;
    const [node2, path2] = entry;
    if (!editor.api.isBlock(node2)) return moved;
    for (let i = node2.children.length - 1; i >= fromIndex; i--) {
      const childPath = [...path2, i];
      const childNode = NodeApi.get(editor, childPath);
      if (!options.match || childNode && options.match(childNode, childPath)) {
        (0, import_slate65.moveNodes)(editor, {
          ...options,
          at: childPath
        });
        moved = true;
      }
    }
    return moved;
  }
  return (0, import_slate65.moveNodes)(editor, options);
};

// src/internal/transforms/moveSelection.ts
var import_slate66 = require("slate");
var moveSelection = (editor, options) => {
  (0, import_slate66.move)(editor, options);
};

// src/internal/transforms/removeNodes.ts
var import_slate67 = require("slate");
var removeNodes = (editor, { children, previousEmptyBlock, ...opt } = {}) => {
  const options = getQueryOptions(editor, opt);
  editor.tf.withoutNormalizing(() => {
    if (previousEmptyBlock) {
      const entry = editor.api.block({ at: options.at });
      if (!entry) return;
      const prevEntry = editor.api.previous({
        at: entry[1],
        sibling: true
      });
      if (!prevEntry) return;
      const [prevNode, prevPath] = prevEntry;
      if (editor.api.isEmpty(prevNode)) {
        editor.tf.removeNodes({ at: prevPath });
      }
      return;
    }
    if (children && options.at) {
      for (const [, childPath] of NodeApi.children(editor, options.at, {
        reverse: true
      })) {
        editor.tf.removeNodes({ ...options, at: childPath });
      }
      return;
    }
    return (0, import_slate67.removeNodes)(editor, getQueryOptions(editor, options));
  });
};

// src/internal/transforms/setNodes.ts
var import_slate68 = require("slate");
var setNodes = (editor, props, { marks: marks2, ...options } = {}) => {
  if (marks2) {
    let at = getAt(editor, options.at) ?? editor.selection;
    if (!at) return;
    if (PathApi.isPath(at)) {
      at = editor.api.range(at);
    }
    if (!RangeApi.isRange(at)) return;
    const match2 = (node2, path2) => {
      if (!TextApi.isText(node2)) return false;
      const parentEntry = editor.api.parent(path2);
      if (!parentEntry) return false;
      const [parentNode] = parentEntry;
      return !editor.api.isVoid(parentNode) || editor.api.markableVoid(parentNode);
    };
    const isExpandedRange = RangeApi.isExpanded(at);
    let markAcceptingVoidSelected = false;
    if (!isExpandedRange) {
      const selectedEntry = editor.api.node(at);
      if (!selectedEntry) return;
      const [selectedNode, selectedPath] = selectedEntry;
      if (selectedNode && match2(selectedNode, selectedPath)) {
        const parentEntry = editor.api.parent(selectedPath);
        if (!parentEntry) return;
        const [parentNode] = parentEntry;
        markAcceptingVoidSelected = parentNode && editor.api.markableVoid(parentNode);
      }
    }
    if (isExpandedRange || markAcceptingVoidSelected) {
      return (0, import_slate68.setNodes)(
        editor,
        props,
        getQueryOptions(editor, {
          ...options,
          at,
          match: match2,
          split: true,
          voids: true
        })
      );
    }
  }
  return (0, import_slate68.setNodes)(
    editor,
    props,
    getQueryOptions(editor, options)
  );
};

// src/internal/transforms/setPoint.ts
var import_slate69 = require("slate");
var setPoint = (editor, props, options) => {
  (0, import_slate69.setPoint)(editor, props, options);
};

// src/internal/transforms/setSelection.ts
var import_slate70 = require("slate");
var setSelection = (editor, props) => {
  (0, import_slate70.setSelection)(editor, props);
};

// src/internal/transforms/splitNodes.ts
var import_slate71 = require("slate");
var splitNodes = (editor, options) => {
  return (0, import_slate71.splitNodes)(editor, getQueryOptions(editor, options));
};

// src/internal/transforms/unsetNodes.ts
var import_slate72 = require("slate");
var unsetNodes = (editor, props, options) => {
  return (0, import_slate72.unsetNodes)(
    editor,
    props,
    getQueryOptions(editor, options)
  );
};

// src/internal/transforms/unwrapNodes.ts
var import_slate73 = require("slate");
var unwrapNodes = (editor, options) => {
  (0, import_slate73.unwrapNodes)(editor, getQueryOptions(editor, options));
};

// src/internal/transforms/wrapNodes.ts
var import_slate74 = require("slate");
var wrapNodes = (editor, element, { children, ...opt } = {}) => {
  const options = getQueryOptions(editor, opt);
  if (options.at) {
    options.at = editor.api.unhangRange(options.at, options);
  }
  if (children) {
    const path2 = editor.api.path(options.at);
    if (!path2) return;
    const node2 = NodeApi.get(editor, path2);
    if (!node2?.children) return;
    editor.tf.withoutNormalizing(() => {
      const firstChildPath = PathApi.firstChild(path2);
      (0, import_slate74.wrapNodes)(editor, element, {
        ...options,
        at: firstChildPath
      });
      if (node2.children.length > 1) {
        editor.tf.moveNodes({
          at: path2,
          children: true,
          fromIndex: 1,
          to: PathApi.child(firstChildPath, 1)
        });
      }
    });
    return;
  }
  (0, import_slate74.wrapNodes)(editor, element, options);
};

// src/slate-history/history.ts
var import_is_plain_object = require("is-plain-object");
var SAVING = /* @__PURE__ */ new WeakMap();
var MERGING = /* @__PURE__ */ new WeakMap();
var SPLITTING_ONCE = /* @__PURE__ */ new WeakMap();
var HistoryApi = {
  /** Check if a value is a `History` object. */
  isHistory(value) {
    return (0, import_is_plain_object.isPlainObject)(value) && Array.isArray(value.redos) && Array.isArray(value.undos) && (value.redos.length === 0 || OperationApi.isOperationList(value.redos[0].operations)) && (value.undos.length === 0 || OperationApi.isOperationList(value.undos[0].operations));
  },
  /** Get the merge flag's current value. */
  isMerging(editor) {
    return MERGING.get(editor);
  },
  /** Get the splitting once flag's current value. */
  isSaving(editor) {
    return SAVING.get(editor);
  },
  isSplittingOnce(editor) {
    return SPLITTING_ONCE.get(editor);
  },
  /** Get the saving flag's current value. */
  redo(editor) {
    editor.redo();
  },
  /** Redo to the previous saved state. */
  setSplittingOnce(editor, value) {
    SPLITTING_ONCE.set(editor, value);
  },
  /** Undo to the previous saved state. */
  undo(editor) {
    editor.undo();
  },
  /**
   * Apply a series of changes inside a synchronous `fn`, These operations will
   * be merged into the previous history.
   */
  withMerging(editor, fn) {
    const prev = editor.api.isMerging();
    MERGING.set(editor, true);
    fn();
    MERGING.set(editor, prev);
  },
  /**
   * Apply a series of changes inside a synchronous `fn`, ensuring that the
   * first operation starts a new batch in the history. Subsequent operations
   * will be merged as usual.
   */
  withNewBatch(editor, fn) {
    const prev = editor.api.isMerging();
    MERGING.set(editor, true);
    SPLITTING_ONCE.set(editor, true);
    fn();
    MERGING.set(editor, prev);
    SPLITTING_ONCE.delete(editor);
  },
  /**
   * Apply a series of changes inside a synchronous `fn`, without merging any of
   * the new operations into previous save point in the history.
   */
  withoutMerging(editor, fn) {
    const prev = editor.api.isMerging();
    MERGING.set(editor, false);
    fn();
    MERGING.set(editor, prev);
  },
  /**
   * Apply a series of changes inside a synchronous `fn`, without saving any of
   * their operations into the history.
   */
  withoutSaving(editor, fn) {
    const prev = editor.api.isSaving();
    SAVING.set(editor, false);
    fn();
    SAVING.set(editor, prev);
  }
};

// src/create-editor.ts
var noop = (name, returnValue) => () => {
  console.warn(
    `[OVERRIDE_MISSING] The method editor.${name}() has not been implemented or overridden. This may cause unexpected behavior. Please ensure that all required editor methods are properly defined.`
  );
  return returnValue;
};
var createEditor = ({
  children,
  selection
} = {}) => {
  const editor = (0, import_slate75.createEditor)();
  if (children) {
    editor.children = children;
  }
  if (selection) {
    editor.selection = selection;
  }
  Object.assign(editor, {
    apply: (0, import_utils32.bindFirst)(import_slate75.apply, editor),
    isElementReadOnly: editor.isElementReadOnly,
    isInline: editor.isInline,
    isSelectable: editor.isSelectable,
    isVoid: editor.isVoid,
    markableVoid: editor.markableVoid,
    onChange: editor.onChange
  });
  Object.assign(editor, {
    addMark: (0, import_utils32.bindFirst)(addMark, editor),
    deleteBackward: (0, import_utils32.bindFirst)(deleteBackward, editor),
    deleteForward: (0, import_utils32.bindFirst)(deleteForward, editor),
    deleteFragment: (0, import_utils32.bindFirst)(deleteFragment, editor),
    getDirtyPaths: (0, import_utils32.bindFirst)(import_slate75.getDirtyPaths, editor),
    getFragment: (0, import_utils32.bindFirst)(getFragment, editor),
    insertBreak: (0, import_utils32.bindFirst)(insertBreak, editor),
    insertFragment: (0, import_utils32.bindFirst)(insertFragment, editor),
    insertNode: (0, import_utils32.bindFirst)(insertNode, editor),
    insertSoftBreak: (0, import_utils32.bindFirst)(import_slate75.insertSoftBreak, editor),
    insertText: (0, import_utils32.bindFirst)(insertText, editor),
    normalizeNode: (0, import_utils32.bindFirst)(import_slate75.normalizeNode, editor),
    removeMark: (0, import_utils32.bindFirst)(removeEditorMark, editor),
    shouldNormalize: (0, import_utils32.bindFirst)(import_slate75.shouldNormalize, editor)
  });
  Object.assign(editor, {
    above: (0, import_utils32.bindFirst)(above, editor),
    after: (0, import_utils32.bindFirst)(getPointAfter, editor),
    before: (0, import_utils32.bindFirst)(getPointBefore, editor),
    collapse: (0, import_utils32.bindFirst)(collapseSelection, editor),
    delete: (0, import_utils32.bindFirst)(deleteText, editor),
    deselect: (0, import_utils32.bindFirst)(deselect, editor),
    deselectDOM: (0, import_utils32.bindFirst)(deselectDOM, editor),
    edges: (0, import_utils32.bindFirst)(getEdgePoints, editor),
    elementReadOnly: (0, import_utils32.bindFirst)(isElementReadOnly, editor),
    end: (0, import_utils32.bindFirst)(getEndPoint, editor),
    first: (0, import_utils32.bindFirst)(getFirstNode, editor),
    fragment: (0, import_utils32.bindFirst)(getFragment, editor),
    getMarks: (0, import_utils32.bindFirst)(getMarks, editor),
    hasBlocks: (0, import_utils32.bindFirst)(hasBlocks, editor),
    hasInlines: (0, import_utils32.bindFirst)(hasInlines, editor),
    hasPath: (0, import_utils32.bindFirst)(import_slate75.hasPath, editor),
    hasTexts: (0, import_utils32.bindFirst)(hasTexts, editor),
    insertNodes: (0, import_utils32.bindFirst)(insertNodes, editor),
    isBlock: (0, import_utils32.bindFirst)(isBlock, editor),
    isEdge: (0, import_utils32.bindFirst)(isEdgePoint, editor),
    isEmpty: (0, import_utils32.bindFirst)(isEmpty, editor),
    isEnd: (0, import_utils32.bindFirst)(isEndPoint, editor),
    isNormalizing: (0, import_utils32.bindFirst)(isEditorNormalizing, editor),
    isStart: (0, import_utils32.bindFirst)(isStartPoint, editor),
    last: (0, import_utils32.bindFirst)(last, editor),
    leaf: (0, import_utils32.bindFirst)(getLeafNode, editor),
    levels: (0, import_utils32.bindFirst)(getLevels, editor),
    liftNodes: (0, import_utils32.bindFirst)(liftNodes, editor),
    mergeNodes: (0, import_utils32.bindFirst)(mergeNodes, editor),
    move: (0, import_utils32.bindFirst)(moveSelection, editor),
    moveNodes: (0, import_utils32.bindFirst)(moveNodes, editor),
    next: (0, import_utils32.bindFirst)(next, editor),
    node: (0, import_utils32.bindFirst)(node, editor),
    nodes: (0, import_utils32.bindFirst)(nodes, editor),
    normalize: (0, import_utils32.bindFirst)(normalizeEditor, editor),
    parent: (0, import_utils32.bindFirst)(parent, editor),
    path: (0, import_utils32.bindFirst)(path, editor),
    pathRef: (0, import_utils32.bindFirst)(createPathRef, editor),
    pathRefs: (0, import_utils32.bindFirst)(getPathRefs, editor),
    point: (0, import_utils32.bindFirst)(getPoint, editor),
    pointRef: (0, import_utils32.bindFirst)(createPointRef, editor),
    pointRefs: (0, import_utils32.bindFirst)(getPointRefs, editor),
    positions: (0, import_utils32.bindFirst)(getPositions, editor),
    previous: (0, import_utils32.bindFirst)(previous, editor),
    range: (0, import_utils32.bindFirst)(range, editor),
    rangeRef: (0, import_utils32.bindFirst)(createRangeRef, editor),
    rangeRefs: (0, import_utils32.bindFirst)(getRangeRefs, editor),
    removeNodes: (0, import_utils32.bindFirst)(removeNodes, editor),
    select: (0, import_utils32.bindFirst)(select, editor),
    setNodes: (0, import_utils32.bindFirst)(setNodes, editor),
    setNormalizing: (0, import_utils32.bindFirst)(import_slate75.setNormalizing, editor),
    setPoint: (0, import_utils32.bindFirst)(setPoint, editor),
    setSelection: (0, import_utils32.bindFirst)(setSelection, editor),
    shouldMergeNodesRemovePrevNode: (0, import_utils32.bindFirst)(
      import_slate75.shouldMergeNodesRemovePrevNode,
      editor
    ),
    splitNodes: (0, import_utils32.bindFirst)(splitNodes, editor),
    start: (0, import_utils32.bindFirst)(getStartPoint, editor),
    string: (0, import_utils32.bindFirst)(getEditorString, editor),
    unhangRange: (0, import_utils32.bindFirst)(unhangRange, editor),
    unsetNodes: (0, import_utils32.bindFirst)(unsetNodes, editor),
    unwrapNodes: (0, import_utils32.bindFirst)(unwrapNodes, editor),
    void: (0, import_utils32.bindFirst)(getVoidNode, editor),
    withoutNormalizing: (0, import_utils32.bindFirst)(withoutNormalizing, editor),
    wrapNodes: (0, import_utils32.bindFirst)(wrapNodes, editor)
  });
  Object.assign(editor, {
    history: { redos: [], undos: [] },
    redo: noop("redo"),
    undo: noop("undo"),
    writeHistory: noop("writeHistory")
  });
  Object.assign(editor, {
    insertData: noop("insertData"),
    insertFragmentData: noop("insertFragmentData", false),
    insertTextData: noop("insertTextData", false),
    setFragmentData: noop("setFragmentData")
  });
  const api = {
    block: (0, import_utils32.bindFirst)(block, editor),
    blocks: (0, import_utils32.bindFirst)(blocks, editor),
    create: {
      block: (props) => ({ children: [{ text: "" }], type: "p", ...props }),
      value: () => [api.create.block()]
    },
    descendant: (0, import_utils32.bindFirst)(descendant, editor),
    edgeBlocks: (0, import_utils32.bindFirst)(edgeBlocks, editor),
    findDocumentOrShadowRoot: (0, import_utils32.bindFirst)(findDocumentOrShadowRoot, editor),
    findEventRange: (0, import_utils32.bindFirst)(findEventRange, editor),
    findKey: (0, import_utils32.bindFirst)(findKey, editor),
    findPath: (0, import_utils32.bindFirst)(findPath, editor),
    getWindow: (0, import_utils32.bindFirst)(getWindow, editor),
    hasDOMNode: (0, import_utils32.bindFirst)(hasDOMNode, editor),
    hasEditableTarget: (0, import_utils32.bindFirst)(hasEditableTarget, editor),
    hasMark: (0, import_utils32.bindFirst)(hasMark, editor),
    hasRange: (0, import_utils32.bindFirst)(hasRange, editor),
    hasSelectableTarget: (0, import_utils32.bindFirst)(hasSelectableTarget, editor),
    hasTarget: (0, import_utils32.bindFirst)(hasTarget, editor),
    isAt: (0, import_utils32.bindFirst)(isAt, editor),
    isComposing: (0, import_utils32.bindFirst)(isComposing, editor),
    isEditorEnd: (0, import_utils32.bindFirst)(isEditorEnd, editor),
    isFocused: (0, import_utils32.bindFirst)(isFocused, editor),
    isMerging: (0, import_utils32.bindFirst)(HistoryApi.isMerging, editor),
    isReadOnly: (0, import_utils32.bindFirst)(isReadOnly, editor),
    isSaving: (0, import_utils32.bindFirst)(HistoryApi.isSaving, editor),
    isSelected: (0, import_utils32.bindFirst)(isSelected, editor),
    isSplittingOnce: (0, import_utils32.bindFirst)(HistoryApi.isSplittingOnce, editor),
    isTargetInsideNonReadonlyVoid: (0, import_utils32.bindFirst)(
      isTargetInsideNonReadonlyVoid,
      editor
    ),
    isText: (0, import_utils32.bindFirst)(isText, editor),
    mark: (0, import_utils32.bindFirst)(mark, editor),
    nodesRange: (0, import_utils32.bindFirst)(nodesRange, editor),
    prop,
    scrollIntoView: (0, import_utils32.bindFirst)(scrollIntoView, editor),
    some: (0, import_utils32.bindFirst)(some, editor),
    toDOMNode: (0, import_utils32.bindFirst)(toDOMNode, editor),
    toDOMPoint: (0, import_utils32.bindFirst)(toDOMPoint, editor),
    toDOMRange: (0, import_utils32.bindFirst)(toDOMRange, editor),
    toSlateNode: (0, import_utils32.bindFirst)(toSlateNode, editor),
    toSlatePoint: (0, import_utils32.bindFirst)(toSlatePoint, editor),
    toSlateRange: (0, import_utils32.bindFirst)(toSlateRange, editor),
    isCollapsed: () => RangeApi.isCollapsed(editor.selection),
    isExpanded: () => RangeApi.isExpanded(editor.selection),
    shouldNormalizeNode: () => true
  };
  const transforms = {
    addMarks: (0, import_utils32.bindFirst)(addMarks, editor),
    blur: (0, import_utils32.bindFirst)(blur, editor),
    deselectDOM: (0, import_utils32.bindFirst)(deselectDOM, editor),
    duplicateNodes: (0, import_utils32.bindFirst)(duplicateNodes, editor),
    focus: (0, import_utils32.bindFirst)(focus, editor),
    removeMarks: (0, import_utils32.bindFirst)(removeMarks, editor),
    replaceNodes: (0, import_utils32.bindFirst)(replaceNodes, editor),
    reset: (0, import_utils32.bindFirst)(reset, editor),
    setSplittingOnce: (0, import_utils32.bindFirst)(HistoryApi.setSplittingOnce, editor),
    toggleBlock: (0, import_utils32.bindFirst)(toggleBlock, editor),
    toggleMark: (0, import_utils32.bindFirst)(toggleMark, editor),
    withMerging: (0, import_utils32.bindFirst)(HistoryApi.withMerging, editor),
    withNewBatch: (0, import_utils32.bindFirst)(HistoryApi.withNewBatch, editor),
    withoutMerging: (0, import_utils32.bindFirst)(HistoryApi.withoutMerging, editor),
    withoutSaving: (0, import_utils32.bindFirst)(HistoryApi.withoutSaving, editor)
  };
  editor.api = api;
  editor.tf = transforms;
  editor.transforms = transforms;
  syncLegacyMethods(editor);
  return editor;
};

// src/slate-dom.ts
var import_slate_dom24 = require("slate-dom");
var import_slate_dom25 = require("slate-dom");
var import_slate_dom26 = require("slate-dom");
var import_slate_dom27 = require("slate-dom");
var import_slate_dom28 = require("slate-dom");
var import_slate_dom29 = require("slate-dom");

// src/slate-history/with-history.ts
var withHistory = (editor) => {
  const e3 = editor;
  const { apply: apply2 } = e3;
  e3.history = { redos: [], undos: [] };
  e3.redo = () => {
    const { history } = e3;
    const { redos } = history;
    if (redos.length > 0) {
      const batch = redos.at(-1);
      if (batch.selectionBefore) {
        e3.tf.setSelection(batch.selectionBefore);
      }
      e3.tf.withoutSaving(() => {
        e3.tf.withoutNormalizing(() => {
          for (const op of batch.operations) {
            e3.apply(op);
          }
        });
      });
      history.redos.pop();
      e3.writeHistory("undos", batch);
    }
  };
  e3.undo = () => {
    const { history } = e3;
    const { undos } = history;
    if (undos.length > 0) {
      const batch = undos.at(-1);
      e3.tf.withoutSaving(() => {
        e3.tf.withoutNormalizing(() => {
          const inverseOps = batch.operations.map(OperationApi.inverse).reverse();
          for (const op of inverseOps) {
            e3.apply(op);
          }
          if (batch.selectionBefore) {
            e3.tf.setSelection(batch.selectionBefore);
          }
        });
      });
      e3.writeHistory("redos", batch);
      history.undos.pop();
    }
  };
  e3.apply = (op) => {
    const { history, operations } = e3;
    const { undos } = history;
    const lastBatch = undos.at(-1);
    const lastOp = lastBatch?.operations.at(-1);
    let save = e3.api.isSaving();
    let merge = e3.api.isMerging();
    if (save == null) {
      save = shouldSave(op, lastOp);
    }
    if (save) {
      if (merge == null) {
        if (lastBatch == null) {
          merge = false;
        } else if (operations.length > 0) {
          merge = true;
        } else {
          merge = shouldMerge(op, lastOp);
        }
      }
      if (e3.api.isSplittingOnce()) {
        merge = false;
        e3.tf.setSplittingOnce(void 0);
      }
      if (lastBatch && merge) {
        lastBatch.operations.push(op);
      } else {
        const batch = {
          operations: [op],
          selectionBefore: e3.selection
        };
        e3.writeHistory("undos", batch);
      }
      while (undos.length > 100) {
        undos.shift();
      }
      history.redos = [];
    }
    apply2(op);
  };
  e3.writeHistory = (stack, batch) => {
    e3.history[stack].push(batch);
  };
  return e3;
};
var shouldMerge = (op, prev) => {
  if (prev && op.type === "insert_text" && prev.type === "insert_text" && op.offset === prev.offset + prev.text.length && PathApi.equals(op.path, prev.path)) {
    return true;
  }
  if (prev && op.type === "remove_text" && prev.type === "remove_text" && op.offset + op.text.length === prev.offset && PathApi.equals(op.path, prev.path)) {
    return true;
  }
  return false;
};
var shouldSave = (op, _) => {
  if (op.type === "set_selection") {
    return false;
  }
  return true;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CAN_USE_DOM,
  ElementApi,
  HAS_BEFORE_INPUT_SUPPORT,
  HistoryApi,
  IS_ANDROID,
  IS_CHROME,
  IS_FIREFOX,
  IS_FIREFOX_LEGACY,
  IS_IOS,
  IS_UC_MOBILE,
  IS_WEBKIT,
  IS_WECHATBROWSER,
  LocationApi,
  NodeApi,
  OperationApi,
  PathApi,
  PathRefApi,
  PointApi,
  PointRefApi,
  RangeApi,
  RangeRefApi,
  SpanApi,
  TRIPLE_CLICK,
  TextApi,
  applyStringDiff,
  assignLegacyApi,
  assignLegacyTransforms,
  combineMatch,
  combineMatchOptions,
  createEditor,
  deleteMerge,
  getActiveElement,
  getAt,
  getDefaultView,
  getMatch,
  getQueryOptions,
  getSelection,
  hasShadowRoot,
  isAfter,
  isBefore,
  isDOMElement,
  isDOMNode,
  isDOMSelection,
  isElementDecorationsEqual,
  isPlainTextOnlyPaste,
  isTextDecorationsEqual,
  isTrackedMutation,
  match,
  mergeStringDiffs,
  normalizeDOMPoint,
  normalizePoint,
  normalizeRange,
  normalizeStringDiff,
  queryEditor,
  queryNode,
  syncLegacyMethods,
  targetRange,
  verifyDiffState,
  withDOM,
  withHistory
});
//# sourceMappingURL=index.js.map