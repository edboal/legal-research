import { UnknownObject, Simplify, UnionToIntersection, OmitFirst } from '@udecode/utils';
import * as slate from 'slate';
import { Selection, Span as Span$1, DecoratedRange as DecoratedRange$1, EditorPathOptions as EditorPathOptions$1, EditorPointOptions as EditorPointOptions$1, deleteBackward as deleteBackward$1, deleteForward as deleteForward$1 } from 'slate';
import * as slate_dom from 'slate-dom';
import { DOMNode, DOMEditor, DOMPoint, DOMRange } from 'slate-dom';
export { CAN_USE_DOM, DOMElement, DOMNode, DOMPoint, DOMRange, DOMSelection, DOMStaticRange, DOMText, HAS_BEFORE_INPUT_SUPPORT, IS_ANDROID, IS_CHROME, IS_FIREFOX, IS_FIREFOX_LEGACY, IS_IOS, IS_UC_MOBILE, IS_WEBKIT, IS_WECHATBROWSER, StringDiff, TRIPLE_CLICK, TextDiff, applyStringDiff, getActiveElement, getDefaultView, getSelection, hasShadowRoot, isAfter, isBefore, isDOMElement, isDOMNode, isDOMSelection, isElementDecorationsEqual, isPlainTextOnlyPaste, isTextDecorationsEqual, isTrackedMutation, mergeStringDiffs, normalizeDOMPoint, normalizePoint, normalizeRange, normalizeStringDiff, targetRange, verifyDiffState, withDOM } from 'slate-dom';
import { StandardBehaviorOptions } from 'scroll-into-view-if-needed';
import { EditorPathRefOptions as EditorPathRefOptions$1, EditorPointRefOptions as EditorPointRefOptions$1, EditorRangeRefOptions as EditorRangeRefOptions$1, EditorFragmentDeletionOptions as EditorFragmentDeletionOptions$1 } from 'slate/dist/interfaces/editor';
import { SelectionCollapseOptions, SelectionMoveOptions, SelectionSetPointOptions } from 'slate/dist/interfaces/transforms/selection';

declare const findDocumentOrShadowRoot: (editor: Editor) => Document | ShadowRoot | undefined;

declare const findEventRange: (editor: Editor, event: any) => slate.BaseRange | undefined;

declare const findKey: (editor: Editor, node: TNode) => slate_dom.Key | undefined;

declare const getWindow: (editor: Editor) => Window | undefined;

declare const hasDOMNode: (editor: Editor, target: DOMNode, options?: Parameters<typeof DOMEditor.hasDOMNode>[2]) => boolean;

declare const hasRange: (editor: Editor, range: TRange) => boolean;

declare const isComposing: (editor: Editor) => boolean;

declare const isFocused: (editor: Editor) => boolean;

declare const isReadOnly: (editor: Editor) => boolean;

declare const isTargetInsideNonReadonlyVoid: (editor: Editor, target: EventTarget | null) => boolean;

type At = TLocation | TNode;
type AtOrDescendant = Descendant | TLocation;
type LeafEdge = 'end' | 'start';
type MaximizeMode = RangeMode | 'all';
type MoveUnit = 'character' | 'line' | 'offset' | 'word';
type RangeDirection = TextDirection | 'inward' | 'outward';
type RangeMode = 'highest' | 'lowest';
type SelectionEdge = 'anchor' | 'end' | 'focus' | 'start';
type SelectionMode = 'all' | 'highest' | 'lowest';
type TextDirection = 'backward' | 'forward';
type TextUnit = 'block' | 'character' | 'line' | 'word';
type TextUnitAdjustment = TextUnit | 'offset';
type TSelection = Selection;
type TSpan = Span$1;

type Point = {
    /** The index of the character in the text node. */
    offset: number;
    /** The path to the text node. */
    path: Path;
};
/** Point retrieval, check and transform methods. */
declare const PointApi: {
    /**
     * Compare a point to another, returning an integer indicating whether the
     * point was before, at, or after the other.
     */
    compare: (point: Point, another: Point) => -1 | 0 | 1;
    /** Check if a point is exactly equal to another. */
    equals: (point: Point, another: Point) => boolean;
    /**
     * Get the point from a location. If the location is a range, get the anchor
     * point (if `focus` is true, get the focus point). If the location is a path,
     * get the point at this path with offset 0.
     */
    get: (at?: At | null, { focus, }?: {
        focus?: boolean;
    }) => Point | undefined;
    /** Check if a point is after another. */
    isAfter: (point: Point, another: Point) => boolean;
    /** Check if a point is before another. */
    isBefore: (point: Point, another: Point) => boolean;
    /** Check if a value implements the `Point` interface. */
    isPoint: (value: any) => value is Point;
    /** Transform a point by an operation. */
    transform: (point: Point, op: Operation, options?: PointTransformOptions) => Point | null;
};
type PointEntry = [Point, 'anchor' | 'focus'];
/**
 * `PointEntry` objects are returned when iterating over `Point` objects that
 * belong to a range.
 */
interface PointTransformOptions {
    affinity?: TextDirection | null;
}

/**
 * `TRange` objects are a set of points that refer to a specific span of a Slate
 * document. They can define a span inside a single node or a can span across
 * multiple nodes.
 */
type TRange = {
    /** The start point of the range. */
    anchor: Point;
    /** The end point of the range. */
    focus: Point;
};
declare const RangeApi: {
    /**
     * Check if a range fully contains another range, meaning that both the start
     * and end points of the target range are included in the range.
     */
    contains: (range: TRange, target: TRange) => boolean;
    /**
     * Get the start and end points of a range, in the order in which they appear
     * in the document.
     */
    edges: (range: TRange, options?: RangeEdgesOptions) => [Point, Point];
    /** Get the end point of a range. */
    end: (range: TRange) => Point;
    /** Check if a range is exactly equal to another. */
    equals: (range: TRange, another: TRange) => boolean;
    /** Check if a range includes a path, a point or part of another range. */
    includes: (range: TRange, target: Path | Point | TRange) => boolean;
    /** Get the intersection of a range with another. */
    intersection: (range: TRange, another: TRange) => TRange | null;
    /**
     * Check if a range is backward, meaning that its anchor point appears in the
     * document _after_ its focus point.
     */
    isBackward: (range: TRange) => boolean;
    /**
     * Check if a range is collapsed, meaning that both its anchor and focus
     * points refer to the exact same position in the document.
     */
    isCollapsed: (range?: TRange | null) => boolean;
    /**
     * Check if a range is expanded.
     *
     * This is the opposite of [[RangeApi.isCollapsed]] and is provided for
     * legibility.
     */
    isExpanded: (range?: TRange | null) => boolean;
    /**
     * Check if a range is forward.
     *
     * This is the opposite of [[RangeApi.isBackward]] and is provided for
     * legibility.
     */
    isForward: (range: TRange) => boolean;
    /** Check if a value implements the [[TRange]] interface. */
    isRange: (value: any) => value is TRange;
    /** Iterate through all of the point entries in a range. */
    points: (range: TRange) => Generator<PointEntry, void, undefined>;
    /** Get the start point of a range. */
    start: (range: TRange) => Point;
    /** Check if a range includes another range. */
    surrounds: (range: TRange, target: TRange) => boolean;
    /** Transform a range by an operation. */
    transform: (range: TRange, op: Operation, options?: RangeTransformOptions) => TRange | null;
};
/**
 * `Range` objects are a set of points that refer to a specific span of a Slate
 * document. They can define a span inside a single node or a can span across
 * multiple nodes.
 */
type Range$1 = TRange;
interface RangeEdgesOptions {
    reverse?: boolean;
}
interface RangeTransformOptions {
    affinity?: RangeDirection | null;
}

/**
 * `Operation` objects define the low-level instructions that Slate editors use
 * to apply changes to their internal state. Representing all changes as
 * operations is what allows Slate editors to easily implement history,
 * collaboration, and other features.
 */
type Operation<N extends Descendant = Descendant> = NodeOperation<N> | SelectionOperation | TextOperation;
/** Operation manipulation and check methods. */
declare const OperationApi: {
    /**
     * Invert an operation, returning a new operation that will exactly undo the
     * original when applied.
     */
    inverse: (op: Operation) => Operation;
    /** Check if a value is a `NodeOperation` object. */
    isNodeOperation: <N extends Descendant>(value: any) => value is NodeOperation<N>;
    /** Check if a value is an `Operation` object. */
    isOperation: <N extends Descendant>(value: any) => value is Operation<N>;
    /** Check if a value is a list of `Operation` objects. */
    isOperationList: (value: any) => value is Operation[];
    /** Check if a value is a `SelectionOperation` object. */
    isSelectionOperation: (value: any) => value is SelectionOperation;
    /** Check if a value is a `TextOperation` object. */
    isTextOperation: (value: any) => value is TextOperation;
};
type InsertNodeOperation<N extends Descendant = Descendant> = {
    [key: string]: unknown;
    node: N;
    path: Path;
    type: 'insert_node';
};
type InsertTextOperation = {
    [key: string]: unknown;
    offset: number;
    path: Path;
    text: string;
    type: 'insert_text';
};
type MergeNodeOperation<N extends Descendant = Descendant> = {
    [key: string]: unknown;
    path: Path;
    position: number;
    properties: Partial<NodeProps<N>>;
    type: 'merge_node';
};
type MoveNodeOperation = {
    [key: string]: unknown;
    newPath: Path;
    path: Path;
    type: 'move_node';
};
type NodeOperation<N extends Descendant = Descendant> = InsertNodeOperation<N> | MergeNodeOperation<N> | MoveNodeOperation | RemoveNodeOperation<N> | SetNodeOperation<N> | SplitNodeOperation<N>;
type RemoveNodeOperation<N extends Descendant = Descendant> = {
    [key: string]: unknown;
    node: N;
    path: Path;
    type: 'remove_node';
};
type RemoveTextOperation = {
    [key: string]: unknown;
    offset: number;
    path: Path;
    text: string;
    type: 'remove_text';
};
type SelectionOperation = SetSelectionOperation;
type SetNodeOperation<N1 extends Descendant = Descendant, N2 extends Descendant = Descendant> = {
    [key: string]: unknown;
    newProperties: Partial<NodeProps<N1>>;
    path: Path;
    properties: Partial<NodeProps<N2>>;
    type: 'set_node';
};
type SetSelectionOperation = {
    [key: string]: unknown;
    newProperties: null;
    properties: TRange;
    type: 'set_selection';
} | {
    [key: string]: unknown;
    newProperties: Partial<TRange>;
    properties: Partial<TRange>;
    type: 'set_selection';
} | {
    [key: string]: unknown;
    newProperties: TRange;
    properties: null;
    type: 'set_selection';
};
type SplitNodeOperation<N extends Descendant = Descendant> = {
    [key: string]: unknown;
    path: Path;
    position: number;
    properties: Partial<NodeProps<N>>;
    type: 'split_node';
};
type TextOperation = InsertTextOperation | RemoveTextOperation;

/**
 * `Path` arrays are a list of indexes that describe a node's exact position in
 * a Slate node tree. Although they are usually relative to the root `Editor`
 * object, they can be relative to any `Node` object.
 */
type Path = number[];
/** Path retrieval, check and transform methods. */
declare const PathApi: {
    /**
     * Get a list of ancestor paths for a given path.
     *
     * The paths are sorted from shallowest to deepest ancestor. However, if the
     * `reverse: true` option is passed, they are reversed.
     */
    ancestors: (path: Path, options?: PathAncestorsOptions) => Path[];
    /** Get a path to a child at the given index. */
    child: (path: Path, index: number) => Path;
    /** Get the common ancestor path of two paths. */
    common: (path: Path, another: Path) => Path;
    /**
     * Compare a path to another, returning an integer indicating whether the path
     * was before, at, or after the other.
     *
     * Note: Two paths of unequal length can still receive a `0` result if one is
     * directly above or below the other. If you want exact matching, use
     * [[PathApi.equals]] instead.
     */
    compare: (path: Path, another: Path) => -1 | 0 | 1;
    /** Check if a path ends after one of the indexes in another. */
    endsAfter: (path: Path, another: Path) => boolean;
    /** Check if a path ends at one of the indexes in another. */
    endsAt: (path: Path, another: Path) => boolean;
    /** Check if a path ends before one of the indexes in another. */
    endsBefore: (path: Path, another: Path) => boolean;
    /** Check if a path is exactly equal to another. */
    equals: (path: Path, another: Path) => boolean;
    /** Get a path to the first child of a path. */
    firstChild: (path: Path) => Path;
    /** Check if the path of previous sibling node exists */
    hasPrevious: (path: Path) => boolean;
    /** Check if a path is after another. */
    isAfter: (path: Path, another: Path) => boolean;
    /** Check if a path is an ancestor of another. */
    isAncestor: (path: Path, another: Path) => boolean;
    /** Check if a path is before another. */
    isBefore: (path: Path, another: Path) => boolean;
    /** Check if a path is a child of another. */
    isChild: (path: Path, another: Path) => boolean;
    /** Check if a path is equal to or an ancestor of another. */
    isCommon: (path: Path, another: Path) => boolean;
    /** Check if a path is a descendant of another. */
    isDescendant: (path: Path, another: Path) => boolean;
    /** Check if a path is the parent of another. */
    isParent: (path: Path, another: Path) => boolean;
    /** Check is a value implements the `Path` interface. */
    isPath: (value: any) => value is Path;
    /** Check if a path is a sibling of another. */
    isSibling: (path: Path, another: Path) => boolean;
    /** Get the last index of a path. Returns -1 if path is empty. */
    lastIndex: (path: Path) => number;
    /**
     * Get a list of paths at every level down to a path. Note: this is the same
     * as `PathApi.ancestors`, but including the path itself.
     *
     * The paths are sorted from shallowest to deepest. However, if the `reverse:
     * true` option is passed, they are reversed.
     */
    levels: (path: Path, options?: PathLevelsOptions) => Path[];
    /** Given a path, get the path to the next sibling node. */
    next: (path: Path) => Path;
    /**
     * Returns whether this operation can affect paths or not. Used as an
     * optimization when updating dirty paths during normalization
     *
     * NOTE: This _must_ be kept in sync with the implementation of 'transform'
     * below
     */
    operationCanTransformPath: <N extends Descendant>(operation: Operation<N>) => operation is InsertNodeOperation<N> | MergeNodeOperation<N> | MoveNodeOperation | RemoveNodeOperation<N> | SplitNodeOperation<N>;
    /** Given a path, return a new path referring to the parent node above it. */
    parent: (path: Path) => Path;
    /** Given a path, get the path to the previous sibling node. */
    previous: (path: Path) => Path | undefined;
    /** Get a path relative to an ancestor. */
    relative: (path: Path, ancestor: Path) => Path;
    /** Transform a path by an operation. */
    transform: (path: Path, operation: Operation, options?: PathTransformOptions) => Path | null;
};
interface PathAncestorsOptions {
    /** If true, the paths are returned in reverse order. */
    reverse?: boolean;
}
interface PathLevelsOptions {
    /** If true, the paths are returned in reverse order. */
    reverse?: boolean;
}
interface PathTransformOptions {
    /** The affinity of the transform. */
    affinity?: TextDirection | null;
}

type LeafPosition = {
    end: number;
    start: number;
    isFirst?: true;
    isLast?: true;
};
/**
 * `TText` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */
type TText = {
    text: string;
} & UnknownObject;
/** Text retrieval and check methods. */
declare const TextApi: {
    /** Get the leaves for a text node given decorations. */
    decorations: <N extends TText>(node: TText, decorations: DecoratedRange[]) => {
        leaf: N;
        position: LeafPosition;
    }[];
    /** Check if two text nodes are equal. */
    equals: (text: TText, another: TText, options?: TextEqualsOptions) => boolean;
    /** Check if a value implements the `Text` interface. */
    isText: <N extends TText>(value: any) => value is N;
    /** Check if a value is a list of `Text` objects. */
    isTextList: <N extends TText>(value: any) => value is N[];
    /** Check if some props are a partial of Text. */
    isTextProps: <N extends TText>(props: any) => props is Partial<N>;
    /**
     * Check if an text matches set of properties.
     *
     * Note: this is for matching custom properties, and it does not ensure that
     * the `text` property are two nodes equal.
     */
    matches: <N extends TText>(text: N, props: Partial<N>) => boolean;
};
/**
 * `Text` objects represent the nodes that contain the actual text content of a
 * Slate document along with any formatting properties. They are always leaf
 * nodes in the document tree as they cannot contain any children.
 */
type DecoratedRange = DecoratedRange$1;
/** A utility type to get all the mark types from a root node type. */
type MarkKeysOf<N extends TNode> = {} extends MarksOf<N> ? unknown : keyof MarksOf<N>;
type MarksIn<V extends Value> = MarksOf<V[number]>;
type MarksOf<N extends TNode> = Simplify<UnionToIntersection<NodeProps<TextOf<N>>>>;
type Text = TText;
interface TextEqualsOptions {
    /**
     * If true, the text is not compared. This is used to check whether sibling
     * text nodes can be merged.
     */
    loose?: boolean;
}
/** A utility type to get all the text node types from a root node type. */
type TextIn<V extends Value> = TextOf<V[number]>;
type TextOf<N extends TNode> = Editor extends N ? TText : TElement extends N ? TText : N extends Editor ? TextOf<N['children'][number]> : N extends TElement ? Extract<N['children'][number], TText> | TextOf<N['children'][number]> : N extends TText ? N : never;

/** Ancestor entry from a node. */
type AncestorEntry<N extends TNode = TNode> = NodeEntry<AncestorOf<N>>;
/** Ancestor entry from an editor. */
type AncestorEntryOf<E extends Editor> = AncestorEntry<E>;
/** Descendant entry from a node. */
type DescendantEntry<N extends TNode = TNode> = NodeEntry<DescendantOf<N>>;
/** Descendant entry of a value. */
type DescendantEntryIn<V extends Value> = NodeEntry<DescendantIn<V>>;
type DescendantEntryOf<E extends Editor> = NodeEntry<DescendantOf<E>>;
/**
 * `ElementEntry` objects refer to an `Element` and the `Path` where it can be
 * found inside a root node.
 */
type ElementEntry<N extends TNode = TNode> = NodeEntry<ElementOf<N>>;
/** Element entry of a value. */
type ElementEntryOf<E extends Editor> = NodeEntry<ElementOf<E>>;
/** Child node entry from a node. */
type NodeChildEntry<N extends TNode = TNode> = NodeEntry<ChildOf<N>>;
/**
 * `NodeEntry` objects are returned when iterating over the nodes in a Slate
 * document tree. They consist of the node and its `Path` relative to the root
 * node in the document.
 */
type NodeEntry<N extends TNode = TNode> = [N, Path];
/** Node entry from an editor. */
type NodeEntryIn<V extends Value> = NodeEntry<NodeIn<V>>;
type NodeEntryOf<E extends Editor> = NodeEntry<NodeOf<E>>;
/**
 * `TextEntry` objects refer to a `Text` and the `Path` where it can be found
 * inside an element node.
 */
type TextEntry<N extends TNode = TNode> = NodeEntry<TextOf<N>>;
/** Text node entry of a value. */
type TextEntryIn<V extends Value> = NodeEntry<TextIn<V>>;
type TextEntryOf<E extends Editor> = NodeEntry<TextOf<E>>;

/**
 * The `Ancestor` union type represents nodes that are ancestors in the tree. It
 * is returned as a convenience in certain cases to narrow a value further than
 * the more generic `Node` union.
 */
type Ancestor = Editor | TElement;
/**
 * The `Descendant` union type represents nodes that are descendants in the
 * tree. It is returned as a convenience in certain cases to narrow a value
 * further than the more generic `Node` union.
 */
type Descendant = TElement | TText;
/** Convenience type for returning the props of a node. */
type NodeProps<N extends TNode = TNode> = N extends Editor ? Omit<N, 'children'> : N extends TElement ? Omit<N, 'children'> : Omit<N, 'text'>;
/**
 * The `TNode` union type represents all of the different types of nodes that
 * occur in a Slate document tree.
 */
type TNode = Editor | TElement | TText;
declare const NodeApi: {
    /** Get the node at a specific path, asserting that it's an ancestor node. */
    ancestor: <N extends AncestorOf<R>, R extends TNode = TNode>(root: R, path: Path) => N | undefined;
    /**
     * Return a generator of all the ancestor nodes above a specific path.
     *
     * By default the order is bottom-up, from lowest to highest ancestor in the
     * tree, but you can pass the `reverse: true` option to go top-down.
     */
    ancestors: <N extends AncestorOf<R>, R extends TNode = TNode>(root: R, path: Path, options?: NodeAncestorsOptions) => Generator<NodeEntry<N>, void, undefined>;
    /** Get the child of a node at a specific index. */
    child: <N extends ChildOf<R, I>, R extends TNode = TNode, I extends number = number>(root: R, index: I) => N | undefined;
    /** Iterate over the children of a node at a specific path. */
    children: <N extends ChildOf<R>, R extends TNode = TNode>(root: R, path: Path, options?: NodeChildrenOptions) => Generator<NodeEntry<N>, void, undefined>;
    /** Get an entry for the common ancestor node of two paths. */
    common: <N extends NodeOf<R>, R extends TNode = TNode>(root: R, path: Path, another: Path) => NodeEntry<N> | undefined;
    /** Get the node at a specific path, asserting that it's a descendant node. */
    descendant: <N extends DescendantOf<R>, R extends TNode = TNode>(root: R, path: Path) => N | undefined;
    /** Return a generator of all the descendant node entries inside a root node. */
    descendants: <N extends DescendantOf<R>, R extends TNode = TNode>(root: R, options?: NodeDescendantsOptions<R>) => Generator<NodeEntry<N>, void, undefined>;
    /**
     * Return a generator of all the element nodes inside a root node. Each
     * iteration will return an `ElementEntry` tuple consisting of `[Element,
     * Path]`. If the root node is an element it will be included in the iteration
     * as well.
     */
    elements: <N extends ElementOf<R>, R extends TNode = TNode>(root: R, options?: NodeElementsOptions<R>) => Generator<NodeEntry<N>, void, undefined>;
    /** Extract props from a TNode. */
    extractProps: <N extends TNode>(node: N) => NodeProps<N>;
    /** Get the first node entry in a root node from a path. */
    first: <N extends NodeOf<R>, R extends TNode = TNode>(root: R, path: Path) => NodeEntry<N> | undefined;
    /** Get the first child node entry of a node. */
    firstChild: <N extends ChildOf<R, 0>, R extends TNode = TNode>(root: R, path: Path) => NodeEntry<N> | undefined;
    /** Get the first text node entry of a node. */
    firstText: <N extends TextOf<R>, R extends TNode = TNode>(root: R, options?: NodeTextsOptions<R>) => NodeEntry<N> | undefined;
    /** Get the sliced fragment represented by a range inside a root node. */
    fragment: <N extends ElementOf<R> | TextOf<R>, R extends TNode = TNode>(root: R, range: TRange) => N[];
    /**
     * Get the descendant node referred to by a specific path. If the path is an
     * empty array, it refers to the root node itself.
     */
    get: <N extends NodeOf<R>, R extends TNode = TNode>(root: R, path: Path) => N | undefined;
    /** Similar to get, but returns undefined if the node does not exist. */
    getIf: (root: TNode, path: Path) => TNode | undefined;
    /** Check if a descendant node exists at a specific path. */
    has: (root: TNode, path: Path) => boolean;
    /** Check if a node has a single child */
    hasSingleChild: (node: TNode) => boolean;
    /** Check if a value implements the 'Ancestor' interface */
    isAncestor: <N extends Ancestor>(value: any) => value is N;
    /** Check if a value implements the 'Descendant' interface. */
    isDescendant: <N extends Descendant>(value: any) => value is N;
    /** Check if a value implements the `Editor` interface. */
    isEditor: (value: any) => value is Editor;
    /** Check if a node is the last child of its parent. */
    isLastChild: (root: TNode, path: Path) => boolean;
    /** Check if a value implements the `TNode` interface. */
    isNode: <N extends TNode>(value: any) => value is N;
    /** Check if a value is a list of `Descendant` objects. */
    isNodeList: <N extends Descendant>(value: any) => value is N[];
    /** Get the last node entry in a root node from a path. */
    last: <N extends NodeOf<R>, R extends TNode = TNode>(root: R, path: Path) => NodeEntry<N> | undefined;
    /** Get the last child node entry of a node. */
    lastChild: <N extends ChildOf<R, -1>, R extends TNode = TNode>(root: R, path: Path) => NodeEntry<N> | undefined;
    /** Get the node at a specific path, ensuring it's a leaf text node. */
    leaf: <N extends TextOf<R>, R extends TNode = TNode>(root: R, path: Path) => N | undefined;
    /**
     * Return a generator of the in a branch of the tree, from a specific path.
     *
     * By default the order is top-down, from highest to lowest node in the tree,
     * but you can pass the `reverse: true` option to go bottom-up.
     */
    levels: <N extends NodeOf<R>, R extends TNode = TNode>(root: R, path: Path, options?: NodeLevelsOptions) => Generator<NodeEntry<N>, void, undefined>;
    /** Check if a node matches a set of props. */
    matches: (node: Descendant, props: Partial<Descendant>) => boolean;
    /**
     * Return a generator of all the node entries of a root node. Each entry is
     * returned as a `[TNode, Path]` tuple, with the path referring to the node's
     * position inside the root node.
     */
    nodes: <N extends NodeOf<R>, R extends TNode = TNode>(root: R, options?: NodeNodesOptions<R>) => Generator<NodeEntry<N>, void, undefined>;
    /** Get the parent of a node at a specific path. */
    parent: <N extends AncestorOf<R>, R extends TNode = TNode>(root: R, path: Path) => N | undefined;
    /**
     * Get the concatenated text string of a node's content.
     *
     * Note that this will not include spaces or line breaks between block nodes.
     * It is not a user-facing string, but a string for performing offset-related
     * computations for a node.
     */
    string: (node: TNode) => string;
    /** Return a generator of all leaf text nodes in a root node. */
    texts: <N extends TextOf<R>, R extends TNode = TNode>(root: R, options?: NodeTextsOptions<R>) => Generator<NodeEntry<N>, void, undefined>;
};
/** A utility type to get all the ancestor node types from a root node type. */
type AncestorIn<V extends Value> = AncestorOf<Editor | V[number]>;
type AncestorOf<N extends TNode> = Editor extends N ? Editor | TElement : TElement extends N ? TElement : N extends Editor ? ElementOf<N['children'][number]> | N | N['children'][number] : N extends TElement ? ElementOf<N> | N : never;
/** A utility type to get the child node types from a root node type. */
type ChildOf<N extends TNode, I extends number = number> = N extends Editor ? N['children'][I] : N extends TElement ? N['children'][I] : never;
/** A utility type to get all the descendant node types from a root node type. */
type DescendantIn<V extends Value> = DescendantOf<V[number]>;
type DescendantOf<N extends TNode> = N extends Editor ? ElementOf<N> | TextOf<N> : N extends TElement ? ElementOf<N['children'][number]> | TextOf<N> : never;
/**
 * The `Node` union type represents all of the different types of nodes that
 * occur in a Slate document tree.
 */
type Node$1 = TNode;
interface NodeAncestorsOptions {
    reverse?: boolean;
}
interface NodeChildrenOptions {
    /** Get children starting from this index (inclusive) */
    from?: number;
    reverse?: boolean;
    /** Get children up to this index (exclusive) */
    to?: number;
}
interface NodeDescendantsOptions<N extends TNode> {
    from?: Path;
    reverse?: boolean;
    to?: Path;
    pass?: (entry: NodeEntry<DescendantOf<N>>) => boolean;
}
interface NodeElementsOptions<N extends TNode> {
    from?: Path;
    reverse?: boolean;
    to?: Path;
    pass?: (entry: NodeEntry<ElementOf<N>>) => boolean;
}
/** A utility type to get all possible node types from a Value type */
type NodeIn<V extends Value> = NodeOf<Editor | V[number]>;
interface NodeLevelsOptions {
    reverse?: boolean;
}
interface NodeNodesOptions<N extends TNode> {
    from?: Path;
    reverse?: boolean;
    to?: Path;
    pass?: (entry: NodeEntry<NodeOf<N>>) => boolean;
}
/** A utility type to get all the node types from a root node type. */
type NodeOf<N extends TNode> = ElementOf<N> | N | TextOf<N>;
interface NodeTextsOptions<N extends TNode> {
    from?: Path;
    reverse?: boolean;
    to?: Path;
    pass?: (entry: NodeEntry<TextOf<N>>) => boolean;
}
/** A helper type for narrowing matched nodes with a predicate. */
type TNodeMatch<N extends TNode = TNode> = ((node: N, path: Path) => boolean) | ((node: N, path: Path) => node is N);

declare const toDOMNode: (editor: Editor, node: TNode) => HTMLElement | undefined;

declare const toDOMPoint: (editor: Editor, point: Point) => slate_dom.DOMPoint | undefined;

declare const toDOMRange: (editor: Editor, range: TRange) => Range | undefined;

declare const toSlateNode: (editor: Editor, domNode: DOMNode) => TNode | undefined;

declare const toSlatePoint: (editor: Editor, domPoint: DOMPoint, options: Omit<Parameters<typeof DOMEditor.toSlatePoint>[2], "suppressThrow">) => slate.BasePoint | null | undefined;

declare const toSlateRange: (editor: Editor, domRange: Parameters<typeof DOMEditor.toSlateRange>[1], options: Omit<Parameters<typeof DOMEditor.toSlateRange>[2], "supressThrow">) => slate.BaseRange | null | undefined;

declare const hasMark: (editor: Editor, key: string) => boolean;

/**
 * Check if a location (point/range) is at a specific position.
 *
 * For ranges:
 *
 * - If text=true, check if range is in single text node
 * - If block=true, check if range is in single block
 * - If blocks=true, check if range is across multiple blocks
 * - If start=true, check if range starts at block start
 * - If end=true, check if range ends at block end
 *
 * For points:
 *
 * - If word=true, check relative to word boundaries
 * - If start=true, check if at start
 * - If end=true, check if at end
 */
declare const isAt: <E extends Editor>(editor: E, { at, block, blocks, end, start, text, word, ...options }?: {
    /** The location to check. Defaults to current selection */
    at?: TLocation | null;
    /** Check if range is in single block */
    block?: boolean;
    /** Check if range is across multiple blocks */
    blocks?: boolean;
    /** Check if range ends at block end or point is at word end */
    end?: boolean;
    /** Check if range starts at block start */
    start?: boolean;
    /** Check if range is in single text node */
    text?: boolean;
    /** Check if point is at word boundary (only with end=true) */
    word?: boolean;
} & Omit<EditorAboveOptions<ValueOf<E>>, "at" | "block">) => boolean;

/** Check if a node at a location is a Text node */
declare const isText: (editor: Editor, at: At) => boolean;

type ScrollIntoViewOptions = StandardBehaviorOptions | boolean;

declare function scrollIntoView(editor: Editor, target: DOMRange | Point, options?: ScrollIntoViewOptions): void;

/**
 * Iterate through all of the nodes in the editor and break early for the first
 * truthy match. Otherwise returns false.
 */
declare const some: <E extends Editor = Editor>(editor: E, options: EditorNodesOptions<ValueOf<E>>) => boolean;

declare const createPathRef: (editor: Editor, at: Path, options?: EditorPathRefOptions$1) => slate.PathRef;

declare const createPointRef: (editor: Editor, point: Point, options?: EditorPointRefOptions$1) => slate.PointRef;

declare const createRangeRef: (editor: Editor, range: TRange, options?: EditorRangeRefOptions$1) => slate.RangeRef;

declare const path: (editor: Editor, at: At, options?: EditorPathOptions$1) => slate.Path | undefined;

declare const getEdgePoints: (editor: Editor, at: At) => [slate.BasePoint, slate.BasePoint] | undefined;

declare const getEditorString: (editor: Editor, at?: At | null, options?: EditorStringOptions) => string;

declare const getEndPoint: (editor: Editor, at: At, options?: EditorEndOptions) => slate.BasePoint | undefined;

declare const getPathRefs: (editor: Editor) => Set<slate.PathRef>;

declare const getPoint: (editor: Editor, at: At, options?: EditorPointOptions$1) => slate.BasePoint | undefined;

declare const getPointAfter: (editor: Editor, at: At, options?: EditorAfterOptions) => slate.BasePoint | undefined;

declare const getPointBefore: (editor: Editor, at: At, options?: EditorBeforeOptions) => Point | undefined;

declare const getPointRefs: (editor: Editor) => Set<slate.PointRef>;

declare const getPositions: (editor: Editor, options?: EditorPositionsOptions) => Generator<slate.BasePoint, void, undefined>;

declare const getRangeRefs: (editor: Editor) => Set<slate.RangeRef>;

declare const getStartPoint: (editor: Editor, at: At, options?: EditorStartOptions) => slate.BasePoint | undefined;

declare const hasBlocks: (editor: Editor, element: TElement) => boolean;

declare const hasInlines: (editor: Editor, element: TElement) => boolean;

declare const hasTexts: (editor: Editor, element: TElement) => boolean;

declare const isBlock: (editor: Editor, value: any) => value is TElement;

declare const isEdgePoint: (editor: Editor, point: Point, at: TLocation) => boolean;

declare const isEditorNormalizing: (editor: Editor) => boolean;

declare const isElementReadOnly: <E extends Editor = Editor>(editor: E, options?: EditorElementReadOnlyOptions) => slate.NodeEntry<slate.BaseElement> | undefined;

declare const isEmpty: <E extends Editor>(editor: E, target?: At | null, options?: EditorEmptyOptions) => boolean;

declare const isEndPoint: (editor: Editor, point: Point | null | undefined, at: TLocation) => boolean;

declare const isStartPoint: (editor: Editor, point: Point | null | undefined, at: TLocation) => boolean;

declare const range: (editor: Editor, at: At | "before" | "start", to?: At | null, options?: {
    before?: EditorBeforeOptions;
}) => TRange | undefined;

declare const unhangRange: (editor: Editor, range: TRange, options?: EditorUnhangRangeOptions) => TRange;

/**
 * The `withHistory` plugin keeps track of the operation history of a Slate
 * editor as operations are applied to it, using undo and redo stacks.
 */
declare const withHistory: <T extends Editor>(editor: T) => T;

declare const assignLegacyTransforms: (editor: Editor, transforms: any) => void;
declare const assignLegacyApi: (editor: Editor, api: any) => void;
/**
 * Assigns editor's legacy methods to editor.api and editor.tf.
 *
 * NOTE: can't use yet because of recursion issues
 */
declare const syncLegacyMethods: (editor: Editor) => void;

declare const deleteMerge: (editor: Editor, options?: {
    at?: TLocation;
    distance?: number;
    hanging?: boolean;
    reverse?: boolean;
    test?: any;
    unit?: "block" | "character" | "line" | "word";
    voids?: boolean;
}) => void;

declare const getAt: <T>(editor: Editor, at?: T | TNode | null) => T | undefined;

type Predicate<T extends TNode> = PredicateFn<T> | PredicateObj;
type PredicateFn<T extends TNode> = (obj: T, path: Path) => boolean;
type PredicateObj = Record<string, any[] | any>;
/**
 * Match the object with a predicate object or function. If predicate is:
 *
 * - Object: every predicate key/value should be in obj.
 * - Function: it should return true.
 */
declare const match: <T extends TNode>(obj: T, path: Path, predicate?: Predicate<T>) => boolean;
declare const getMatch: <E extends Editor>(editor: E, { id, block, empty, match: matchObjOrFn, text }?: any) => PredicateFn<NodeOf<E>> | undefined;
/**
 * Extended query options for slate queries:
 *
 * - `match` can be an object predicate where one of the values should include the
 *   node value. Example: { type: ['1', '2'] } will match the nodes having one
 *   of these 2 types.
 */
declare const getQueryOptions: (editor: Editor, { id, empty, match, text, ...options }?: any) => any;
declare const combineMatch: <T extends TNode>(match1: PredicateFn<T>, match2?: PredicateFn<T>) => PredicateFn<T>;
/** Combine two match predicates into one. */
declare const combineMatchOptions: <E extends Editor>(editor: E, match1?: PredicateFn<NodeOf<E>>, options?: any) => PredicateFn<NodeOf<E>>;

/** Filter nodes. */
interface QueryNodeOptions {
    /** List of types that are valid. If empty or undefined - allow all. */
    allow?: string[] | string | null;
    /** List of types that are invalid. */
    exclude?: string[] | string | null;
    /** Query the node entry. */
    filter?: <N extends TNode>(entry: NodeEntry<N>) => boolean;
    /** Valid path levels. */
    level?: number[] | number | null;
    /** Paths above that value are invalid. */
    maxLevel?: number | null;
}
/** Query the node entry. */
declare const queryNode: <N extends TNode>(entry?: NodeEntry<N>, { allow, exclude, filter, level, maxLevel }?: QueryNodeOptions) => boolean;

/** Query the editor state. */
interface QueryEditorOptions<E extends Editor = Editor> extends Pick<QueryNodeOptions, 'allow' | 'exclude'> {
    /** Location from where to lookup the node types (bottom-up) */
    at?: TLocation;
    /** Query the editor. */
    filter?: (editor: E) => boolean;
    /** When the selection is at the end of the block above. */
    selectionAtBlockEnd?: boolean;
    /** When the selection is at the start of the block above. */
    selectionAtBlockStart?: boolean;
}
/** Query the editor state. */
declare const queryEditor: <E extends Editor>(editor: E, { allow, at, exclude, filter, selectionAtBlockEnd, selectionAtBlockStart, }?: QueryEditorOptions<E>) => boolean;

/**
 * The `TLocation` interface is a union of the ways to refer to a specific
 * location in a Slate document: paths, points or ranges.
 *
 * Methods will often accept a `Location` instead of requiring only a `Path`,
 * `Point` or `TRange`. This eliminates the need for developers to manage
 * converting between the different interfaces in their own code base.
 */
type TLocation = Path | Point | TRange;
/** Location check methods. */
declare const LocationApi: {
    /** Check if a value implements the `At` interface. */
    isAt: (value: any) => value is At;
    /** Check if a value implements the `Location` interface. */
    isLocation: (value: any) => value is Location;
};
/**
 * The `Span` interface is a low-level way to refer to locations in nodes
 * without using `Point` which requires leaf text nodes to be present.
 */
type Span = [Path, Path];
declare const SpanApi: {
    /** Check if a value implements the `Span` interface. */
    isSpan: (value: any) => value is Span;
};
/**
 * The `Location` interface is a union of the ways to refer to a specific
 * location in a Slate document: paths, points or ranges.
 *
 * Methods will often accept a `Location` instead of requiring only a `Path`,
 * `Point` or `Range`. This eliminates the need for developers to manage
 * converting between the different interfaces in their own code base.
 */
type Location = Path | Point | Range$1;

type EditorAboveOptions<V extends Value = Value> = QueryOptions<V> & QueryMode & QueryVoids;
type EditorAfterOptions = {
    distance?: number;
} & QueryTextUnit & QueryVoids;
type EditorApi<V extends Value = Value> = {
    /** Get the fragment at a location or selection. */
    fragment: <N extends ElementOrTextIn<V>>(at?: At | null, options?: EditorFragmentOptions) => N[];
    /** Get the dirty paths of the editor. */
    getDirtyPaths: <N extends DescendantIn<V>>(operation: Operation<N>) => Path[];
    /**
     * Returns the fragment at the current selection. Used when cutting or
     * copying, as an example, to get the fragment at the current selection.
     */
    getFragment: (at?: At) => ElementOrTextIn<V>[];
    /** Check if a value is a read-only `Element` object. */
    isElementReadOnly: <N extends ElementIn<V>>(element: N) => boolean;
    /** Check if a path is selected by the current selection. */
    isSelected: (target: Path | TRange, options?: EditorIsSelectedOptions) => boolean;
    /** Check if a value is a void `Element` object. */
    isVoid: <N extends ElementIn<V>>(element: N) => boolean;
    /** Check if a value is a markable `Element` object. */
    markableVoid: <N extends ElementIn<V>>(element: N) => boolean;
    /**
     * Manually set if the editor should currently be normalizing. Note: Using
     * this incorrectly can leave the editor in an invalid state.
     */
    setNormalizing: (isNormalizing: boolean) => void;
    /**
     * Call a function, Determine whether or not remove the previous node when
     * merge.
     */
    shouldMergeNodesRemovePrevNode: (prevNodeEntry: NodeEntry, curNodeEntry: NodeEntry) => boolean;
    /** Override this method to prevent normalizing the editor. */
    shouldNormalize: (options: {
        dirtyPaths: Path[];
        initialDirtyPathsLength: number;
        iteration: number;
        operation?: Operation;
    }) => boolean;
    /**
     * Override this method to prevent normalizing a specific node. Defaults to
     * returning `true`.
     */
    shouldNormalizeNode: (entry: NodeEntry) => boolean;
    /** Called when there is a change in the editor. */
    onChange: (options?: {
        operation?: Operation;
    }) => void;
} & {
    /**
     * Get the point after a location.
     *
     * If there is no point after the location (e.g. we are at the bottom of the
     * document) returns `undefined`.
     */
    after: OmitFirst<typeof getPointAfter>;
    /**
     * Returns the point before a location with optional matching criteria.
     *
     * If there is no point before the location (e.g. we are at the top of the
     * document) returns `undefined`.
     */
    before: OmitFirst<typeof getPointBefore>;
    /** Get the start and end points of a location. */
    edges: OmitFirst<typeof getEdgePoints>;
    /** Check if an element is read-only. */
    elementReadOnly: OmitFirst<typeof isElementReadOnly>;
    /** Get the end point of a location. */
    end: OmitFirst<typeof getEndPoint>;
    /** Check if a node has block children. */
    hasBlocks: OmitFirst<typeof hasBlocks>;
    /** Check if a node has inline and text children. */
    hasInlines: OmitFirst<typeof hasInlines>;
    /** Check if mark is active at selection */
    hasMark: OmitFirst<typeof hasMark>;
    /** Check if a node has text children. */
    hasTexts: OmitFirst<typeof hasTexts>;
    /** Check if a value is a block `Element` object. */
    isBlock: OmitFirst<typeof isBlock>;
    /** Check if a point is an edge of a location. */
    isEdge: OmitFirst<typeof isEdgePoint>;
    /**
     * Check if an element is empty, accounting for void nodes.
     *
     * @example
     *   ```ts
     *   editor.api.isEmpty() // Check if editor is empty
     *   editor.api.isEmpty(at) // Check if nodes at location are empty
     *   editor.api.isEmpty(at, { after: true }) // Check if text after location is empty
     *   editor.api.isEmpty(at, { block: true }) // Check if block above location is empty
     *   ```;
     */
    isEmpty: OmitFirst<typeof isEmpty>;
    /** Check if a point is the end point of a location. */
    isEnd: OmitFirst<typeof isEndPoint>;
    /** Check if the editor is currently normalizing after each operation. */
    isNormalizing: OmitFirst<typeof isEditorNormalizing>;
    /** Check if a point is the start point of a location. */
    isStart: OmitFirst<typeof isStartPoint>;
    /** Get the path of a location. */
    path: OmitFirst<typeof path>;
    /**
     * Create a mutable ref for a `Path` object, which will stay in sync as new
     * operations are applied to the editor.
     */
    pathRef: OmitFirst<typeof createPathRef>;
    /** Get the set of currently tracked path refs of the editor. */
    pathRefs: OmitFirst<typeof getPathRefs>;
    /** Get the `start` or `end` (default is `start`) point of a location. */
    point: OmitFirst<typeof getPoint>;
    /**
     * Create a mutable ref for a `Point` object, which will stay in sync as new
     * operations are applied to the editor.
     */
    pointRef: OmitFirst<typeof createPointRef>;
    /** Get the set of currently tracked point refs of the editor. */
    pointRefs: OmitFirst<typeof getPointRefs>;
    /**
     * Iterate through all of the positions in the document where a `Point` can be
     * placed. The first `Point` returns is always the starting point followed by
     * the next `Point` as determined by the `unit` option. Note: By default void
     * nodes are treated as a single point and iteration will not happen inside
     * their content unless the voids option is set, then iteration will occur.
     */
    positions: OmitFirst<typeof getPositions>;
    /**
     * Get a range from a location to another location.
     *
     * @example
     *   ```ts
     *   editor.api.range(at, to) // From a location to another location
     *   editor.api.range('start', at) // From block start to a location
     *   editor.api.range('before', at, { before }) // From the point before a location
     *   ```;
     */
    range: OmitFirst<typeof range>;
    /**
     * Create a mutable ref for a `TRange` object, which will stay in sync as new
     * operations are applied to the editor.
     */
    rangeRef: OmitFirst<typeof createRangeRef>;
    /** Get the set of currently tracked range refs of the editor. */
    rangeRefs: OmitFirst<typeof getRangeRefs>;
    /** Get the start point of a location. */
    start: OmitFirst<typeof getStartPoint>;
    /**
     * Get the text string content of a location.
     *
     * Note: by default the text of void nodes is considered to be an empty
     * string, regardless of content, unless you pass in true for the voids
     * option.
     *
     * @example
     *   ```ts
     *   editor.api.string() // Get selection string
     *   editor.api.string([]) // Get whole editor string
     *   editor.api.string(at) // Get string at location
     *   ```;
     */
    string: OmitFirst<typeof getEditorString>;
    /**
     * Convert a range into a non-hanging one.
     *
     * A "hanging" range is one created by the browser's "triple-click" selection
     * behavior. When triple-clicking a block, the browser selects from the start
     * of that block to the start of the _next_ block. The range thus "hangs over"
     * into the next block. If `unhangRange` is given such a range, it moves the
     * end backwards until it's in a non-empty text node that precedes the hanging
     * block.
     *
     * Note that `unhangRange` is designed for the specific purpose of fixing
     * triple-clicked blocks, and therefore currently has a number of caveats:
     *
     * - It does not modify the start of the range; only the end. For example, it
     *   does not "unhang" a selection that starts at the end of a previous
     *   block.
     * - It only does anything if the start block is fully selected. For example, it
     *   does not handle ranges created by double-clicking the end of a paragraph
     *   (which browsers treat by selecting from the end of that paragraph to the
     *   start of the next).
     */
    unhangRange: OmitFirst<typeof unhangRange>;
    /** Get the matching ancestor above a location in the document. */
    above: <N extends AncestorIn<V>>(options?: EditorAboveOptions<V>) => NodeEntry<N> | undefined;
    /** Get the first node at a location. */
    first: <N extends DescendantIn<V>>(at: At) => NodeEntry<N> | undefined;
    /** Get the fragment at a location. */
    fragment: <N extends ElementOrTextIn<V>>(at: At) => N[] | undefined;
    /** Check if a path exists in the editor. */
    hasPath: (path: Path) => boolean;
    /** Get the last node at a location. */
    last: <N extends DescendantIn<V>>(at: At, options?: EditorLastOptions) => NodeEntry<N> | undefined;
    /** Get the leaf text node at a location. */
    leaf: <N extends TextIn<V>>(at: At, options?: EditorLeafOptions) => NodeEntry<N> | undefined;
    /** Iterate through all of the levels at a location. */
    levels: <N extends NodeIn<V>>(options?: EditorLevelsOptions<V>) => Generator<NodeEntry<N>, void, undefined>;
    /** Get the marks that would be added to text at the current selection. */
    marks: () => MarksIn<V> | null;
    /**
     * Get the matching node in the branch of the document after a location.
     *
     * Note: To find the next Point, and not the next Node, use the `Editor.after`
     * method
     */
    next: <N extends DescendantIn<V>>(options?: EditorNextOptions<V>) => NodeEntry<N> | undefined;
    /**
     * Get the node at a location or find the first node that matches options.
     *
     * @example
     *   ```ts
     *   editor.api.node([0]) // Get node at path [0]
     *   editor.api.node({ at: [], id: '1' }) // Find first node with id '1'
     *   editor.api.node({ at: path, block: true }) // Find first block at path
     *   ```;
     */
    node: <N extends DescendantIn<V>>(atOrOptions: AtOrDescendant | EditorNodesOptions<V>, nodeOptions?: EditorNodeOptions) => NodeEntry<N> | undefined;
    /**
     * At any given `Location` or `Span` in the editor provided by `at` (default
     * is the current selection), the method returns a Generator of `NodeEntry`
     * objects that represent the nodes that include `at`. At the top of the
     * hierarchy is the `Editor` object itself.
     */
    nodes: <N extends DescendantIn<V>>(options?: EditorNodesOptions<V>) => Generator<NodeEntry<N>, void, undefined>;
    /** Get the parent node of a location. */
    parent: <N extends AncestorIn<V>>(at: At, options?: EditorParentOptions) => NodeEntry<N> | undefined;
    /**
     * Get the matching node in the branch of the document before a location.
     *
     * Note: To find the previous Point, and not the previous Node, use the
     * `Editor.before` method
     */
    previous: <N extends DescendantIn<V>>(options?: EditorPreviousOptions<V>) => NodeEntry<N> | undefined;
    /** Match a void node in the current branch of the editor. */
    void: <N extends ElementIn<V>>(options?: EditorVoidOptions) => NodeEntry<N> | undefined;
} & {
    findDocumentOrShadowRoot: OmitFirst<typeof findDocumentOrShadowRoot>;
    /** Get the target range from a DOM `event` */
    findEventRange: OmitFirst<typeof findEventRange>;
    /**
     * Find a key for a Slate node. Returns an instance of `Key` which looks like
     * `{ id: string }`
     */
    findKey: OmitFirst<typeof findKey>;
    getWindow: OmitFirst<typeof getWindow>;
    /** Check if a DOM node is within the editor */
    hasDOMNode: OmitFirst<typeof hasDOMNode>;
    hasRange: OmitFirst<typeof hasRange>;
    /** Check if the user is currently composing inside the editor */
    isComposing: OmitFirst<typeof isComposing>;
    /** Check if the editor is focused */
    isFocused: OmitFirst<typeof isFocused>;
    /** Check if the editor is in read-only mode */
    isReadOnly: OmitFirst<typeof isReadOnly>;
    /** Check if the target is inside a non-readonly void element. */
    isTargetInsideNonReadonlyVoid: OmitFirst<typeof isTargetInsideNonReadonlyVoid>;
    /** Find the native DOM element from a Slate node */
    toDOMNode: OmitFirst<typeof toDOMNode>;
    /** Find a native DOM selection point from a Slate point */
    toDOMPoint: OmitFirst<typeof toDOMPoint>;
    /** Find a native DOM range from a Slate `range` */
    toDOMRange: OmitFirst<typeof toDOMRange>;
    /** Find a Slate point from a DOM selection's `domNode` and `domOffset`. */
    toSlatePoint: OmitFirst<typeof toSlatePoint>;
    /** Find a Slate range from a DOM range or selection. */
    toSlateRange: OmitFirst<typeof toSlateRange>;
    /**
     * Find the path of Slate node. If DOM node is not found, it will use
     * `findNodePath` (traversal method).
     */
    findPath: (node: TNode, options?: EditorFindPathOptions) => Path | undefined;
    hasEditableTarget: (target: EventTarget | null) => target is Node;
    hasSelectableTarget: (target: EventTarget | null) => target is Node;
    hasTarget: (target: EventTarget | null) => target is Node;
    /** Find a Slate node from a native DOM `element` */
    toSlateNode: <N extends NodeIn<V>>(domNode: Parameters<typeof toSlateNode>[1]) => N | undefined;
} & {
    /** Get the merge flag's current value. */
    isMerging: OmitFirst<typeof HistoryApi.isMerging>;
    /** Get the saving flag's current value. */
    isSaving: OmitFirst<typeof HistoryApi.isSaving>;
    isSplittingOnce: OmitFirst<typeof HistoryApi.isSplittingOnce>;
} & {
    create: {
        /** Default block factory. */
        block: (node?: Partial<TElement>, path?: Path) => TElement;
        /** Default value factory. */
        value: () => Value;
    };
    /**
     * Check if a location (point/range) is at a specific position.
     *
     * @example
     *   ```ts
     *   // For ranges:
     *   editor.api.isAt({ text: true }) // Check if range is in single text node
     *   editor.api.isAt({ block: true }) // Check if range is in single block
     *   editor.api.isAt({ blocks: true }) // Check if range is across multiple blocks
     *   editor.api.isAt({ start: true }) // Check if range starts at block start
     *   editor.api.isAt({ end: true }) // Check if range ends at block end
     *
     *   // For points:
     *   editor.api.isAt({ word: true }) // Check relative to word boundaries
     *   editor.api.isAt({ start: true }) // Check if at start
     *   editor.api.isAt({ end: true }) // Check if at end
     *   ```;
     */
    isAt: OmitFirst<typeof isAt>;
    /** Check if a node at a location is a Text node */
    isText: OmitFirst<typeof isText>;
    /**
     * Scroll the editor to bring a target point into view.
     *
     * @param target - The point to scroll into view
     * @param options - Scroll options
     */
    scrollIntoView: OmitFirst<typeof scrollIntoView>;
    /**
     * Check if any node at a location (default: selection) matches the given
     * criteria
     */
    some: OmitFirst<typeof some>;
    /**
     * Get the block at a location or find the first block that matches options.
     * If `above` is true, get the block above the location, similar to
     * `editor.api.above({ block: true })`. If `highest` is true, get the highest
     * block at the location.
     *
     * @example
     *   ```ts
     *   editor.api.block() // Get block above selection
     *   editor.api.block({ above: true }) // Get block above selection
     *   editor.api.block({ at: [0, 0] }) // Get block at [0, 0]
     *   editor.api.block({ at: [0, 0], above: true }) // Get block at [0]
     *   editor.api.block({ highest: true }) // Get highest block at selection
     *   ```;
     */
    block: <N extends ElementIn<V>>(options?: EditorBlockOptions<V>) => NodeEntry<N> | undefined;
    /** Returns all matching blocks. */
    blocks: <N extends ElementIn<V>>(options?: EditorNodesOptions<V>) => NodeEntry<N>[];
    /** Returns the first matching descendant. */
    descendant: <N extends DescendantIn<V>>(options: EditorNodesOptions<V>) => NodeEntry<N> | undefined;
    /** Returns the edge blocks above a location (default: selection). */
    edgeBlocks: <N1 extends ElementIn<V>, N2 extends ElementIn<V> = N1>(options?: EditorAboveOptions<V>) => [NodeEntry<N1>, NodeEntry<N2>] | null;
    /** Check if the selection is collapsed */
    isCollapsed: () => boolean;
    /** Check if selection is at editor end */
    isEditorEnd: () => boolean;
    /** Check if the selection is expanded */
    isExpanded: () => boolean;
    /** Check if a value is an inline `Element` object. */
    isInline: <N extends DescendantIn<V>>(element: N) => boolean;
    /** Check if a value is a selectable `Element` object. */
    isSelectable: <N extends ElementIn<V>>(element: N) => boolean;
    /** Returns the selection mark value by key. */
    mark: <K extends keyof MarksIn<V>>(key: K) => MarksIn<V>[K] | null | undefined;
    /** Returns the range spanning the given node entries. */
    nodesRange: (nodes: NodeEntry[]) => TRange | undefined;
    /**
     * Get a property value from a list of nodes. Returns undefined if the
     * property value is not consistent across all nodes.
     */
    prop: (options: EditorPropOptions<V>) => string | undefined;
};
type EditorBeforeOptions = {
    distance?: number;
} & QueryTextUnit & QueryVoids & {
    /**
     * If true, get the point after the matching point. If false, get the
     * matching point.
     */
    afterMatch?: boolean;
    /** Return block start point if no match found */
    matchBlockStart?: boolean;
    /**
     * If true, `matchString` will be interpreted as regex expression(s).
     * Otherwise, it will be compared by string equality.
     *
     * @default false
     */
    matchByRegex?: boolean;
    /** Lookup before the location for `matchString`. */
    matchString?: string[] | string;
    /**
     * If true, lookup until the start of the editor value. If false, lookup
     * until the first invalid character.
     */
    skipInvalid?: boolean;
    /** Lookup before the location until this predicate is true */
    match?: (value: {
        at: At;
        beforePoint: Point;
        beforeString: string;
    }) => boolean;
};
type EditorBlockOptions<V extends Value = Value> = Omit<EditorNodesOptions<V>, 'block' | 'mode'> & {
    /**
     * If true, get the block above the location. This has no effect when `at` is
     * not a block path.
     */
    above?: boolean;
    /**
     * If true, get the highest block at the location. This will return the block
     * at the root level (path length 1).
     */
    highest?: boolean;
};
type EditorElementReadOnlyOptions = {
    at?: TLocation;
} & QueryMode & QueryVoids;
type EditorEmptyOptions = {
    /** Check if text after selection is empty */
    after?: boolean;
    /** Check if block above location is empty */
    block?: boolean;
} & Omit<EditorNodesOptions, 'at' | 'block'>;
type EditorEndOptions = {
    /** Get the end point of the previous node */
    previous?: boolean;
};
type EditorFindPathOptions = Omit<EditorNodesOptions<Value>, 'at' | 'block' | 'match'>;
type EditorFragmentDeletionOptions = {
    direction?: TextDirection;
};
type EditorFragmentOptions = {
    /** Types of structural nodes to unwrap */
    structuralTypes?: string[];
};
type EditorIsSelectedOptions = {
    /** Check if selection contains the entire path range */
    contains?: boolean;
};
type EditorLastOptions = {
    /** Get last node at this level (0-based). */
    level?: number;
};
type EditorLeafOptions = {
    depth?: number;
    edge?: LeafEdge;
};
type EditorLevelsOptions<V extends Value = Value> = {
    reverse?: boolean;
} & QueryOptions<V> & QueryVoids;
type EditorNextOptions<V extends Value = Value> = QueryOptions<V> & QueryVoids & {
    /**
     * Determines where to start traversing from:
     *
     * - `'after'` (default): Start from the point after the current location
     * - `'child'`: Start from the first child of the current path. `at` must be a
     *   path.
     */
    from?: 'after' | 'child';
    /**
     * - `'all'` (default if `from` is `child`): Return all matching nodes.
     * - `'highest'`: in a hierarchy of nodes, only return the highest level
     *   matching nodes
     * - `'lowest'` (default if `from` is `after`): in a hierarchy of nodes, only
     *   return the lowest level matching nodes
     */
    mode?: 'all' | 'highest' | 'lowest';
};
type EditorNodeOptions = {
    depth?: number;
    edge?: LeafEdge;
};
type EditorNodesOptions<V extends Value = Value> = {
    /** Where to start at. @default editor.selection */
    at?: At | Span;
    ignoreNonSelectable?: boolean;
    reverse?: boolean;
    universal?: boolean;
} & Omit<QueryOptions<V>, 'at'> & QueryMode & QueryVoids;
type EditorNormalizeOptions = {
    force?: boolean;
    operation?: Operation;
};
type EditorParentOptions = {
    depth?: number;
    edge?: LeafEdge;
};
type EditorPathOptions = {
    depth?: number;
    edge?: LeafEdge;
};
type EditorPathRefOptions = {
    affinity?: TextDirection | null;
};
type EditorPointOptions = {
    edge?: LeafEdge;
};
type EditorPointRefOptions = {
    affinity?: TextDirection | null;
};
type EditorPositionsOptions = {
    ignoreNonSelectable?: boolean;
    /**
     * When `true` returns the positions in reverse order. In the case of the
     * `unit` being `word`, the actual returned positions are different (i.e. we
     * will get the start of a word in reverse instead of the end).
     */
    reverse?: boolean;
} & QueryAt & QueryVoids & QueryTextUnit;
type EditorPreviousOptions<V extends Value = Value> = QueryOptions<V> & QueryVoids & {
    /**
     * Determines where to start traversing from:
     *
     * - `'before'` (default): Start from the point before the current location
     * - `'parent'`: Start from the parent of the current location
     */
    from?: 'before' | 'parent';
    /**
     * - `'all'`: Return all matching nodes
     * - `'highest'`: in a hierarchy of nodes, only return the highest level
     *   matching nodes
     * - `'lowest'` (default): in a hierarchy of nodes, only return the lowest
     *   level matching nodes
     */
    mode?: 'all' | 'highest' | 'lowest';
    /** Get the previous sibling node */
    sibling?: boolean;
};
type EditorPropOptions<V extends Value = Value> = {
    /** Nodes to get the property value from. */
    nodes: TElement[];
    /** Property key to get. */
    key?: string;
    /** Default value to return if property is not found. */
    defaultValue?: string;
    /**
     * - `'all'`: Get the property value from all nodes.
     * - `'block'`: Get the property value from the first block node.
     * - `'text'`: Get the property value from the first text node.
     */
    mode?: 'all' | 'block' | 'text';
    /** Function to get the property value from a node. */
    getProp?: (node: DescendantIn<V>) => any;
};
type EditorRangeOptions = {
    /** Get range from before to the end point of `at` */
    before?: EditorBeforeOptions | boolean;
    /**
     * Get range from the start of the block above a location (default: selection)
     * to the location
     */
    blockStart?: boolean;
};
type EditorRangeRefOptions = {
    affinity?: RangeDirection | null;
};
type EditorStartOptions = {
    /** Get the start point of the next node */
    next?: boolean;
};
type EditorStringOptions = QueryVoids;
type EditorUnhangRangeOptions = {
    /**
     * When true, unhang a range of length 1 so both edges are in the same text
     * node. This is useful for handling ranges created by character-level
     * operations.
     */
    character?: boolean;
    /** @default true */
    unhang?: boolean;
    /** Allow placing the end of the selection in a void node */
    voids?: boolean;
};
type EditorVoidOptions = QueryAt & QueryMode & QueryVoids;
type QueryAt = {
    /** Where to start at. @default editor.selection */
    at?: At;
};
type QueryMode = {
    /**
     * - `'all'` (default): Return all matching nodes
     * - `'highest'`: in a hierarchy of nodes, only return the highest level
     *   matching nodes
     * - `'lowest'`: in a hierarchy of nodes, only return the lowest level matching
     *   nodes
     */
    mode?: 'all' | 'highest' | 'lowest';
};
type QueryOptions<V extends Value = Value> = {
    /** Match the node by id. `true` will match all nodes with an id. */
    id?: boolean | string;
    /** Match block nodes. */
    block?: boolean;
    /** When true, match only empty nodes. When false, match only non-empty nodes */
    empty?: boolean;
    /** Match the node. */
    match?: Predicate<NodeIn<V>>;
    /** When true, match only text nodes */
    text?: boolean;
} & QueryAt;
type QueryTextUnit = {
    /**
     * - `offset`: Moves to the next offset `Point`. It will include the `Point` at
     *   the end of a `Text` object and then move onto the first `Point` (at the
     *   0th offset) of the next `Text` object. This may be counter-intuitive
     *   because the end of a `Text` and the beginning of the next `Text` might be
     *   thought of as the same position.
     * - `character`: Moves to the next `character` but is not always the next
     *   `index` in the string. This is because Unicode encodings may require
     *   multiple bytes to create one character. Unlike `offset`, `character` will
     *   not count the end of a `Text` and the beginning of the next `Text` as
     *   separate positions to return. Warning: The character offsets for Unicode
     *   characters does not appear to be reliable in some cases like a Smiley
     *   Emoji will be identified as 2 characters.
     * - `word`: Moves to the position immediately after the next `word`. In
     *   `reverse` mode, moves to the position immediately before the previous
     *   `word`.
     * - `line` | `block`: Starts at the beginning position and then the position at
     *   the end of the block. Then starts at the beginning of the next block and
     *   then the end of the next block.
     */
    unit?: TextUnitAdjustment;
};
type QueryVoids = {
    /** When `true` include void Nodes. */
    voids?: boolean;
};

declare const blur: (editor: Editor) => void;

declare const deselectDOM: (editor: Editor) => void;

declare const focus: (editor: Editor, { at, edge, retries }?: FocusOptions) => void;

declare const addMark: (editor: Editor, key: string, value: any) => void;

declare const deleteBackward: (editor: Editor, unit?: TextUnit) => void;

declare const deleteForward: (editor: Editor, unit?: TextUnit) => void;

declare const deleteFragment: (editor: Editor, options?: EditorFragmentDeletionOptions$1) => void;

declare const insertBreak: (editor: Editor) => void;

declare const withoutNormalizing: (editor: Editor, fn: () => boolean | void) => boolean;

declare const addMarks: (editor: Editor, marks: EditorMarks, { remove }?: AddMarksOptions) => void;

declare const duplicateNodes: (editor: Editor, { block, nodes, ...options }?: DuplicateNodesOptions) => void;

declare const removeMarks: (editor: Editor, keys?: string[] | string | null, { at, shouldChange, ...options }?: RemoveMarksOptions) => void;

declare const reset: (editor: Editor, options?: ResetOptions) => void;

declare const toggleBlock: (editor: Editor, type: string, { defaultType: defaultTypeProp, someOptions, wrap, ...options }?: ToggleBlockOptions) => void;

/** Add or remove mark in the selection. */
declare const toggleMark: (editor: Editor, key: string, { remove }?: ToggleMarkOptions) => void;

declare const collapseSelection: (editor: Editor, options?: SelectionCollapseOptions) => void;

declare const deleteText: <E extends Editor>(editor: E, options?: DeleteTextOptions) => void;

declare const moveSelection: (editor: Editor, options?: SelectionMoveOptions) => void;

declare const select: (editor: Editor, target?: At, options?: SelectOptions) => void;

declare const setPoint: (editor: Editor, props: Partial<Point>, options?: SelectionSetPointOptions) => void;

declare const setSelection: (editor: Editor, props: Partial<TRange>) => void;

type AddMarksOptions = {
    /** Marks to remove before adding new ones */
    remove?: string[] | string;
};
type DeleteTextOptions = {
    distance?: number;
    hanging?: boolean;
    reverse?: boolean;
    unit?: TextUnit;
} & QueryAt & QueryVoids & QueryTextUnit;
type DuplicateNodesOptions<V extends Value = Value> = {
    /** Location to get nodes from and insert after. Default: selection */
    at?: At;
    /** If true, duplicate blocks above location. Ignored if `nodes` is provided */
    block?: boolean;
    /** Specific nodes to duplicate. If provided, ignores `block` option */
    nodes?: NodeEntry[];
} & Omit<InsertNodesOptions<V>, 'at' | 'block'>;
type EditorTransforms<V extends Value = Value> = {
    /**
     * Add a custom property to the leaf text nodes in the current selection.
     *
     * If the selection is currently collapsed, the marks will be added to the
     * `editor.marks` property instead, and applied when text is inserted next.
     */
    addMark: OmitFirst<typeof addMark>;
    /**
     * Add multiple marks to the leaf text nodes in the current selection. If
     * marks with the same keys exist, they will be removed first.
     *
     * @example
     *   ```ts
     *   editor.tf.addMarks({ bold: true, italic: true })
     *   editor.tf.addMarks({ bold: subscript }, { remove: 'superscript' })
     *   editor.tf.addMarks({ bold: true }, { remove: ['italic', 'underline'] })
     *   ```;
     */
    addMarks: OmitFirst<typeof addMarks>;
    /** Delete content in the editor backward from the current selection. */
    deleteBackward: OmitFirst<typeof deleteBackward>;
    /** Delete content in the editor forward from the current selection. */
    deleteForward: OmitFirst<typeof deleteForward>;
    /** Delete the content of the current selection. */
    deleteFragment: OmitFirst<typeof deleteFragment>;
    /**
     * Duplicate nodes at a location. By default duplicates nodes at the current
     * selection. When `block: true`, duplicates the blocks above the location.
     */
    duplicateNodes: OmitFirst<typeof duplicateNodes>;
    /** Insert a block break at the current selection. */
    insertBreak: OmitFirst<typeof insertBreak>;
    /**
     * Remove marks from text nodes.
     *
     * - If `keys` is provided: removes specific mark(s) from text nodes
     * - If `at` is provided: removes from range
     * - If `at` is not provided and selection is expanded: removes marks only if
     *   `keys` is provided
     * - If `at` is not provided and selection is collapsed: removes from
     *   `editor.marks`
     *
     *   - If `keys` is provided: removes specific mark(s)
     *   - If `keys` is not provided: removes all marks
     *
     * If the selection is currently collapsed, the removal will be stored on
     * `editor.marks` and applied to the text inserted next.
     *
     * @example
     *   ```ts
     *   editor.tf.removeMarks() // Remove all marks from editor.marks
     *   editor.tf.removeMarks('bold') // Remove bold mark at selection
     *   editor.tf.removeMarks(['bold', 'italic']) // Remove multiple marks at selection
     *   editor.tf.removeMarks('bold', { at: range }) // Remove bold in range
     *   ```;
     */
    removeMarks: OmitFirst<typeof removeMarks>;
    /**
     * Reset the editor state. Use `children: true` to only reset children without
     * clearing history and operations
     */
    reset: OmitFirst<typeof reset>;
    /**
     * Toggle a block type. If wrap is true, wrap/unwrap the block in the
     * specified type. Otherwise, sets the block type directly.
     *
     * @example
     *   ```ts
     *   editor.tf.toggleBlock('blockquote') // Toggle blockquote
     *   editor.tf.toggleBlock('list', { wrap: true }) // Toggle list wrapper
     *   ```;
     */
    toggleBlock: OmitFirst<typeof toggleBlock>;
    /**
     * Toggle a mark on the leaf text nodes in the current selection. If the mark
     * exists, it will be removed. Otherwise, it will be added.
     *
     * When adding a mark, you can specify marks to remove first using the
     * `remove` option. This is useful for mutually exclusive marks like
     * subscript/superscript.
     *
     * @example
     *   ```ts
     *   editor.tf.toggleMark('bold') // Toggle bold mark
     *   editor.tf.toggleMark('subscript', { remove: 'superscript' }) // Add subscript, remove superscript
     *   ```;
     */
    toggleMark: OmitFirst<typeof toggleMark>;
    /**
     * Call a function, deferring normalization until after it completes
     *
     * @returns True if normalized.
     */
    withoutNormalizing: OmitFirst<typeof withoutNormalizing>;
    /**
     * Insert of fragment of nodes at the specified location or (if not defined)
     * the current selection or (if not defined) the end of the document.
     */
    insertFragment: <N extends ElementOrTextIn<V>>(fragment: N[], options?: InsertFragmentOptions) => void;
    /**
     * Atomically insert `node` at the specified location or (if not defined) the
     * current selection or (if not defined) the end of the document.
     */
    insertNode: <N extends DescendantIn<V>>(node: N, options?: InsertNodesOptions<V>) => void;
    /**
     * Atomically inserts `nodes` at the specified location or (if not defined)
     * the current selection or (if not defined) the end of the document.
     */
    insertNodes: <N extends ElementOrTextIn<V>>(nodes: N | N[], options?: InsertNodesOptions<V>) => void;
    /**
     * Insert a soft break at the current selection. If the selection is currently
     * expanded, delete it first.
     */
    insertSoftBreak: () => void;
    /**
     * Lift nodes at the specified location upwards in the document tree. If
     * necessary, the parent node is split. If no location is specified, use the
     * selection.
     */
    liftNodes: (options?: LiftNodesOptions<V>) => void;
    /**
     * Merge a node at the specified location with the previous node at the same
     * depth. If no location is specified, use the selection. Resulting empty
     * container nodes are removed.
     */
    mergeNodes: (options?: MergeNodesOptions<V>) => void;
    /**
     * Move the nodes from an origin to a destination. A destination must be
     * specified in the `options`. If no origin is specified, move the selection.
     */
    moveNodes: (options: MoveNodesOptions<V>) => void;
    /** Normalize any dirty objects in the editor. */
    normalize: (options?: EditorNormalizeOptions) => void;
    /** Redo to the next saved state. */
    redo: () => void;
    /**
     * Remove a custom property from all of the leaf text nodes within non-void
     * nodes or void nodes that `editor.api.markableVoid()` allows in the current
     * selection.
     *
     * If the selection is currently collapsed, the removal will be stored on
     * `editor.marks` and applied to the text inserted next.
     */
    removeMark: (key: string) => void;
    /**
     * Remove nodes at the specified location in the document. If no location is
     * specified, remove the nodes in the selection.
     */
    removeNodes: (options?: RemoveNodesOptions<V>) => void;
    /**
     * Replace nodes at a location with new nodes.
     *
     * @example
     *   ```ts
     *   editor.tf.replaceNodes(node, { at }) // Replace node at location
     *   editor.tf.replaceNodes(node, { at, select: true }) // Replace node then select
     *   editor.tf.replaceNodes(node, { at, children: true }) // Replace children at location
     *   ```;
     */
    replaceNodes: <N extends ElementOrTextIn<V>>(nodes: N | N[], options?: ReplaceNodesOptions<V>) => void;
    /**
     * Set properties of nodes at the specified location. If no location is
     * specified, use the selection.
     *
     * If `props` contains `undefined` values, the node's corresponding property
     * will also be set to `undefined` as opposed to ignored.
     */
    setNodes: <N extends DescendantIn<V>>(props: Partial<NodeProps<N>>, options?: SetNodesOptions<V>) => void;
    /**
     * Split nodes at the specified location. If no location is specified, split
     * the selection.
     */
    splitNodes: (options?: SplitNodesOptions<V>) => void;
    /** Undo to the previous saved state. */
    undo: () => void;
    /**
     * Unset properties of nodes at the specified location. If no location is
     * specified, use the selection.
     */
    unsetNodes: <N extends DescendantIn<V>>(props: (keyof NodeProps<N>)[] | keyof NodeProps<N>, options?: UnsetNodesOptions<V>) => void;
    /**
     * Unwrap nodes at the specified location. If necessary, the parent node is
     * split. If no location is specified, use the selection.
     */
    unwrapNodes: (options?: UnwrapNodesOptions<V>) => void;
    /**
     * Wrap nodes at the specified location in the `element` container. If no
     * location is specified, wrap the selection.
     */
    wrapNodes: <N extends ElementIn<V>>(element: N, options?: WrapNodesOptions<V>) => void;
    /**
     * Push a batch of operations as either `undos` or `redos` onto `editor.undos`
     * or `editor.redos`
     */
    writeHistory: (stack: 'redos' | 'undos', batch: any) => void;
} /** Text Transforms */ & {
    /** Delete text in the document. */
    delete: OmitFirst<typeof deleteText>;
    /**
     * Insert a string of text at the specified location or (if not defined) the
     * current selection or (if not defined) the end of the document.
     */
    insertText: (text: string, options?: InsertTextOptions) => void;
} /** Selection Transforms */ & {
    /** Collapse the selection to a single point. */
    collapse: OmitFirst<typeof collapseSelection>;
    /** Move the selection's point forward or backward. */
    move: OmitFirst<typeof moveSelection>;
    /**
     * Set the selection to a new value specified by `at`. When a selection
     * already exists, this method is just a proxy for `setSelection` and will
     * update the existing value.
     *
     * @example
     *   ```ts
     *   editor.tf.select(at) // Select at location
     *   editor.tf.select(at, { edge: 'end' }) // Select end of block above
     *   editor.tf.select(at, { edge: 'start' }) // Select start of block above
     *   ```;
     */
    select: OmitFirst<typeof select>;
    /** Set new properties on one of the selection's points. */
    setPoint: OmitFirst<typeof setPoint>;
    /**
     * Set new properties on an active selection. Since the value is a
     * `Partial<TRange>`, this method can only handle updates to an existing
     * selection. If there is no active selection the operation will be void. Use
     * `select` if you'd like to create a selection when there is none.
     */
    setSelection: OmitFirst<typeof setSelection>;
    /** Unset the selection. */
    deselect: () => void;
} & {
    /** Blur the editor */
    blur: OmitFirst<typeof blur>;
    /** Deselect the editor. */
    deselectDOM: OmitFirst<typeof deselectDOM>;
    /**
     * Focus the editor.
     *
     * - If `at` is defined: select the location and focus
     * - If `edge` is defined: select the location (default: editor) edge ('start' |
     *   'end') and focus
     *
     * @example
     *   ```ts
     *   editor.tf.focus() // focus editor
     *   editor.tf.focus({ edge: 'end' }) // end of selection if selection exists
     *   editor.tf.focus({ edge: 'end' }) // end of editor if selection is null
     *   ```;
     */
    focus: OmitFirst<typeof focus>;
    /**
     * Insert data from a `DataTransfer` into the editor. This is a proxy method
     * to call in this order `insertFragmentData(editor: Editor, data:
     * DataTransfer)` and then `insertTextData(editor: Editor, data:
     * DataTransfer)`.
     */
    insertData: DOMEditor['insertData'];
    /**
     * Insert fragment data from a `DataTransfer` into the editor. Returns true if
     * some content has been effectively inserted.
     */
    insertFragmentData: DOMEditor['insertFragmentData'];
    /**
     * Insert text data from a `DataTransfer` into the editor. Returns true if
     * some content has been effectively inserted.
     */
    insertTextData: DOMEditor['insertTextData'];
    /** Sets data from the currently selected fragment on a `DataTransfer`. */
    setFragmentData: DOMEditor['setFragmentData'];
} & {
    setSplittingOnce: OmitFirst<typeof HistoryApi.setSplittingOnce>;
    /**
     * Apply a series of changes inside a synchronous `fn`, These operations will
     * be merged into the previous history.
     */
    withMerging: OmitFirst<typeof HistoryApi.withMerging>;
    /**
     * Apply a series of changes inside a synchronous `fn`, ensuring that the
     * first operation starts a new batch in the history. Subsequent operations
     * will be merged as usual.
     */
    withNewBatch: OmitFirst<typeof HistoryApi.withNewBatch>;
    /**
     * Apply a series of changes inside a synchronous `fn`, without merging any of
     * the new operations into previous save point in the history.
     */
    withoutMerging: OmitFirst<typeof HistoryApi.withoutMerging>;
    /**
     * Apply a series of changes inside a synchronous `fn`, without saving any of
     * their operations into the history.
     */
    withoutSaving: OmitFirst<typeof HistoryApi.withoutSaving>;
} & {
    /** Apply an operation in the editor. */
    apply: <N extends DescendantIn<V>>(operation: Operation<N>) => void;
    /** Normalize a Node according to the schema. */
    normalizeNode: <N extends NodeIn<V>>(entry: NodeEntry<N>, options?: {
        operation?: Operation;
    }) => void;
};
type FocusOptions = {
    /** Target location to select before focusing */
    at?: At;
    /** Focus at location or editor edge. Default location is at or selection. */
    edge?: 'end' | 'endEditor' | 'start' | 'startEditor';
    /** Number of times to retry focusing */
    retries?: number;
};
type InsertFragmentOptions = {
    batchDirty?: boolean;
    hanging?: boolean;
} & QueryAt & QueryVoids;
type InsertNodesOptions<V extends Value = Value> = {
    batchDirty?: boolean;
    hanging?: boolean;
    /**
     * Insert the nodes after the currect block. Does not apply if the removeEmpty
     * option caused the current block to be removed.
     */
    nextBlock?: boolean;
    /**
     * Remove the currect block if empty before inserting. Only applies to
     * paragraphs by default, but can be customized by passing a QueryNodeOptions
     * object.
     */
    removeEmpty?: QueryNodeOptions | boolean;
    /** If true, select the inserted nodes. */
    select?: boolean;
} & QueryOptions<V> & QueryMode & QueryVoids;
type InsertTextOptions = {
    /** @default true */
    marks?: boolean;
} & QueryAt & QueryVoids;
type LiftNodesOptions<V extends Value = Value> = QueryOptions<V> & QueryMode & QueryVoids;
type MergeNodesOptions<V extends Value, E extends Editor = Editor> = {
    hanging?: boolean;
    /**
     * Default: if the node isn't already the next sibling of the previous node,
     * move it so that it is before merging.
     */
    mergeNode?: (editor: E, options: {
        at: Path;
        to: Path;
    }) => void;
    /**
     * Default: if there was going to be an empty ancestor of the node that was
     * merged, we remove it from the tree.
     */
    removeEmptyAncestor?: (editor: E, options: {
        at: Path;
    }) => void;
} & QueryOptions<V> & QueryMode & QueryVoids;
type MoveNodesOptions<V extends Value = Value> = {
    to: Path;
    /** Move only children of the node at location */
    children?: boolean;
    /** Start index of the children to move. Default: 0 */
    fromIndex?: number;
} & QueryOptions<V> & QueryMode & QueryVoids;
type RemoveMarksOptions = {
    /** Range where the mark(s) will be removed. Default: selection */
    at?: TRange;
    /** When true, trigger onChange if collapsed selection */
    shouldChange?: boolean;
} & Omit<UnsetNodesOptions, 'match' | 'split'>;
type RemoveNodesOptions<V extends Value = Value> = {
    /** When true, remove all children of the node at the specified location */
    children?: boolean;
    hanging?: boolean;
    /** When true, remove the previous empty block if it exists */
    previousEmptyBlock?: boolean;
} & QueryOptions<V> & QueryMode & QueryVoids;
type ReplaceNodesOptions<V extends Value = Value> = {
    /** When true, replace all children of the node at the specified location */
    children?: boolean;
    /** Options for removing nodes */
    removeNodes?: Omit<RemoveNodesOptions<V>, 'at'>;
} & InsertNodesOptions<V>;
type ResetOptions = {
    /** When true, only reset children without clearing history and operations */
    children?: boolean;
} & Omit<ReplaceNodesOptions, 'at' | 'children'>;
type SelectOptions = {
    /** Select edge of the block above location */
    edge?: 'end' | 'start';
    /** If true, focus the editor before selecting */
    focus?: boolean;
    /** Select start of next sibling */
    next?: boolean;
    /** Select end of previous sibling */
    previous?: boolean;
};
type SetNodesOptions<V extends Value = Value> = {
    compare?: PropsCompare;
    hanging?: boolean;
    /**
     * When true, only apply to text nodes in non-void nodes or markable void
     * nodes
     */
    marks?: boolean;
    merge?: PropsMerge;
    split?: boolean;
} & QueryOptions<V> & QueryMode & QueryVoids;
type SplitNodesOptions<V extends Value = Value> = {
    always?: boolean;
    height?: number;
} & QueryOptions<V> & QueryMode & QueryVoids;
type ToggleBlockOptions = {
    /** The default block type to revert to when untoggling. Defaults to paragraph. */
    defaultType?: string;
    someOptions?: EditorNodesOptions;
    /**
     * If true, toggles wrapping the block with the specified type. Otherwise,
     * toggles the block type directly.
     */
    wrap?: boolean;
} & SetNodesOptions;
type ToggleMarkOptions = {
    /** Mark keys to remove when adding the mark. */
    remove?: string[] | string;
};
type UnsetNodesOptions<V extends Value = Value> = {
    hanging?: boolean;
    split?: boolean;
} & QueryOptions<V> & QueryMode & QueryVoids;
type UnwrapNodesOptions<V extends Value = Value> = {
    hanging?: boolean;
    split?: boolean;
} & QueryOptions<V> & QueryMode & QueryVoids;
type WrapNodesOptions<V extends Value = Value> = {
    /**
     * When true, wrap node children into a single element:
     *
     * - Wraps the first child node into the element
     * - Move the other child nodes next to the element children
     */
    children?: boolean;
    hanging?: boolean;
    /**
     * Indicates that it's okay to split a node in order to wrap the location. For
     * example, if `ipsum` was selected in a `Text` node with `lorem ipsum dolar`,
     * `split: true` would wrap the word `ipsum` only, resulting in splitting the
     * `Text` node. If `split: false`, the entire `Text` node `lorem ipsum dolar`
     * would be wrapped.
     */
    split?: boolean;
} & QueryOptions<V> & QueryMode & QueryVoids;
type PropsCompare = (prop: Partial<Descendant>, node: Partial<Descendant>) => boolean;
type PropsMerge = (prop: Partial<Descendant>, node: Partial<Descendant>) => object;

type LegacyEditorApi<V extends Value = Value> = Pick<EditorApi<V>, 'getDirtyPaths' | 'getFragment' | 'isElementReadOnly' | 'isInline' | 'isSelectable' | 'isVoid' | 'markableVoid' | 'onChange' | 'setNormalizing' | 'shouldMergeNodesRemovePrevNode' | 'shouldNormalize'>;
type LegacyEditorMethods<V extends Value = Value> = LegacyEditorApi<V> & LegacyEditorTransforms<V>;
type LegacyEditorTransforms<V extends Value = Value> = {
    /** Delete content in the editor backward from the current selection. */
    deleteBackward: OmitFirst<typeof deleteBackward$1>;
    /** Delete content in the editor forward from the current selection. */
    deleteForward: OmitFirst<typeof deleteForward$1>;
} & Pick<EditorTransforms<V>, 'addMark' | 'apply' | 'delete' | 'deleteFragment' | 'insertBreak' | 'insertFragment' | 'insertNode' | 'insertNodes' | 'insertSoftBreak' | 'insertText' | 'normalizeNode' | 'removeMark'> & Pick<EditorTransforms<V>, 'insertData' | 'insertFragmentData' | 'insertTextData' | 'setFragmentData'> & Pick<EditorTransforms<V>, 'writeHistory'>;

/**
 * `TElement` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 */
type TElement = {
    children: Descendant[];
    type: string;
} & UnknownObject;
/** Element retrieval and check methods. */
declare const ElementApi: {
    /** Check if a value implements the 'Ancestor' interface. */
    isAncestor: <T extends Ancestor>(value: any) => value is T;
    /** Check if a value implements the `TElement` interface. */
    isElement: <T extends TElement>(value: any) => value is T;
    /** Check if a value is an array of `TElement` objects. */
    isElementList: <T extends TElement>(value: any) => value is T[];
    /** Check if a set of props is a partial of TElement. */
    isElementProps: <T extends TElement>(props: any) => props is Partial<T>;
    /**
     * Check if a value implements the `TElement` interface and has elementKey
     * with selected value. Default it check to `type` key value
     */
    isElementType: <T extends TElement>(value: any, elementVal: string, elementKey?: string) => value is T;
    /**
     * Check if an element matches set of properties.
     *
     * Note: this checks custom properties, and it does not ensure that any
     * children are equivalent.
     */
    matches: (element: TElement, props: Partial<TElement>) => boolean;
};
/**
 * `Element` objects are a type of node in a Slate document that contain other
 * element nodes or text nodes. They can be either "blocks" or "inlines"
 * depending on the Slate editor's configuration.
 */
type Element = TElement;
/** A utility type to get all the element nodes type from a root node. */
type ElementIn<V extends Value> = ElementOf<V[number]>;
type ElementOf<N extends TNode> = Editor extends N ? TElement : TElement extends N ? TElement : N extends Editor ? ElementOf<N['children'][number]> | Extract<N['children'][number], TElement> : N extends TElement ? ElementOf<N['children'][number]> | Extract<N['children'][number], TElement> | N : never;
/**
 * `ElementEntry` objects refer to an `Element` and the `Path` where it can be
 * found inside a root node.
 */
/** Element or text of an editor. */
type ElementOrTextIn<V extends Value> = ElementIn<V> | TextIn<V>;
type ElementOrTextOf<E extends Editor> = ElementOf<E> | TextOf<E>;

/**
 * `PathRef` objects keep a specific path in a document synced over time as new
 * operations are applied to the editor. You can access their `current` property
 * at any time for the up-to-date path value.
 */
type PathRef = {
    affinity: 'backward' | 'forward' | null;
    current: Path | null;
    unref: () => Path | null;
};
declare const PathRefApi: {
    /** Transform the path ref's current value by an operation. */
    transform: (ref: PathRef, op: Operation) => void;
};
/**
 * `PointRef` objects keep a specific point in a document synced over time as
 * new operations are applied to the editor. You can access their `current`
 * property at any time for the up-to-date point value.
 */
type PointRef = {
    affinity: TextDirection | null;
    current: Point | null;
    unref: () => Point | null;
};
declare const PointRefApi: {
    /** Transform the point ref's current value by an operation. */
    transform: (ref: PointRef, op: Operation) => void;
};
/**
 * `RangeRef` objects keep a specific range in a document synced over time as
 * new operations are applied to the editor. You can access their `current`
 * property at any time for the up-to-date range value.
 */
type RangeRef = {
    affinity: 'backward' | 'forward' | 'inward' | 'outward' | null;
    current: TRange | null;
    unref: () => TRange | null;
};
declare const RangeRefApi: {
    /** Transform the range ref's current value by an operation. */
    transform: (ref: RangeRef, op: Operation) => void;
};

/** `HistoryApi` contains helpers for history-enabled editors. */
declare const HistoryApi: {
    /** Check if a value is a `History` object. */
    isHistory(value: any): value is History;
    /** Get the merge flag's current value. */
    isMerging(editor: Editor): boolean | undefined;
    /** Get the splitting once flag's current value. */
    isSaving(editor: Editor): boolean | undefined;
    isSplittingOnce(editor: Editor): boolean | undefined;
    /** Get the saving flag's current value. */
    redo(editor: Editor): void;
    /** Redo to the previous saved state. */
    setSplittingOnce(editor: Editor, value: boolean | undefined): void;
    /** Undo to the previous saved state. */
    undo(editor: Editor): void;
    /**
     * Apply a series of changes inside a synchronous `fn`, These operations will
     * be merged into the previous history.
     */
    withMerging(editor: Editor, fn: () => void): void;
    /**
     * Apply a series of changes inside a synchronous `fn`, ensuring that the
     * first operation starts a new batch in the history. Subsequent operations
     * will be merged as usual.
     */
    withNewBatch(editor: Editor, fn: () => void): void;
    /**
     * Apply a series of changes inside a synchronous `fn`, without merging any of
     * the new operations into previous save point in the history.
     */
    withoutMerging(editor: Editor, fn: () => void): void;
    /**
     * Apply a series of changes inside a synchronous `fn`, without saving any of
     * their operations into the history.
     */
    withoutSaving(editor: Editor, fn: () => void): void;
};
interface History {
    /** Redos of the editor. */
    redos: Batch[];
    /** Undos of the editor. */
    undos: Batch[];
}
/**
 * `History` objects hold all of the operations that are applied to a value, so
 * they can be undone or redone as necessary.
 */
interface Batch {
    operations: Operation[];
    selectionBefore: TRange | null;
}

type Editor<V extends Value = Value> = EditorBase<V> & {
    api: EditorApi<V>;
    tf: EditorTransforms<V>;
    transforms: EditorTransforms<V>;
};
type EditorBase<V extends Value = Value> = {
    /** Unique identifier for the editor. */
    id: string;
    /** Value of the editor. */
    children: V;
    /** Contains the undos and redos of the editor. */
    history: History;
    /** Marks that are currently applied to the editor. */
    marks: EditorMarks | null;
    /** Operations that have been applied to the editor. */
    operations: Operation<DescendantIn<V>>[];
    /** The current selection of the editor. */
    selection: EditorSelection;
} & EditorMethods<V> & UnknownObject;
type EditorMarks = Record<string, any>;
type EditorMethods<V extends Value = Value> = Pick<EditorTransforms<V>, 'redo' | 'undo'>;
type EditorSelection = TRange | null;
type Value = TElement[];
/** A helper type for getting the value of an editor. */
type ValueOf<E extends Editor> = E['children'];

declare const createEditor: <V extends Value>({ children, selection, }?: {
    children?: V;
    selection?: Editor["selection"];
}) => Editor<V>;

export { type AddMarksOptions, type Ancestor, type AncestorEntry, type AncestorEntryOf, type AncestorIn, type AncestorOf, type At, type AtOrDescendant, type ChildOf, type DecoratedRange, type DeleteTextOptions, type Descendant, type DescendantEntry, type DescendantEntryIn, type DescendantEntryOf, type DescendantIn, type DescendantOf, type DuplicateNodesOptions, type Editor, type EditorAboveOptions, type EditorAfterOptions, type EditorApi, type EditorBase, type EditorBeforeOptions, type EditorBlockOptions, type EditorElementReadOnlyOptions, type EditorEmptyOptions, type EditorEndOptions, type EditorFindPathOptions, type EditorFragmentDeletionOptions, type EditorFragmentOptions, type EditorIsSelectedOptions, type EditorLastOptions, type EditorLeafOptions, type EditorLevelsOptions, type EditorMarks, type EditorMethods, type EditorNextOptions, type EditorNodeOptions, type EditorNodesOptions, type EditorNormalizeOptions, type EditorParentOptions, type EditorPathOptions, type EditorPathRefOptions, type EditorPointOptions, type EditorPointRefOptions, type EditorPositionsOptions, type EditorPreviousOptions, type EditorPropOptions, type EditorRangeOptions, type EditorRangeRefOptions, type EditorSelection, type EditorStartOptions, type EditorStringOptions, type EditorTransforms, type EditorUnhangRangeOptions, type EditorVoidOptions, type Element, ElementApi, type ElementEntry, type ElementEntryOf, type ElementIn, type ElementOf, type ElementOrTextIn, type ElementOrTextOf, type FocusOptions, type History, HistoryApi, type InsertFragmentOptions, type InsertNodeOperation, type InsertNodesOptions, type InsertTextOperation, type InsertTextOptions, type LeafEdge, type LeafPosition, type LegacyEditorApi, type LegacyEditorMethods, type LegacyEditorTransforms, type LiftNodesOptions, type Location, LocationApi, type MarkKeysOf, type MarksIn, type MarksOf, type MaximizeMode, type MergeNodeOperation, type MergeNodesOptions, type MoveNodeOperation, type MoveNodesOptions, type MoveUnit, type Node$1 as Node, type NodeAncestorsOptions, NodeApi, type NodeChildEntry, type NodeChildrenOptions, type NodeDescendantsOptions, type NodeElementsOptions, type NodeEntry, type NodeEntryIn, type NodeEntryOf, type NodeIn, type NodeLevelsOptions, type NodeNodesOptions, type NodeOf, type NodeOperation, type NodeProps, type NodeTextsOptions, type Operation, OperationApi, type Path, type PathAncestorsOptions, PathApi, type PathLevelsOptions, type PathRef, PathRefApi, type PathTransformOptions, type Point, PointApi, type PointEntry, type PointRef, PointRefApi, type PointTransformOptions, type Predicate, type QueryAt, type QueryEditorOptions, type QueryMode, type QueryNodeOptions, type QueryOptions, type QueryTextUnit, type QueryVoids, type Range$1 as Range, RangeApi, type RangeDirection, type RangeEdgesOptions, type RangeMode, type RangeRef, RangeRefApi, type RangeTransformOptions, type RemoveMarksOptions, type RemoveNodeOperation, type RemoveNodesOptions, type RemoveTextOperation, type ReplaceNodesOptions, type ResetOptions, type ScrollIntoViewOptions, type SelectOptions, type SelectionEdge, type SelectionMode, type SelectionOperation, type SetNodeOperation, type SetNodesOptions, type SetSelectionOperation, type Span, SpanApi, type SplitNodeOperation, type SplitNodesOptions, type TElement, type TLocation, type TNode, type TNodeMatch, type TRange, type TSelection, type TSpan, type TText, type Text, TextApi, type TextDirection, type TextEntry, type TextEntryIn, type TextEntryOf, type TextEqualsOptions, type TextIn, type TextOf, type TextOperation, type TextUnit, type TextUnitAdjustment, type ToggleBlockOptions, type ToggleMarkOptions, type UnsetNodesOptions, type UnwrapNodesOptions, type Value, type ValueOf, type WrapNodesOptions, assignLegacyApi, assignLegacyTransforms, combineMatch, combineMatchOptions, createEditor, deleteMerge, getAt, getMatch, getQueryOptions, match, queryEditor, queryNode, syncLegacyMethods, withHistory };
