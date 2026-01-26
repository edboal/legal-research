import { S as SlateEditor, a as SlatePlugin, P as PluginConfig, b as SlatePluginMethods, A as AnyPluginConfig, W as WithRequiredKey, c as SlatePluginContext, I as InferConfig, R as RenderElementProps, d as AnyEditorPlugin, N as NodeComponents, e as RenderLeafProps, f as RenderTextProps, E as EditableProps, g as SlateRenderNodeProps, h as ExtendEditor, O as OverrideEditor, H as HtmlDeserializer, L as LengthConfig, i as EditorPlugin, j as AnySlatePlugin, k as ParserOptions } from './withSlate-QBgDQMgy.js';
export { ao as AUTO_SCROLL, ap as AutoScrollOperationsMap, p as BaseDeserializer, B as BaseEditor, q as BaseHtmlDeserializer, r as BaseInjectProps, s as BasePlugin, t as BasePluginContext, u as BasePluginNode, v as BaseSerializer, x as BaseTransformOptions, m as BaseWithSlateOptions, ax as BoxStaticProps, ag as CorePlugin, C as CreateSlateEditorOptions, as as DOMPlugin, aj as DebugConfig, ak as DebugErrorType, an as DebugPlugin, V as Decorate, X as Deserializer, aq as DomConfig, y as ExtendConfig, Y as ExtendEditorApi, Z as ExtendEditorTransforms, ah as GetCorePluginsOptions, G as GetInjectNodePropsOptions, z as GetInjectNodePropsReturnType, U as HandlerReturnType, _ as HtmlSerializer, D as InferApi, F as InferOptions, l as InferPlugins, J as InferSelectors, K as InferTransforms, av as InitOptions, $ as InjectNodeProps, a0 as LeafStaticProps, al as LogLevel, M as NodeComponent, a1 as NodeStaticProps, a2 as NodeStaticWrapperComponent, a3 as NodeStaticWrapperComponentProps, a4 as NodeStaticWrapperComponentReturnType, a5 as NormalizeInitialValue, a6 as Parser, a7 as PartialEditorPlugin, am as PlateError, aB as RenderElementFn, aC as RenderLeafFn, a8 as RenderStaticNodeWrapper, a9 as RenderStaticNodeWrapperFunction, aa as RenderStaticNodeWrapperProps, aD as RenderTextFn, ar as ScrollMode, ab as Serializer, aw as SlateExtensionPlugin, ac as SlatePluginConfig, ad as SlatePlugins, ay as SlateRenderElementProps, az as SlateRenderLeafProps, aA as SlateRenderTextProps, T as TSlateEditor, ae as TextStaticProps, af as TransformOptions, Q as WithAnyKey, at as WithAutoScrollOptions, n as WithSlateOptions, o as createSlateEditor, ai as getCorePlugins, au as withScrolling, w as withSlate } from './withSlate-QBgDQMgy.js';
export { nanoid } from 'nanoid';
export { TStateApi as ZustandStoreApi, createZustandStore } from 'zustand-x';
import { Modify, UnknownObject, AnyObject, Nullable } from '@udecode/utils';
import * as _udecode_slate from '@udecode/slate';
import { Value, DecoratedRange, TElement, TText, Path, NodeEntry, TRange, Descendant, TNode, NodeOf, QueryNodeOptions, Editor } from '@udecode/slate';
import React__default from 'react';
import { KeyboardEventLike } from 'is-hotkey';
export { isHotkey } from 'is-hotkey';
import 'mutative';

type SlatePluginConfig<K extends string = any, O = {}, A = {}, T = {}, S = {}> = Omit<Partial<Modify<SlatePlugin<PluginConfig<K, O, A, T, S>>, {
    node?: Partial<SlatePlugin<PluginConfig<K, O, A, T, S>>['node']>;
}>>, keyof SlatePluginMethods | 'optionsStore'>;
type TSlatePluginConfig<C extends AnyPluginConfig = PluginConfig> = Omit<Partial<Modify<SlatePlugin<C>, {
    node?: Partial<SlatePlugin<C>['node']>;
}>>, keyof SlatePluginMethods | 'optionsStore'>;
/**
 * Creates a new Plate plugin with the given configuration.
 *
 * @remarks
 *   - The plugin's key is required and specified by the K generic.
 *   - The `__extensions` array stores functions to be applied when `resolvePlugin`
 *       is called with an editor.
 *   - The `extend` method adds new extensions to be applied later.
 *   - The `extendPlugin` method extends an existing plugin (including nested
 *       plugins) or adds a new one if not found.
 *
 * @example
 *   const myPlugin = createSlatePlugin<
 *     'myPlugin',
 *     MyOptions,
 *     MyApi,
 *     MyTransforms
 *   >({
 *     key: 'myPlugin',
 *     options: { someOption: true },
 *     transforms: { someTransform: () => {} },
 *   });
 *
 *   const extendedPlugin = myPlugin.extend({
 *     options: { anotherOption: false },
 *   });
 *
 *   const pluginWithNestedExtension = extendedPlugin.extendPlugin(
 *     nestedPlugin,
 *     { options: { nestedOption: true } }
 *   );
 *
 * @template K - The literal type of the plugin key.
 * @template O - The type of the plugin options.
 * @template A - The type of the plugin utilities.
 * @template T - The type of the plugin transforms.
 * @template S - The type of the plugin storage.
 * @param {Partial<SlatePlugin<K, O, A, T, S>>} config - The configuration
 *   object for the plugin.
 * @returns {SlatePlugin<K, O, A, T, S>} A new Plate plugin instance with the
 *   following properties and methods:
 *
 *   - All properties from the input config, merged with default values.
 *   - `configure`: A method to create a new plugin instance with updated options.
 *   - `extend`: A method to create a new plugin instance with additional
 *       configuration.
 *   - `extendPlugin`: A method to extend an existing plugin (including nested
 *       plugins) or add a new one if not found.
 */
declare function createSlatePlugin<K extends string = any, O = {}, A = {}, T = {}, S = {}>(config?: ((editor: SlateEditor) => SlatePluginConfig<K, O, A, T, S>) | SlatePluginConfig<K, O, A, T, S>): SlatePlugin<PluginConfig<K, O, A, T, S>>;
/**
 * Explicitly typed version of `createSlatePlugin`.
 *
 * @remarks
 *   While `createSlatePlugin` uses type inference, this function requires an
 *   explicit type parameter. Use this when you need precise control over the
 *   plugin's type structure or when type inference doesn't provide the desired
 *   result.
 */
declare function createTSlatePlugin<C extends AnyPluginConfig = PluginConfig>(config?: ((editor: SlateEditor) => TSlatePluginConfig<C>) | TSlatePluginConfig<C>): SlatePlugin<C>;

declare function getEditorPlugin<P extends AnyPluginConfig | SlatePlugin<AnyPluginConfig>>(editor: SlateEditor, p: WithRequiredKey<P>): SlatePluginContext<InferConfig<P> extends never ? P : InferConfig<P>>;

/** Get editor plugin by key or plugin object. */
declare function getSlatePlugin<C extends AnyPluginConfig = PluginConfig>(editor: SlateEditor, p: WithRequiredKey<C>): C extends {
    node: any;
} ? C : SlatePlugin<C>;
/** Get editor plugin type by key or plugin object. */
declare function getPluginType(editor: SlateEditor, plugin: WithRequiredKey): string;
/** Get editor plugin types by key. */
declare const getPluginTypes: (editor: SlateEditor, plugins: WithRequiredKey[]) => string[];

type SlateRenderElement = (props: RenderElementProps) => React__default.ReactElement<any> | undefined;
declare const pluginRenderElementStatic: (editor: SlateEditor, plugin: AnyEditorPlugin, components?: NodeComponents) => SlateRenderElement;

declare const pipeRenderElementStatic: (editor: SlateEditor, { components, renderElement: renderElementProp, }: {
    components: NodeComponents;
    renderElement?: SlateRenderElement;
}) => SlateRenderElement;

type SlateRenderLeaf = (props: RenderLeafProps) => React__default.ReactElement<any> | undefined;
declare const pluginRenderLeafStatic: (editor: SlateEditor, plugin: SlatePlugin, components: NodeComponents) => SlateRenderLeaf;
/** @see {@link RenderLeaf} */
declare const pipeRenderLeafStatic: (editor: SlateEditor, { components, renderLeaf: renderLeafProp, }: {
    components: NodeComponents;
    renderLeaf?: SlateRenderLeaf;
}) => SlateRenderLeaf;

type SlateRenderText = (props: RenderTextProps) => React__default.ReactElement<any> | undefined;
declare const pluginRenderTextStatic: (editor: SlateEditor, plugin: SlatePlugin, components: NodeComponents) => SlateRenderText;
/** @see {@link RenderText} */
declare const pipeRenderTextStatic: (editor: SlateEditor, { components, renderText: renderTextProp, }: {
    components: NodeComponents;
    renderText?: SlateRenderText;
}) => SlateRenderText;

declare function BaseElementStatic({ components, decorate, decorations, editor, element, }: {
    components: NodeComponents;
    decorate: EditableProps['decorate'];
    decorations: DecoratedRange[];
    editor: SlateEditor;
    element: TElement;
    style?: React__default.CSSProperties;
}): React__default.JSX.Element;
declare const ElementStatic: React__default.MemoExoticComponent<typeof BaseElementStatic>;
declare function BaseLeafStatic({ components, decorations, editor, text: text, }: {
    components: NodeComponents;
    decorations: DecoratedRange[];
    editor: SlateEditor;
    text: TText;
}): React__default.ReactElement<any, string | React__default.JSXElementConstructor<any>> | undefined;
declare const LeafStatic: React__default.MemoExoticComponent<typeof BaseLeafStatic>;
type PlateStaticProps = {
    /** Node components to render. */
    components: NodeComponents;
    /** Editor instance. */
    editor: SlateEditor;
    style?: React__default.CSSProperties;
    /** Controlled value. Alias to `editor.children`. */
    value?: Value;
} & React__default.HTMLAttributes<HTMLDivElement>;
declare function PlateStatic(props: PlateStaticProps): React__default.ReactElement<unknown, string | React__default.JSXElementConstructor<any>>;

type SerializeHtmlOptions<T extends PlateStaticProps = PlateStaticProps> = {
    /** Node components to render the HTML */
    components: NodeComponents;
    /** The component used to render the editor content */
    editorComponent?: React__default.ComponentType<T>;
    /** List of className prefixes to preserve from being stripped out */
    preserveClassNames?: string[];
    /** Props to pass to the editor component */
    props?: Partial<T>;
    /** Enable stripping class names */
    stripClassNames?: boolean;
    /** Enable stripping data attributes */
    stripDataAttributes?: boolean;
};
/**
 * Serialize the editor content to HTML. By default, uses `PlateStatic` as the
 * editor component, but you can provide a custom component (e.g.
 * `EditorStatic`).
 */
declare const serializeHtml: <T extends PlateStaticProps = PlateStaticProps>(editor: SlateEditor, { components, editorComponent: EditorComponent, preserveClassNames, props, stripClassNames, stripDataAttributes, }: SerializeHtmlOptions<T>) => Promise<string>;

declare const useNodeAttributes: (props: any, ref?: any) => any;
type SlateElementProps<N extends TElement = TElement, C extends AnyPluginConfig = PluginConfig> = SlateNodeProps<C> & RenderElementProps<N> & {
    path: Path;
} & DeprecatedNodeProps;
type DeprecatedNodeProps = {
    /**
     * @deprecated Optional class to be merged with `attributes.className`.
     * @default undefined
     */
    className?: string;
    /**
     * @deprecated Optional style to be merged with `attributes.style`
     * @default undefined
     */
    style?: React__default.CSSProperties;
};
type SlateNodeProps<C extends AnyPluginConfig = PluginConfig> = SlatePluginContext<C> & {
    /**
     * Optional ref to be merged with `attributes.ref`
     *
     * @default undefined
     */
    ref?: any;
};
type SlateHTMLProps<C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = 'div'> = SlateNodeProps<C> & {
    /** HTML attributes to pass to the underlying HTML element */
    attributes: React__default.PropsWithoutRef<React__default.JSX.IntrinsicElements[T]> & UnknownObject;
    as?: T;
    /** Class to be merged with `attributes.className` */
    className?: string;
    /** Style to be merged with `attributes.style` */
    style?: React__default.CSSProperties;
};
type StyledSlateElementProps<N extends TElement = TElement, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = 'div'> = Omit<SlateElementProps<N, C>, keyof DeprecatedNodeProps> & SlateHTMLProps<C, T>;
declare const SlateElement: <N extends TElement = TElement, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = "div">(props: StyledSlateElementProps<N, C, T>) => React__default.ReactElement;
type SlateTextProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig> = SlateNodeProps<C> & RenderTextProps<N> & DeprecatedNodeProps;
type StyledSlateTextProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = 'span'> = Omit<SlateTextProps<N, C>, keyof DeprecatedNodeProps> & SlateHTMLProps<C, T>;
declare const SlateText: <N extends TText = TText, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = "span">(props: StyledSlateTextProps<N, C, T>) => React__default.ReactElement;
type SlateLeafProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig> = SlateNodeProps<C> & RenderLeafProps<N> & DeprecatedNodeProps;
type StyledSlateLeafProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = 'span'> = Omit<SlateLeafProps<N, C>, keyof DeprecatedNodeProps> & SlateHTMLProps<C, T>;
declare const SlateLeaf: <N extends TText = TText, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = "span">({ className, ...props }: StyledSlateLeafProps<N, C, T>) => React__default.ReactElement;

declare const isSlateVoid: (element: HTMLElement) => boolean;
declare const isSlateElement: (element: HTMLElement) => boolean;
declare const isSlateText: (element: HTMLElement) => boolean;
declare const isSlateString: (element: HTMLElement) => boolean;
declare const isSlateLeaf: (element: HTMLElement) => boolean;
declare const isSlateEditor: (element: HTMLElement) => boolean;
declare const isSlateNode: (element: HTMLElement) => boolean;
declare const isSlatePluginElement: (element: HTMLElement, pluginKey: string) => boolean;
declare const isSlatePluginNode: (element: HTMLElement, pluginKey: string) => boolean;
declare const getSlateElements: (element: HTMLElement) => HTMLElement[];

/**
 * Convert HTML string exported from Plate into HTML element.
 *
 * @param html - The HTML string to convert exported from Plate.
 * @returns The Editor element without head and body.
 */
declare const getEditorDOMFromHtmlString: (html: string) => HTMLElement;

declare function createStaticString({ text }: {
    text: string;
}): React__default.ReactElement<{
    'data-slate-string': boolean;
}, string | React__default.JSXElementConstructor<any>>;

declare const getNodeDataAttributes: (editor: SlateEditor, node: TElement | TText, { isElement, isLeaf, isText, }: {
    isElement?: boolean;
    isLeaf?: boolean;
    isText?: boolean;
}) => {};
declare const getPluginDataAttributes: (editor: SlateEditor, plugin: AnyEditorPlugin, node: TElement | TText) => {};
declare const getNodeDataAttributeKeys: (node: TElement | TText) => string[];
declare const keyToDataAttribute: (key: string) => string;

declare const getRenderNodeStaticProps: ({ attributes: nodeAttributes, editor, node, plugin, props, }: {
    editor: SlateEditor;
    props: SlateRenderNodeProps;
    attributes?: AnyObject;
    node?: TElement | TText;
    plugin?: AnyEditorPlugin;
}) => SlateRenderNodeProps;

/**
 * @see {@link Decorate} .
 * Optimization: return undefined if empty list so Editable uses a memo.
 */
declare const pipeDecorate: (editor: SlateEditor, decorateProp?: ((ctx: {
    editor: SlateEditor;
    entry: NodeEntry;
}) => TRange[] | undefined) | null) => EditableProps["decorate"];

/**
 * Remove all class names that do not start with one of preserveClassNames
 * (`slate-` by default)
 */
declare const stripHtmlClassNames: (html: string, { preserveClassNames }: {
    preserveClassNames?: string[];
}) => string;

declare const stripSlateDataAttributes: (rawHtml: string) => string;

/**
 * Enables support for deserializing inserted content from Slate Ast format to
 * Slate format while apply a small bug fix.
 */
declare const AstPlugin: SlatePlugin<PluginConfig<"ast", {}, {}, {}, {}>>;

declare const withPlateHistory: ExtendEditor;
/** @see {@link withHistory} */
declare const HistoryPlugin: SlatePlugin<PluginConfig<"history", {}, {}, {}, {}>>;

/**
 * Merge and register all the inline types and void types from the plugins and
 * options, using `editor.api.isInline`, `editor.api.markableVoid` and
 * `editor.api.isVoid`
 */
declare const withInlineVoid: OverrideEditor;
/** @see {@link withInlineVoid} */
declare const InlineVoidPlugin: SlatePlugin<PluginConfig<"inlineVoid", {}, {}, {}, {}>>;

declare const ParserPlugin: SlatePlugin<PluginConfig<"parser", {}, {}, {}, {}>>;

/**
 * Enables support for deserializing inserted content from HTML format to Slate
 * format and serializing Slate content to HTML format.
 */
declare const HtmlPlugin: SlatePlugin<PluginConfig<"html", {}, Record<"html", {
    deserialize: (args_0: {
        element: HTMLElement | string;
        collapseWhiteSpace?: boolean;
        defaultElementPlugin?: WithRequiredKey;
    }) => _udecode_slate.Descendant[];
}>, {}, {}>>;

declare const CARRIAGE_RETURN = "\r";
declare const LINE_FEED = "\n";
declare const NO_BREAK_SPACE = "\u00A0";
declare const SPACE = " ";
declare const TAB = "\t";
declare const ZERO_WIDTH_SPACE = "\u200B";

type DeserializeHtmlChildren = ChildNode | Descendant | string | null;
/** De */
type DeserializeHtmlNodeReturnType = Descendant | Descendant[] | DeserializeHtmlChildren[] | string | null;

/** Replace BR elements with line feeds. */
declare const cleanHtmlBrElements: (rootNode: Node) => void;

/** Replace \r\n and \r with \n */
declare const cleanHtmlCrLf: (html: string) => string;

/** Remove empty elements from rootNode. Allowed empty elements: BR, IMG. */
declare const cleanHtmlEmptyElements: (rootNode: Node) => void;

/**
 * Replace FONT elements with SPAN elements if there is textContent (remove
 * otherwise).
 */
declare const cleanHtmlFontElements: (rootNode: Node) => void;

/** Remove fragment hrefs and spans without inner text. */
declare const cleanHtmlLinkElements: (rootNode: Node) => void;

declare const cleanHtmlTextNodes: (rootNode: Node) => void;

/**
 * Set HTML blocks mark styles to a new child span element if any. This allows
 * Plate to use block marks.
 */
declare const copyBlockMarksToSpanChild: (rootNode: Node) => void;

/** Deserialize HTML element to a valid document fragment. */
declare const deserializeHtml: (editor: SlateEditor, { collapseWhiteSpace: shouldCollapseWhiteSpace, defaultElementPlugin, element, }: {
    element: HTMLElement | string;
    collapseWhiteSpace?: boolean;
    defaultElementPlugin?: WithRequiredKey;
}) => Descendant[];

/** Deserialize HTML element to fragment. */
declare const deserializeHtmlElement: (editor: SlateEditor, element: HTMLElement) => DeserializeHtmlNodeReturnType;

/** Deserialize HTML element or child node. */
declare const deserializeHtmlNode: (editor: SlateEditor) => (node: ChildNode | HTMLElement) => DeserializeHtmlNodeReturnType;

declare const deserializeHtmlNodeChildren: (editor: SlateEditor, node: ChildNode | HTMLElement, isSlateParent?: boolean) => DeserializeHtmlChildren[];

/**
 * Find the first HTML element that matches the given selector.
 *
 * @param rootNode
 * @param predicate
 */
declare const findHtmlElement: (rootNode: Node, predicate: (node: HTMLElement) => boolean) => null;
declare const someHtmlElement: (rootNode: Node, predicate: (node: HTMLElement) => boolean) => boolean;

declare const getDataNodeProps: ({ editor, element, plugin, }: {
    editor: SlateEditor;
    element: HTMLElement;
    plugin: AnyEditorPlugin;
}) => Record<string, any> | undefined;

declare const getHtmlComments: (node: Node) => string[];

/** Deserialize HTML body element to Fragment. */
declare const htmlBodyToFragment: (editor: SlateEditor, element: HTMLElement) => Descendant[] | undefined;

/** Deserialize HTML to break line. */
declare const htmlBrToNewLine: (node: ChildNode | HTMLElement) => "\n" | undefined;

/** Deserialize HTML to Element. */
declare const htmlElementToElement: (editor: SlateEditor, element: HTMLElement, isSlate?: boolean) => Descendant | undefined;

/**
 * Deserialize HTML to Descendant[] with marks on Text. Build the leaf from the
 * leaf deserializers of each plugin.
 */
declare const htmlElementToLeaf: (editor: SlateEditor, element: HTMLElement) => Descendant[];

/** Convert HTML string into HTML element. */
declare const htmlStringToDOMNode: (rawHtml: string) => HTMLBodyElement;

declare const htmlTextNodeToString: (node: ChildNode | HTMLElement) => string | undefined;

/**
 * # Methodology
 *
 * ## Step 1. Get the list of all standard tag names
 *
 * Go to https://developer.mozilla.org/en-US/docs/Web/HTML/Element and run the
 * following in the console to generate a JSON array of tag names:
 *
 * ```js
 * JSON.stringify(
 *   Array.from(document.querySelectorAll('article table td:first-child'))
 *     .map((td) => {
 *       const body = document.createElement('body');
 *       body.innerHTML = td.textContent;
 *       return body.firstChild?.tagName;
 *     })
 *     .filter((tagName) => tagName)
 * );
 * ```
 *
 * Output (as of 2023-11-06):
 *
 * ```json
 * '["BASE","LINK","META","STYLE","TITLE","ADDRESS","ARTICLE","ASIDE","FOOTER","HEADER","H1","HGROUP","MAIN","NAV","SECTION","SEARCH","BLOCKQUOTE","DD","DIV","DL","DT","FIGCAPTION","FIGURE","HR","LI","MENU","OL","P","PRE","UL","A","ABBR","B","BDI","BDO","BR","CITE","CODE","DATA","DFN","EM","I","KBD","MARK","Q","RP","RT","RUBY","S","SAMP","SMALL","SPAN","STRONG","SUB","SUP","TIME","U","VAR","WBR","AREA","AUDIO","IMG","MAP","TRACK","VIDEO","EMBED","IFRAME","OBJECT","PICTURE","PORTAL","SOURCE","svg","math","CANVAS","NOSCRIPT","SCRIPT","DEL","INS","TABLE","BUTTON","DATALIST","FIELDSET","FORM","INPUT","LABEL","LEGEND","METER","OPTGROUP","OPTION","OUTPUT","PROGRESS","SELECT","TEXTAREA","DETAILS","DIALOG","SUMMARY","SLOT","TEMPLATE","ACRONYM","BIG","CENTER","CONTENT","DIR","FONT","IMG","MARQUEE","MENUITEM","NOBR","NOEMBED","NOFRAMES","PARAM","PLAINTEXT","RB","RTC","SHADOW","STRIKE","TT","XMP"]'
 * ```
 *
 * ## Step 2. For each tag name, determine the default browser style
 *
 * Open an empty HTML file in the browser and run the following in the console:
 *
 * ```js
 * const tagNames = JSON.parse(<JSON string from step 1>);
 *
 * JSON.stringify(
 *   tagNames.filter((tagName) => {
 *     const element = document.createElement(tagName);
 *     document.body.appendChild(element);
 *     const display = window.getComputedStyle(element).display;
 *     element.remove();
 *     return display.startsWith('inline');
 *   })
 * );
 * ```
 *
 * Place the result in the array below (accurate as of 2023-11-06).
 */
declare const inlineTagNames: Set<string>;

declare const isHtmlBlockElement: (node: Node) => boolean;

declare const isHtmlComment: (node: Node) => node is Comment;

declare const isHtmlElement: (node: Node) => node is Element;

/** If href starts with '#'. */
declare const isHtmlFragmentHref: (href: string) => boolean;

declare const isHtmlInlineElement: (node: Node) => boolean;

declare const isHtmlTable: (element: Element) => boolean;

declare const isHtmlText: (node: Node) => node is Text;

declare const isOlSymbol: (symbol: string) => boolean;

declare const parseHtmlDocument: (html: string) => Document;

declare const parseHtmlElement: (html: string) => HTMLElement;

declare const pipeDeserializeHtmlElement: (editor: SlateEditor, element: HTMLElement) => (Nullable<HtmlDeserializer> & {
    node: AnyObject;
}) | undefined;

declare const pipeDeserializeHtmlLeaf: (editor: SlateEditor, element: HTMLElement) => AnyObject;

/** Get a deserializer by type, node names, class names and styles. */
declare const pluginDeserializeHtml: (editor: SlateEditor, plugin: AnyEditorPlugin, { deserializeLeaf, element: el, }: {
    element: HTMLElement;
    deserializeLeaf?: boolean;
}) => (Nullable<HtmlDeserializer> & {
    node: AnyObject;
}) | undefined;

/** Trim the html and remove zero width spaces, then wrap it with a body element. */
declare const postCleanHtml: (html: string) => string;

/** Remove HTML surroundings and clean HTML from CR/LF */
declare const preCleanHtml: (html: string) => string;

/** Removes HTML nodes between HTML comments. */
declare const removeHtmlNodesBetweenComments: (rootNode: Node, start: string, end: string) => void;

/** Remove string before <html and after </html> */
declare const removeHtmlSurroundings: (html: string) => string;

/**
 * Replace `element` tag name by `tagName`. Attributes, innerHTML and parent
 * relationship is kept.
 */
declare const replaceTagName: (element: Element, tagName: string) => Element;

type Callback$3 = (node: Comment) => boolean;
/** Traverse HTML comments. */
declare const traverseHtmlComments: (rootNode: Node, callback: Callback$3) => void;

type Callback$2 = (node: Element) => boolean;
/**
 * Traverse the HTML elements of the given HTML node.
 *
 * @param rootNode The root HTML node to traverse.
 * @param callback The callback to call for each HTML element.
 */
declare const traverseHtmlElements: (rootNode: Node, callback: Callback$2) => void;

type Callback$1 = (node: Node) => boolean;
/**
 * Depth-first pre-order tree traverse the given HTML node and calls the given
 * callback for each node. see:
 * https://en.wikipedia.org/wiki/Tree_traversal#Pre-order_(NLR)
 *
 * @param callback Returns a boolean indicating whether traversal should be
 *   continued
 */
declare const traverseHtmlNode: (node: Node, callback: Callback$1) => void;

type Callback = (node: Text) => boolean;
declare const traverseHtmlTexts: (rootNode: Node, callback: Callback) => void;

/** Unwrap the given HTML element. */
declare const unwrapHtmlElement: (element: Element) => void;

type CollapseWhiteSpaceState = {
    inlineFormattingContext: {
        atStart: boolean;
        lastHasTrailingWhiteSpace: boolean;
    } | null;
    whiteSpaceRule: WhiteSpaceRule;
};
type TrimEndRule = 'collapse' | 'single-newline';
type TrimStartRule = 'all' | 'collapse';
type WhiteSpaceRule = 'normal' | 'pre' | 'pre-line';

declare const collapseString: (text: string, { shouldCollapseWhiteSpace, trimEnd, trimStart, whiteSpaceIncludesNewlines, }?: {
    shouldCollapseWhiteSpace?: boolean;
    trimEnd?: TrimEndRule;
    trimStart?: TrimStartRule;
    whiteSpaceIncludesNewlines?: boolean;
}) => string;

declare const collapseWhiteSpace: (element: HTMLElement) => HTMLElement;

declare const collapseWhiteSpaceChildren: (node: Node, state: CollapseWhiteSpaceState) => void;

/**
 * Note: We do not want to start an inline formatting context until we encounter
 * a text node.
 */
declare const collapseWhiteSpaceElement: (element: HTMLElement, state: CollapseWhiteSpaceState) => void;

declare const collapseWhiteSpaceNode: (node: Node, state: CollapseWhiteSpaceState) => void;

declare const collapseWhiteSpaceText: (text: Text, state: CollapseWhiteSpaceState) => void;

declare const inferWhiteSpaceRule: (element: HTMLElement) => WhiteSpaceRule | null;

declare const isLastNonEmptyTextOfInlineFormattingContext: (initialText: Text) => boolean;

declare const upsertInlineFormattingContext: (state: CollapseWhiteSpaceState) => void;
declare const endInlineFormattingContext: (state: CollapseWhiteSpaceState) => void;

declare const LengthPlugin: SlatePlugin<LengthConfig>;

type ParagraphConfig = PluginConfig<'p'>;
declare const BaseParagraphPlugin: SlatePlugin<PluginConfig<"p", {}, {}, {}, {}>>;

interface ApplyDeepToNodesOptions<N extends TNode> {
    apply: (node: NodeOf<N>, source: (() => Record<string, any>) | Record<string, any>) => void;
    node: N;
    source: (() => Record<string, any>) | Record<string, any>;
    path?: Path;
    query?: QueryNodeOptions;
}
/** Recursively apply an operation to children nodes with a query. */
declare const applyDeepToNodes: <N extends TNode>({ apply, node, path, query, source, }: ApplyDeepToNodesOptions<N>) => void;

/** Recursively merge a source object to children nodes with a query. */
declare const defaultsDeepToNodes: <N extends TNode>(options: Omit<ApplyDeepToNodesOptions<N>, "apply">) => void;

declare const getInjectMatch: <E extends SlateEditor>(editor: E, plugin: EditorPlugin) => (node: TNode, path: Path) => boolean;

/**
 * Get all plugins having a defined `inject.plugins[plugin.key]`. It includes
 * `plugin` itself.
 */
declare const getInjectedPlugins: (editor: SlateEditor, plugin: AnyEditorPlugin) => Partial<AnyEditorPlugin>[];

/** Get plugin keys by types */
declare const getKeysByTypes: (editor: SlateEditor, types: string[]) => string[];
/** Get plugin key by type */
declare const getKeyByType: (editor: SlateEditor, type: string) => string;

declare const getPluginNodeProps: ({ attributes: nodeAttributes, node, plugin, props, }: {
    props: SlateRenderNodeProps;
    attributes?: AnyObject;
    node?: TElement | TText;
    plugin?: AnyEditorPlugin;
}) => any;

/** Get slate class name: slate-<type> */
declare const getSlateClass: (type?: string) => string;

/** Create a platform-aware hotkey checker. */
declare const createHotkey: (key: string) => (event: KeyboardEventLike) => boolean;
declare const Hotkeys: {
    isBold: (event: KeyboardEventLike) => boolean;
    isCompose: (event: KeyboardEventLike) => boolean;
    isDeleteBackward: (event: KeyboardEventLike) => boolean;
    isDeleteForward: (event: KeyboardEventLike) => boolean;
    isDeleteLineBackward: (event: KeyboardEventLike) => boolean;
    isDeleteLineForward: (event: KeyboardEventLike) => boolean;
    isDeleteWordBackward: (event: KeyboardEventLike) => boolean;
    isDeleteWordForward: (event: KeyboardEventLike) => boolean;
    isExtendBackward: (event: KeyboardEventLike) => boolean;
    isExtendForward: (event: KeyboardEventLike) => boolean;
    isExtendLineBackward: (event: KeyboardEventLike) => boolean;
    isExtendLineForward: (event: KeyboardEventLike) => boolean;
    isItalic: (event: KeyboardEventLike) => boolean;
    isMoveBackward: (event: KeyboardEventLike) => boolean;
    isMoveForward: (event: KeyboardEventLike) => boolean;
    isMoveLineBackward: (event: KeyboardEventLike) => boolean;
    isMoveLineForward: (event: KeyboardEventLike) => boolean;
    isMoveWordBackward: (event: KeyboardEventLike) => boolean;
    isMoveWordForward: (event: KeyboardEventLike) => boolean;
    isRedo: (event: KeyboardEventLike) => boolean;
    isSoftBreak: (event: KeyboardEventLike) => boolean;
    isSplitBlock: (event: KeyboardEventLike) => boolean;
    isTab: (editor: Editor, event: React.KeyboardEvent, { composing, }?: {
        /** Ignore the event if composing. */
        composing?: boolean;
    }) => boolean;
    isTransposeCharacter: (event: KeyboardEventLike) => boolean;
    isUndo: (event: KeyboardEventLike) => boolean;
    isUntab: (editor: Editor, event: React.KeyboardEvent, { composing, }?: {
        /** Ignore the event if composing. */
        composing?: boolean;
    }) => boolean;
};

/** Does the node match the type provided. */
declare const isType: (editor: SlateEditor, node: any, key?: string[] | string) => boolean;

/** Recursively merge a source object to children nodes with a query. */
declare const mergeDeepToNodes: <N extends TNode>(options: Omit<ApplyDeepToNodesOptions<N>, "apply">) => void;

/** Normalize the descendants to a valid document fragment. */
declare const normalizeDescendantsToDocumentFragment: (editor: SlateEditor, { defaultElementPlugin, descendants, }: {
    descendants: Descendant[];
    defaultElementPlugin?: WithRequiredKey;
}) => Descendant[];

declare const omitPluginContext: <T extends SlatePluginContext<AnySlatePlugin>>(ctx: T) => Omit<T, "api" | "type" | "setOptions" | "tf" | "getOption" | "getOptions" | "setOption" | "editor" | "plugin">;

/**
 * Recursive deep merge of each plugin from `override.plugins` into plugin with
 * same key (plugin > plugin.plugins).
 */
declare const overridePluginsByKey: (plugin: AnySlatePlugin, overrideByKey?: Record<string, Partial<AnySlatePlugin>>, nested?: boolean) => AnySlatePlugin;

/** Is the plugin disabled by another plugin. */
declare const pipeInsertDataQuery: (editor: SlateEditor, plugins: Partial<AnyEditorPlugin>[], { data, dataTransfer }: ParserOptions) => boolean;

export { AnyEditorPlugin, AnyPluginConfig, AnySlatePlugin, type ApplyDeepToNodesOptions, AstPlugin, BaseParagraphPlugin, CARRIAGE_RETURN, type CollapseWhiteSpaceState, type DeserializeHtmlChildren, type DeserializeHtmlNodeReturnType, EditableProps, EditorPlugin, ElementStatic, ExtendEditor, HistoryPlugin, Hotkeys, HtmlDeserializer, HtmlPlugin, InferConfig, InlineVoidPlugin, LINE_FEED, LeafStatic, LengthConfig, LengthPlugin, NO_BREAK_SPACE, NodeComponents, OverrideEditor, type ParagraphConfig, ParserOptions, ParserPlugin, PlateStatic, type PlateStaticProps, PluginConfig, RenderElementProps, RenderLeafProps, RenderTextProps, SPACE, type SerializeHtmlOptions, SlateEditor, SlateElement, type SlateElementProps, type SlateHTMLProps, SlateLeaf, type SlateLeafProps, type SlateNodeProps, SlatePlugin, SlatePluginContext, SlatePluginMethods, type SlateRenderElement, type SlateRenderLeaf, SlateRenderNodeProps, type SlateRenderText, SlateText, type SlateTextProps, type StyledSlateElementProps, type StyledSlateLeafProps, type StyledSlateTextProps, TAB, type TrimEndRule, type TrimStartRule, type WhiteSpaceRule, WithRequiredKey, ZERO_WIDTH_SPACE, applyDeepToNodes, cleanHtmlBrElements, cleanHtmlCrLf, cleanHtmlEmptyElements, cleanHtmlFontElements, cleanHtmlLinkElements, cleanHtmlTextNodes, collapseString, collapseWhiteSpace, collapseWhiteSpaceChildren, collapseWhiteSpaceElement, collapseWhiteSpaceNode, collapseWhiteSpaceText, copyBlockMarksToSpanChild, createHotkey, createSlatePlugin, createStaticString, createTSlatePlugin, defaultsDeepToNodes, deserializeHtml, deserializeHtmlElement, deserializeHtmlNode, deserializeHtmlNodeChildren, endInlineFormattingContext, findHtmlElement, getDataNodeProps, getEditorDOMFromHtmlString, getEditorPlugin, getHtmlComments, getInjectMatch, getInjectedPlugins, getKeyByType, getKeysByTypes, getNodeDataAttributeKeys, getNodeDataAttributes, getPluginDataAttributes, getPluginNodeProps, getPluginType, getPluginTypes, getRenderNodeStaticProps, getSlateClass, getSlateElements, getSlatePlugin, htmlBodyToFragment, htmlBrToNewLine, htmlElementToElement, htmlElementToLeaf, htmlStringToDOMNode, htmlTextNodeToString, inferWhiteSpaceRule, inlineTagNames, isHtmlBlockElement, isHtmlComment, isHtmlElement, isHtmlFragmentHref, isHtmlInlineElement, isHtmlTable, isHtmlText, isLastNonEmptyTextOfInlineFormattingContext, isOlSymbol, isSlateEditor, isSlateElement, isSlateLeaf, isSlateNode, isSlatePluginElement, isSlatePluginNode, isSlateString, isSlateText, isSlateVoid, isType, keyToDataAttribute, mergeDeepToNodes, normalizeDescendantsToDocumentFragment, omitPluginContext, overridePluginsByKey, parseHtmlDocument, parseHtmlElement, pipeDecorate, pipeDeserializeHtmlElement, pipeDeserializeHtmlLeaf, pipeInsertDataQuery, pipeRenderElementStatic, pipeRenderLeafStatic, pipeRenderTextStatic, pluginDeserializeHtml, pluginRenderElementStatic, pluginRenderLeafStatic, pluginRenderTextStatic, postCleanHtml, preCleanHtml, removeHtmlNodesBetweenComments, removeHtmlSurroundings, replaceTagName, serializeHtml, someHtmlElement, stripHtmlClassNames, stripSlateDataAttributes, traverseHtmlComments, traverseHtmlElements, traverseHtmlNode, traverseHtmlTexts, unwrapHtmlElement, upsertInlineFormattingContext, useNodeAttributes, withInlineVoid, withPlateHistory };
