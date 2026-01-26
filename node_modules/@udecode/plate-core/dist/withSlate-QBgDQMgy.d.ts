import React__default, { JSX } from 'react';
import * as _udecode_slate from '@udecode/slate';
import { EditorApi, EditorTransforms, TElement, TText, LeafPosition, NodeEntry, TRange, Editor, DOMRange, DecoratedRange, Value, Descendant, ScrollIntoViewOptions, Operation, EditorBase, TSelection } from '@udecode/slate';
import { AnyObject, Nullable, Deep2Partial, UnionToIntersection } from '@udecode/utils';
import { Draft } from 'mutative';
import { TStateApi } from 'zustand-x';
import { KeyboardEventLike } from 'is-hotkey';

type AnyPluginConfig = {
    key: any;
    api: any;
    options: any;
    selectors: any;
    transforms: any;
};
type BaseDeserializer = AnyObject & {
    /**
     * Deserialize an element. Overrides plugin.isElement.
     *
     * @default plugin.isElement
     */
    isElement?: boolean;
    /**
     * Deserialize a leaf. Overrides plugin.isLeaf.
     *
     * @default plugin.isLeaf
     */
    isLeaf?: boolean;
};
type BaseHtmlDeserializer = BaseDeserializer & {
    /** List of HTML attribute names to store their values in `node.attributes`. */
    attributeNames?: string[];
    rules?: {
        /**
         * Deserialize an element:
         *
         * - If this option (string) is in the element attribute names.
         * - If this option (object) values match the element attributes.
         */
        validAttribute?: Record<string, string[] | string> | string;
        /** Valid element `className`. */
        validClassName?: string;
        /** Valid element `nodeName`. Set '*' to allow any node name. */
        validNodeName?: string[] | string;
        /**
         * Valid element style values. Can be a list of string (only one match is
         * needed).
         */
        validStyle?: Partial<Record<keyof CSSStyleDeclaration, string[] | string | undefined>>;
    }[];
    /** Whether or not to include deserialized children on this node */
    withoutChildren?: boolean;
};
type BaseInjectProps = {
    /**
     * Object whose keys are node values and values are classNames which will be
     * extended.
     */
    classNames?: AnyObject;
    /**
     * Default node value. The node key would be unset if the node value =
     * defaultNodeValue.
     */
    defaultNodeValue?: any;
    /** Node key to map to the styles. */
    nodeKey?: string;
    /**
     * Style key to override.
     *
     * @default nodeKey
     */
    styleKey?: keyof CSSStyleDeclaration;
    /** List of supported node values. */
    validNodeValues?: any[];
};
type BasePlugin<C extends AnyPluginConfig = PluginConfig> = {
    /** Unique identifier for this plugin. */
    key: C['key'];
    /** API methods provided by this plugin. */
    api: InferApi<C>;
    /**
     * An array of plugin keys that this plugin depends on. These plugins will be
     * loaded before this plugin.
     */
    dependencies: string[];
    inject: Nullable<{
        /** Plugin keys of elements to exclude the children from */
        excludeBelowPlugins?: string[];
        /** Plugin keys of elements to exclude */
        excludePlugins?: string[];
        /** Whether to filter blocks */
        isBlock?: boolean;
        /** Whether to filter elements */
        isElement?: boolean;
        /** Whether to filter leaves */
        isLeaf?: boolean;
        /** Filter nodes with path above this level. */
        maxLevel?: number;
        /**
         * Plugin keys used by {@link InjectNodeProps} and the targetPluginToInject
         * function. For plugin injection by key, use the inject.plugins property.
         *
         * @default [ParagraphPlugin.key]
         */
        targetPlugins?: string[];
    }>;
    /** Node-specific configuration for this plugin. */
    node: BasePluginNode<C>;
    /** Extended properties used by any plugin as options. */
    options: InferOptions<C>;
    /** Store for managing plugin options. */
    optionsStore: TStateApi<C['options'], [
        ['zustand/mutative-x', never]
    ], {}, C['selectors']>;
    override: {
        /** Enable or disable plugins */
        enabled?: Partial<Record<string, boolean>>;
    };
    /**
     * Recursive plugin support to allow having multiple plugins in a single
     * plugin. Plate eventually flattens all the plugins into the editor.
     */
    plugins: any[];
    /**
     * Defines the order in which plugins are registered and executed.
     *
     * Plugins with higher priority values are registered and executed before
     * those with lower values. This affects two main aspects:
     *
     * 1. Plugin Order: Plugins with higher priority will be added to the editor
     *    earlier.
     * 2. Execution Order: For operations that involve multiple plugins (e.g., editor
     *    methods), plugins with higher priority will be processed first.
     *
     * @default 100
     */
    priority: number;
    render: Nullable<{
        /**
         * Renders a component above the `Editable` component but within the `Slate`
         * wrapper. Useful for adding UI elements that should appear above the
         * editable area.
         */
        aboveEditable?: React.FC<{
            children: React.ReactNode;
        }>;
        /**
         * Renders a component above the `Slate` wrapper. This is the outermost
         * render position in the editor structure.
         */
        aboveSlate?: React.FC<{
            children: React.ReactNode;
        }>;
        /**
         * Renders a component below leaf nodes when `isLeaf: true` and
         * `isDecoration: false`. Use `render.node` instead when `isDecoration:
         * true`.
         */
        leaf?: NodeComponent;
        /**
         * Renders a component for:
         *
         * - Elements nodes if `isElement: true`
         * - Below text nodes if `isLeaf: true` and `isDecoration: false`
         * - Below leaf if `isLeaf: true` and `isDecoration: true`
         */
        node?: NodeComponent;
    }>;
    /** Selectors for the plugin. */
    selectors: InferSelectors<C>;
    /** Transforms (state-modifying operations) that can be applied to the editor. */
    transforms: InferTransforms<C>;
    /**
     * Enables or disables the plugin. Used by Plate to determine if the plugin
     * should be used.
     */
    enabled?: boolean;
};
type BasePluginContext<C extends AnyPluginConfig = PluginConfig> = {
    api: C['api'] & EditorApi;
    setOptions: {
        (options: (state: Draft<Partial<InferOptions<C>>>) => void): void;
        (options: Partial<InferOptions<C>>): void;
    };
    tf: C['transforms'] & EditorTransforms;
    type: string;
    getOption: <K extends keyof InferOptions<C> | keyof InferSelectors<C> | 'state'>(key: K, ...args: K extends keyof InferSelectors<C> ? Parameters<InferSelectors<C>[K]> : unknown[]) => K extends 'state' ? InferOptions<C> : K extends keyof InferSelectors<C> ? ReturnType<InferSelectors<C>[K]> : K extends keyof InferOptions<C> ? InferOptions<C>[K] : never;
    getOptions: () => InferOptions<C>;
    setOption: <K extends keyof InferOptions<C>>(optionKey: K, value: InferOptions<C>[K]) => void;
};
type BasePluginNode<C extends AnyPluginConfig = PluginConfig> = {
    /**
     * Specifies the type identifier for this plugin's nodes.
     *
     * For elements (when {@link isElement} is `true`):
     *
     * - The {@link NodeComponent} will be used for any node where `node.type ===
     *   type`.
     *
     * For leaves/marks (when {@link isLeaf} is `true`):
     *
     * - The {@link NodeComponent} will be used for any leaf where `node[type] ===
     *   true`.
     *
     * This property is crucial for Plate to correctly match nodes to their
     * respective plugins.
     *
     * @default plugin.key
     */
    type: string;
    component?: NodeComponent | null;
    /**
     * Controls which (if any) attribute names in the `attributes` property of an
     * element will be passed as `nodeProps` to the {@link NodeComponent}, and
     * subsequently rendered as DOM attributes.
     *
     * WARNING: If used improperly, this property WILL make your application
     * vulnerable to cross-site scripting (XSS) or information exposure attacks.
     *
     * For example, if the `href` attribute is allowed and the component passes
     * `nodeProps` to an `<a>` element, then attackers can direct users to open a
     * document containing a malicious link element:
     *
     * { type: 'link', url: 'https://safesite.com/', attributes: { href:
     * 'javascript:alert("xss")' }, children: [{ text: 'Click me' }], }
     *
     * The same is true of the `src` attribute when passed to certain HTML
     * elements, such as `<iframe>`.
     *
     * If the `style` attribute (or another attribute that can load URLs, such as
     * `background`) is allowed, then attackers can direct users to open a
     * document that will send a HTTP request to an arbitrary URL. This can leak
     * the victim's IP address or confirm to the attacker that the victim opened
     * the document.
     *
     * Before allowing any attribute name, ensure that you thoroughly research and
     * assess any potential risks associated with it.
     *
     * @default [ ]
     */
    dangerouslyAllowAttributes?: string[];
    /**
     * Indicates if this plugin's nodes can be rendered as decorated leaf. Set to
     * false to render node component only once per text node.
     *
     * @default true
     */
    isDecoration?: boolean;
    /**
     * Indicates if this plugin's nodes should be rendered as elements. Used by
     * Plate for {@link NodeComponent} rendering as elements.
     */
    isElement?: boolean;
    /**
     * Indicates if this plugin's elements should be treated as inline. Used by
     * the inlineVoid core plugin.
     */
    isInline?: boolean;
    /**
     * Indicates if this plugin's nodes should be rendered as leaves. Used by
     * Plate for {@link NodeComponent} rendering as leaves.
     */
    isLeaf?: boolean;
    /**
     * Indicates if this plugin's void elements should be markable. Used by the
     * inlineVoid core plugin.
     */
    isMarkableVoid?: boolean;
    /**
     * Whether the node is selectable.
     *
     * @default true
     */
    isSelectable?: boolean;
    /**
     * Property used by `inlineVoid` core plugin to set elements of this `type` as
     * void.
     */
    isVoid?: boolean;
    /**
     * Function that returns an object of data attributes to be added to the
     * element.
     */
    toDataAttributes?: (options: BasePluginContext<C> & {
        node: TElement;
    }) => AnyObject | undefined;
};
type BaseSerializer = AnyObject;
type BaseTransformOptions = GetInjectNodePropsOptions & {
    nodeValue?: any;
    value?: any;
};
type ExtendConfig<C extends PluginConfig, EO = {}, EA = {}, ET = {}, ES = {}> = {
    key: C['key'];
    api: C['api'] & EA;
    options: C['options'] & EO;
    selectors: C['selectors'] & ES;
    transforms: C['transforms'] & ET;
};
interface GetInjectNodePropsOptions {
    /** Existing className. */
    className?: string;
    /** Style value or className key. */
    element?: TElement;
    /** Existing style. */
    style?: CSSStyleDeclaration;
    /** Style value or className key. */
    text?: TText;
}
interface GetInjectNodePropsReturnType extends AnyObject {
    className?: string;
    style?: CSSStyleDeclaration;
}
type InferApi<P> = P extends PluginConfig ? P['api'] : never;
type InferOptions<P> = P extends PluginConfig ? P['options'] : never;
type InferSelectors<P> = P extends PluginConfig ? P['selectors'] : never;
type InferTransforms<P> = P extends PluginConfig ? P['transforms'] : never;
/**
 * Renders a component for Slate Nodes (elements if `isElement: true` or leaves
 * if `isLeaf: true`) that match this plugin's type. This is the primary render
 * method for plugin-specific node content.
 *
 * @default DefaultElement for elements, DefaultLeaf for leaves
 */
type NodeComponent<T = any> = React.FC<T>;
type NodeComponents = Record<string, NodeComponent>;
type ParserOptions = {
    data: string;
    dataTransfer: DataTransfer;
};
type PluginConfig<K extends string = any, O = {}, A = {}, T = {}, S = {}> = {
    key: K;
    api: A;
    options: O;
    selectors: S;
    transforms: T;
};
type WithAnyKey<C extends AnyPluginConfig = PluginConfig> = PluginConfig<any, InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>>;
type WithRequiredKey<P = {}> = (P extends {
    key: string;
} ? P : never) | {
    key: string;
};

/** If true, the next handlers will be skipped. */
type HandlerReturnType = boolean | void;

type RenderElementFn = (props: RenderElementProps) => React__default.ReactElement<any>;
interface RenderElementProps<N extends TElement = TElement> {
    attributes: {
        'data-slate-node': 'element';
        ref: any;
        className?: string;
        'data-slate-inline'?: true;
        'data-slate-void'?: true;
        dir?: 'rtl';
        style?: React__default.CSSProperties;
    };
    children: any;
    element: N;
}

type RenderLeafFn = (props: RenderLeafProps) => React.ReactElement<any>;
interface RenderLeafProps<N extends TText = TText> {
    attributes: {
        className?: string;
        'data-slate-leaf'?: true;
        style?: React.CSSProperties;
    };
    children: any;
    leaf: N;
    text: N;
    /**
     * The position of the leaf within the Text node, only present when the text
     * node is split by decorations.
     */
    leafPosition?: LeafPosition;
}

type RenderTextFn = (props: RenderTextProps) => React__default.ReactElement<any>;
interface RenderTextProps<N extends TText = TText> {
    /** The text node being rendered. */
    text: N;
    /** The children (leaves) rendered within this text node. */
    children: any;
    /**
     * HTML attributes to be spread onto the rendered container element. Includes
     * `data-slate-node="text"` and `ref`.
     */
    attributes: {
        'data-slate-node': 'text';
        ref: any;
        className?: string;
        style?: React__default.CSSProperties;
    };
}

/** `EditableProps` are passed to the <Editable> component. */
type EditableProps = {
    as?: React.ElementType;
    disableDefaultStyles?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    renderElement?: RenderElementFn;
    renderLeaf?: RenderLeafFn;
    renderText?: RenderTextFn;
    role?: string;
    style?: React.CSSProperties;
    decorate?: (entry: NodeEntry) => TRange[];
    renderPlaceholder?: (props: {
        attributes: {
            contentEditable: boolean;
            'data-slate-placeholder': boolean;
            ref: React.RefCallback<any>;
            style: React.CSSProperties;
            dir?: 'rtl';
        };
        children: any;
    }) => JSX.Element;
    scrollSelectionIntoView?: (editor: Editor, domRange: DOMRange) => void;
    onDOMBeforeInput?: (event: InputEvent) => void;
} & React.TextareaHTMLAttributes<HTMLDivElement>;

type BoxStaticProps = React.ComponentProps<'div'> & {
    as?: React.ElementType;
};
type SlateRenderElementProps<N extends TElement = TElement, C extends AnyPluginConfig = PluginConfig> = SlateRenderNodeProps<C> & RenderElementProps<N>;
type SlateRenderLeafProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig> = SlateRenderNodeProps<C> & RenderLeafProps<N>;
type SlateRenderNodeProps<C extends AnyPluginConfig = PluginConfig> = SlatePluginContext<C> & {
    attributes?: AnyObject;
    className?: string;
    /** @see {@link NodeProps} */
    nodeProps?: AnyObject;
};
type SlateRenderTextProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig> = SlateRenderNodeProps<C> & RenderTextProps<N>;

type AnyEditorPlugin = EditorPlugin<AnyPluginConfig>;
type AnySlatePlugin = SlatePlugin<AnyPluginConfig>;
/**
 * Property used by Plate to decorate editor ranges. If the function returns
 * undefined then no ranges are modified. If the function returns an array the
 * returned ranges are merged with the ranges called by other plugins.
 */
type Decorate<C extends AnyPluginConfig = PluginConfig> = (ctx: SlatePluginContext<C> & {
    entry: NodeEntry;
}) => DecoratedRange[] | undefined;
type Deserializer<C extends AnyPluginConfig = PluginConfig> = BaseDeserializer & {
    parse?: (options: AnyObject & SlatePluginContext<C> & {
        element: any;
    }) => Partial<Descendant> | undefined | void;
    query?: (options: AnyObject & SlatePluginContext<C> & {
        element: any;
    }) => boolean;
};
type EditorPlugin<C extends AnyPluginConfig = PluginConfig> = Omit<SlatePlugin<C>, keyof SlatePluginMethods | 'override' | 'plugins'>;
/** Plate plugin overriding the `editor` methods. Naming convention is `with*`. */
type ExtendEditor<C extends AnyPluginConfig = PluginConfig> = (ctx: SlatePluginContext<C>) => SlateEditor;
type ExtendEditorApi<C extends AnyPluginConfig = PluginConfig, EA = {}> = (ctx: SlatePluginContext<C>) => EA & Deep2Partial<EditorApi> & {
    [K in keyof InferApi<C>]?: InferApi<C>[K] extends (...args: any[]) => any ? (...args: Parameters<InferApi<C>[K]>) => ReturnType<InferApi<C>[K]> : InferApi<C>[K] extends Record<string, (...args: any[]) => any> ? {
        [N in keyof InferApi<C>[K]]?: (...args: Parameters<InferApi<C>[K][N]>) => ReturnType<InferApi<C>[K][N]>;
    } : never;
};
type ExtendEditorTransforms<C extends AnyPluginConfig = PluginConfig, EA = {}> = (ctx: SlatePluginContext<C>) => EA & Deep2Partial<EditorTransforms> & {
    [K in keyof InferTransforms<C>]?: InferTransforms<C>[K] extends (...args: any[]) => any ? (...args: Parameters<InferTransforms<C>[K]>) => ReturnType<InferTransforms<C>[K]> : InferTransforms<C>[K] extends Record<string, (...args: any[]) => any> ? {
        [N in keyof InferTransforms<C>[K]]?: (...args: Parameters<InferTransforms<C>[K][N]>) => ReturnType<InferTransforms<C>[K][N]>;
    } : never;
};
type HtmlDeserializer<C extends AnyPluginConfig = PluginConfig> = BaseHtmlDeserializer & {
    /**
     * Whether to disable the default node props parsing logic. By default, all
     * data-slate-* attributes will be parsed into node props.
     *
     * @default false
     */
    disableDefaultNodeProps?: boolean;
    parse?: (options: SlatePluginContext<C> & {
        element: HTMLElement;
        node: AnyObject;
    }) => Partial<Descendant> | undefined | void;
    query?: (options: SlatePluginContext<C> & {
        element: HTMLElement;
    }) => boolean;
    toNodeProps?: (options: SlatePluginContext<C> & {
        element: HTMLElement;
    }) => Partial<Descendant> | undefined | void;
};
type HtmlSerializer<C extends AnyPluginConfig = PluginConfig> = BaseSerializer & {
    parse?: (options: SlatePluginContext<C> & {
        node: Descendant;
    }) => string;
    query?: (options: SlatePluginContext<C> & {
        node: Descendant;
    }) => boolean;
};
type InferConfig<P> = P extends SlatePlugin<infer C> ? C : never;
type InjectNodeProps<C extends AnyPluginConfig = PluginConfig> = BaseInjectProps & {
    query?: (options: NonNullable<NonNullable<InjectNodeProps>> & SlatePluginContext<C> & {
        nodeProps: GetInjectNodePropsOptions;
    }) => boolean;
    transformClassName?: (options: TransformOptions<C>) => any;
    transformNodeValue?: (options: TransformOptions<C>) => any;
    transformProps?: (options: TransformOptions<C> & {
        props: GetInjectNodePropsReturnType;
    }) => AnyObject | undefined;
    transformStyle?: (options: TransformOptions<C>) => CSSStyleDeclaration;
};
type LeafStaticProps<C extends AnyPluginConfig = PluginConfig> = ((props: SlateRenderLeafProps<TText, C>) => AnyObject | undefined) | AnyObject;
type NodeStaticProps<C extends AnyPluginConfig = PluginConfig> = ((props: SlateRenderElementProps<TElement, C> & SlateRenderLeafProps<TText, C>) => AnyObject | undefined) | AnyObject;
/** @deprecated Use {@link RenderStaticNodeWrapper} instead. */
type NodeStaticWrapperComponent<C extends AnyPluginConfig = PluginConfig> = (props: NodeStaticWrapperComponentProps<C>) => NodeStaticWrapperComponentReturnType<C>;
/** @deprecated Use {@link RenderStaticNodeWrapperProps} instead. */
interface NodeStaticWrapperComponentProps<C extends AnyPluginConfig = PluginConfig> extends SlateRenderElementProps<TElement, C> {
    key: string;
}
/** @deprecated Use {@link RenderStaticNodeWrapperFunction} instead. */
type NodeStaticWrapperComponentReturnType<C extends AnyPluginConfig = PluginConfig> = React.FC<SlateRenderElementProps<TElement, C>> | undefined;
type NormalizeInitialValue<C extends AnyPluginConfig = PluginConfig> = (ctx: SlatePluginContext<C> & {
    value: Value;
}) => void;
type OverrideEditor<C extends AnyPluginConfig = PluginConfig> = (ctx: SlatePluginContext<C>) => {
    api?: Deep2Partial<EditorApi> & {
        [K in keyof InferApi<C>]?: InferApi<C>[K] extends (...args: any[]) => any ? (...args: Parameters<InferApi<C>[K]>) => ReturnType<InferApi<C>[K]> : InferApi<C>[K] extends Record<string, (...args: any[]) => any> ? {
            [N in keyof InferApi<C>[K]]?: (...args: Parameters<InferApi<C>[K][N]>) => ReturnType<InferApi<C>[K][N]>;
        } : never;
    };
    transforms?: Deep2Partial<EditorTransforms> & {
        [K in keyof InferTransforms<C>]?: InferTransforms<C>[K] extends (...args: any[]) => any ? (...args: Parameters<InferTransforms<C>[K]>) => ReturnType<InferTransforms<C>[K]> : InferTransforms<C>[K] extends Record<string, (...args: any[]) => any> ? {
            [N in keyof InferTransforms<C>[K]]?: (...args: Parameters<InferTransforms<C>[K][N]>) => ReturnType<InferTransforms<C>[K][N]>;
        } : never;
    };
};
type Parser<C extends AnyPluginConfig = PluginConfig> = {
    format?: string[] | string;
    mimeTypes?: string[];
    deserialize?: (options: ParserOptions & SlatePluginContext<C>) => Descendant[] | undefined;
    preInsert?: (options: ParserOptions & SlatePluginContext<C> & {
        fragment: Descendant[];
    }) => HandlerReturnType;
    query?: (options: ParserOptions & SlatePluginContext<C>) => boolean;
    transformData?: (options: ParserOptions & SlatePluginContext<C>) => string;
    transformFragment?: (options: ParserOptions & SlatePluginContext<C> & {
        fragment: Descendant[];
    }) => Descendant[];
};
type PartialEditorPlugin<C extends AnyPluginConfig = PluginConfig> = Omit<Partial<EditorPlugin<C>>, 'node'> & {
    node?: Partial<EditorPlugin<C>['node']>;
};
type RenderStaticNodeWrapper<C extends AnyPluginConfig = PluginConfig> = (props: RenderStaticNodeWrapperProps<C>) => RenderStaticNodeWrapperFunction;
type RenderStaticNodeWrapperFunction = ((hocProps: SlateRenderElementProps) => React.ReactNode) | undefined;
interface RenderStaticNodeWrapperProps<C extends AnyPluginConfig = PluginConfig> extends SlateRenderElementProps<TElement, C> {
    key: string;
}
type Serializer<C extends AnyPluginConfig = PluginConfig> = BaseSerializer & {
    parse?: (options: AnyObject & SlatePluginContext<C> & {
        node: Descendant;
    }) => any;
    query?: (options: AnyObject & SlatePluginContext<C> & {
        node: Descendant;
    }) => boolean;
};
/** The `PlatePlugin` interface is a base interface for all plugins. */
type SlatePlugin<C extends AnyPluginConfig = PluginConfig> = BasePlugin<C> & Nullable<{
    decorate?: Decorate<WithAnyKey<C>>;
    extendEditor?: ExtendEditor<WithAnyKey<C>>;
    normalizeInitialValue?: NormalizeInitialValue<WithAnyKey<C>>;
}> & SlatePluginMethods<C> & {
    handlers: Nullable<{}>;
    inject: Nullable<{
        nodeProps?: InjectNodeProps<WithAnyKey<C>>;
        plugins?: Record<string, PartialEditorPlugin<AnyPluginConfig>>;
        targetPluginToInject?: (ctx: SlatePluginContext<C> & {
            targetPlugin: string;
        }) => Partial<SlatePlugin<AnyPluginConfig>>;
    }>;
    node: {
        /** Override `data-slate-leaf` element attributes */
        leafProps?: LeafStaticProps<WithAnyKey<C>>;
        /** Override node attributes */
        props?: NodeStaticProps<WithAnyKey<C>>;
        /** Override `data-slate-node="text"` element attributes */
        textProps?: TextStaticProps<WithAnyKey<C>>;
    };
    override: {
        plugins?: Record<string, PartialEditorPlugin<AnyPluginConfig>>;
    };
    parser: Nullable<Parser<WithAnyKey<C>>>;
    parsers: (Record<string, {
        deserializer?: Deserializer<WithAnyKey<C>>;
        serializer?: Serializer<WithAnyKey<C>>;
    }> & {
        html?: never;
    }) | {
        html?: Nullable<{
            deserializer?: HtmlDeserializer<WithAnyKey<C>>;
            serializer?: HtmlSerializer<WithAnyKey<C>>;
        }>;
    };
    render: Nullable<{
        /**
         * When other plugins' `node` components are rendered, this function can
         * return an optional wrapper function that turns a `node`'s props to a
         * wrapper React node as its parent. Useful for wrapping or decorating
         * nodes with additional UI elements.
         *
         * NOTE: The function can run React hooks. NOTE: Do not run React hooks
         * in the wrapper function. It is not equivalent to a React component.
         */
        aboveNodes?: RenderStaticNodeWrapper<WithAnyKey<C>>;
        /**
         * When other plugins' `node` components are rendered, this function can
         * return an optional wrapper function that turns a `node`'s props to a
         * wrapper React node. The wrapper node is the `node`'s child and its
         * original children's parent. Useful for wrapping or decorating nodes
         * with additional UI elements.
         *
         * NOTE: The function can run React hooks. NOTE: Do not run React hooks
         * in the wrapper function. It is not equivalent to a React component.
         */
        belowNodes?: RenderStaticNodeWrapper<WithAnyKey<C>>;
        /**
         * Renders a component after the `Editable` component. This is the last
         * render position within the editor structure.
         */
        afterEditable?: () => React.ReactElement<any> | null;
        /** Renders a component before the `Editable` component. */
        beforeEditable?: () => React.ReactElement<any> | null;
    }>;
    shortcuts: {};
};
type SlatePluginConfig<K extends string = any, O = {}, A = {}, T = {}, S = {}, EO = {}, EA = {}, ET = {}, ES = {}> = Partial<Omit<SlatePlugin<PluginConfig<K, Partial<O>, A, T, S>>, keyof SlatePluginMethods | 'api' | 'node' | 'optionsStore' | 'transforms'> & {
    api: EA;
    node: Partial<SlatePlugin['node']>;
    options: EO;
    selectors: ES;
    transforms: ET;
}>;
type SlatePluginContext<C extends AnyPluginConfig = PluginConfig> = BasePluginContext<C> & {
    editor: SlateEditor;
    plugin: EditorPlugin<C>;
};
type SlatePluginMethods<C extends AnyPluginConfig = PluginConfig> = {
    __apiExtensions: ((ctx: SlatePluginContext<AnyPluginConfig>) => any)[];
    __configuration: ((ctx: SlatePluginContext<AnyPluginConfig>) => any) | null;
    __extensions: ((ctx: SlatePluginContext<AnyPluginConfig>) => any)[];
    __selectorExtensions: ((ctx: SlatePluginContext<AnyPluginConfig>) => any)[];
    clone: () => SlatePlugin<C>;
    configure: (config: ((ctx: SlatePluginContext<C>) => SlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>>) | SlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>>) => SlatePlugin<C>;
    configurePlugin: <P extends AnySlatePlugin>(plugin: Partial<P>, config: ((ctx: SlatePluginContext<P>) => SlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>>) | SlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>>) => SlatePlugin<C>;
    extend: <EO = {}, EA = {}, ET = {}, ES = {}>(extendConfig: ((ctx: SlatePluginContext<C>) => SlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>, EO, EA, ET, ES>) | SlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>, EO, EA, ET, ES>) => SlatePlugin<PluginConfig<C['key'], EO & InferOptions<C>, EA & InferApi<C>, ET & InferTransforms<C>, ES & InferSelectors<C>>>;
    extendApi: <EA extends Record<string, (...args: any[]) => any> = Record<string, never>>(extension: (ctx: SlatePluginContext<C>) => EA) => SlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C> & Record<C['key'], EA>, InferTransforms<C>, InferSelectors<C>>>;
    extendEditorApi: <EA extends Record<string, ((...args: any[]) => any) | Record<string, (...args: any[]) => any>> = Record<string, never>>(extension: ExtendEditorApi<C, EA>) => SlatePlugin<PluginConfig<C['key'], InferOptions<C>, {
        [K in keyof (EA & InferApi<C>)]: (EA & InferApi<C>)[K] extends (...args: any[]) => any ? (EA & InferApi<C>)[K] : {
            [N in keyof (EA & InferApi<C>)[K]]: (EA & InferApi<C>)[K][N];
        };
    }, InferTransforms<C>, InferSelectors<C>>>;
    extendEditorTransforms: <ET extends Record<string, ((...args: any[]) => any) | Record<string, (...args: any[]) => any>> = Record<string, never>>(extension: ExtendEditorTransforms<C, ET>) => SlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C>, {
        [K in keyof (ET & InferTransforms<C>)]: (ET & InferTransforms<C>)[K] extends (...args: any[]) => any ? (ET & InferTransforms<C>)[K] : {
            [N in keyof (ET & InferTransforms<C>)[K]]: (ET & InferTransforms<C>)[K][N];
        };
    }, InferSelectors<C>>>;
    extendPlugin: <P extends AnySlatePlugin, EO = {}, EA = {}, ET = {}, ES = {}>(plugin: Partial<P>, extendConfig: ((ctx: SlatePluginContext<P>) => SlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>, EO, EA, ET, ES>) | SlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>, EO, EA, ET, ES>) => SlatePlugin<C>;
    extendSelectors: <ES extends Record<string, (...args: any[]) => any> = Record<string, never>>(extension: (ctx: SlatePluginContext<C>) => ES) => SlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, ES & InferSelectors<C>>>;
    extendTransforms: <ET extends Record<string, (...args: any[]) => any> = Record<string, never>>(extension: (ctx: SlatePluginContext<C>) => ET) => SlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C> & Record<C['key'], ET>, InferSelectors<C>>>;
    overrideEditor: (override: OverrideEditor<C>) => SlatePlugin<C>;
    __resolved?: boolean;
};
type SlatePlugins = AnySlatePlugin[];
type TextStaticProps<C extends AnyPluginConfig = PluginConfig> = ((props: SlateRenderTextProps<TText, C>) => AnyObject | undefined) | AnyObject;
type TransformOptions<C extends AnyPluginConfig = PluginConfig> = BaseTransformOptions & SlatePluginContext<C>;

interface WithAutoScrollOptions {
    mode?: ScrollMode;
    operations?: AutoScrollOperationsMap;
    scrollOptions?: ScrollIntoViewOptions;
}
declare const withScrolling: (editor: SlateEditor, fn: () => void, options?: WithAutoScrollOptions) => void;

declare const AUTO_SCROLL: WeakMap<SlateEditor, boolean>;
type AutoScrollOperationsMap = Partial<Record<Operation['type'], boolean>>;
type DomConfig = PluginConfig<'dom', {
    /** Choose the first or last matching operation as the scroll target */
    scrollMode?: ScrollMode;
    /**
     * Operations map; false to disable an operation, true or undefined to
     * enable
     */
    scrollOperations?: AutoScrollOperationsMap;
    /** Options passed to scrollIntoView */
    scrollOptions?: ScrollIntoViewOptions;
}>;
/** Mode for picking target op when multiple enabled */
type ScrollMode = 'first' | 'last';
/**
 * Placeholder plugin for DOM interaction, that could be replaced with
 * ReactPlugin.
 */
declare const DOMPlugin: SlatePlugin<PluginConfig<"dom", {
    /** Choose the first or last matching operation as the scroll target */
    scrollMode?: ScrollMode;
    /**
     * Operations map; false to disable an operation, true or undefined to
     * enable
     */
    scrollOperations?: AutoScrollOperationsMap;
    /** Options passed to scrollIntoView */
    scrollOptions?: ScrollIntoViewOptions;
}, {
    isScrolling: () => boolean;
}, {
    withScrolling: (fn: () => void, options?: WithAutoScrollOptions | undefined) => void;
}, {}>>;

type InitOptions = Pick<CreateSlateEditorOptions, 'autoSelect' | 'selection' | 'shouldNormalizeEditor' | 'value'>;
/** Opinionated extension of slate default behavior. */
declare const SlateExtensionPlugin: SlatePlugin<PluginConfig<"slateExtension", {}, {}, {
    init: ({ autoSelect, selection, shouldNormalizeEditor, value, }: InitOptions) => Promise<void>;
    setValue: <V extends Value>(value?: V | string) => void;
}, {}>>;

type DebugErrorType = (string & {}) | 'DEFAULT' | 'OPTION_UNDEFINED' | 'OVERRIDE_MISSING' | 'PLUGIN_DEPENDENCY_MISSING' | 'PLUGIN_MISSING' | 'USE_CREATE_PLUGIN' | 'USE_ELEMENT_CONTEXT';
type LogLevel = 'error' | 'info' | 'log' | 'warn';
declare class PlateError extends Error {
    type: DebugErrorType;
    constructor(message: string, type?: DebugErrorType);
}
declare const DebugPlugin: SlatePlugin<PluginConfig<"debug", {
    isProduction: boolean;
    logger: Partial<Record<LogLevel, (message: string, type?: DebugErrorType, details?: any) => void>>;
    logLevel: LogLevel;
    throwErrors: boolean;
}, {
    debug: {
        error: (message: string | unknown, type?: DebugErrorType, details?: any) => void;
        info: (message: string, type?: DebugErrorType, details?: any) => void;
        log: (message: string, type?: DebugErrorType, details?: any) => void;
        warn: (message: string, type?: DebugErrorType, details?: any) => void;
    };
}, {}, {}>>;

type CorePlugin = ReturnType<typeof getCorePlugins>[number];
type GetCorePluginsOptions = {
    /** Specifies the maximum number of characters allowed in the editor. */
    maxLength?: number;
    /** Override the core plugins using the same key. */
    plugins?: AnyPluginConfig[];
};
declare const getCorePlugins: ({ maxLength, plugins, }: GetCorePluginsOptions) => (SlatePlugin<DebugConfig> | SlatePlugin<PluginConfig<"p", {}, {}, {}, {}>> | SlatePlugin<PluginConfig<"slateExtension", {}, {}, {
    init: ({ autoSelect, selection, shouldNormalizeEditor, value, }: InitOptions) => Promise<void>;
    setValue: <V extends _udecode_slate.Value>(value?: V | string) => void;
}, {}>> | SlatePlugin<PluginConfig<"dom", {
    scrollMode?: ScrollMode;
    scrollOperations?: AutoScrollOperationsMap;
    scrollOptions?: _udecode_slate.ScrollIntoViewOptions;
}, {
    isScrolling: () => boolean;
}, {
    withScrolling: (fn: () => void, options?: WithAutoScrollOptions | undefined) => void;
}, {}>> | SlatePlugin<PluginConfig<"history", {}, {}, {}, {}>> | SlatePlugin<PluginConfig<"inlineVoid", {}, {}, {}, {}>> | SlatePlugin<PluginConfig<"parser", {}, {}, {}, {}>> | SlatePlugin<LengthConfig> | SlatePlugin<PluginConfig<"html", {}, Record<"html", {
    deserialize: (args_0: {
        element: HTMLElement | string;
        collapseWhiteSpace?: boolean;
        defaultElementPlugin?: WithRequiredKey;
    }) => _udecode_slate.Descendant[];
}>, {}, {}>> | SlatePlugin<PluginConfig<"ast", {}, {}, {}, {}>>)[];
type DebugConfig = PluginConfig<'debug', {
    isProduction: boolean;
    logger: Partial<Record<LogLevel, LogFunction>>;
    logLevel: LogLevel;
    throwErrors: boolean;
}, {
    debug: {
        error: (message: string | unknown, type?: DebugErrorType, details?: any) => void;
        info: (message: string, type?: DebugErrorType, details?: any) => void;
        log: (message: string, type?: DebugErrorType, details?: any) => void;
        warn: (message: string, type?: DebugErrorType, details?: any) => void;
    };
}>;
type LengthConfig = PluginConfig<'length', {
    maxLength: number;
}>;
type LogFunction = (message: string, type?: DebugErrorType, details?: any) => void;

type BaseEditor = EditorBase & {
    key: any;
    currentKeyboardEvent: KeyboardEventLike | null;
    /**
     * Whether the editor is a fallback editor.
     *
     * @default false
     * @see {@link createPlateFallbackEditor}
     */
    isFallback: boolean;
    pluginList: any[];
    plugins: Record<string, any>;
    prevSelection: TRange | null;
    setOptions: {
        <C extends AnyPluginConfig>(plugin: WithRequiredKey<C>, options: (state: Draft<Partial<InferOptions<C>>>) => void): void;
        <C extends AnyPluginConfig>(plugin: WithRequiredKey<C>, options: Partial<InferOptions<C>>): void;
    };
    getInjectProps: <C extends AnyPluginConfig = PluginConfig>(plugin: WithRequiredKey<C>) => InjectNodeProps<C>;
    getOption: <C extends AnyPluginConfig, StateType extends InferOptions<C>, TSelectors extends InferSelectors<C>, K extends keyof StateType | keyof TSelectors | 'state'>(plugin: WithRequiredKey<C>, key: K, ...args: K extends keyof TSelectors ? Parameters<TSelectors[K]> : []) => K extends 'state' ? StateType : K extends keyof TSelectors ? ReturnType<TSelectors[K]> : K extends keyof StateType ? StateType[K] : never;
    getOptions: <C extends AnyPluginConfig = PluginConfig>(plugin: WithRequiredKey<C>) => InferOptions<C>;
    getOptionsStore: <C extends AnyPluginConfig>(plugin: WithRequiredKey<C>) => TStateApi<InferOptions<C>, [
        ['zustand/mutative-x', never]
    ], {}, InferSelectors<C>>;
    getPlugin: <C extends AnyPluginConfig = PluginConfig>(plugin: WithRequiredKey<C>) => C extends {
        node: any;
    } ? C : EditorPlugin<C>;
    getType: (plugin: WithRequiredKey) => string;
    setOption: <C extends AnyPluginConfig, K extends keyof InferOptions<C>>(plugin: WithRequiredKey<C>, optionKey: K, value: InferOptions<C>[K]) => void;
};
type InferPlugins<T extends AnyPluginConfig[]> = T[number];
type SlateEditor = BaseEditor & {
    api: EditorApi & UnionToIntersection<InferApi<CorePlugin>>;
    pluginList: AnyEditorPlugin[];
    plugins: Record<string, AnyEditorPlugin>;
    tf: EditorTransforms & UnionToIntersection<InferTransforms<CorePlugin>>;
    transforms: EditorTransforms & UnionToIntersection<InferTransforms<CorePlugin>>;
    getApi: <C extends AnyPluginConfig = PluginConfig>(plugin?: WithRequiredKey<C>) => SlateEditor['api'] & InferApi<C>;
    getTransforms: <C extends AnyPluginConfig = PluginConfig>(plugin?: WithRequiredKey<C>) => SlateEditor['tf'] & InferTransforms<C>;
};
type TSlateEditor<V extends Value = Value, P extends AnyPluginConfig = CorePlugin> = SlateEditor & {
    api: EditorApi<V> & UnionToIntersection<InferApi<CorePlugin | P>>;
    children: V;
    pluginList: P[];
    plugins: {
        [K in P['key']]: Extract<P, {
            key: K;
        }>;
    };
    tf: EditorTransforms<V> & UnionToIntersection<InferTransforms<CorePlugin | P>>;
    transforms: EditorTransforms<V> & UnionToIntersection<InferTransforms<CorePlugin | P>>;
    getApi: <C extends AnyPluginConfig = PluginConfig>(plugin?: WithRequiredKey<C>) => TSlateEditor<V>['api'] & InferApi<C>;
    getTransforms: <C extends AnyPluginConfig = PluginConfig>(plugin?: WithRequiredKey<C>) => TSlateEditor<V>['tf'] & InferTransforms<C>;
};

type BaseWithSlateOptions<P extends AnyPluginConfig = CorePlugin> = {
    id?: string;
    /**
     * Select the editor after initialization.
     *
     * @default false
     *
     * - `true` | 'end': Select the end of the editor
     * - `false`: Do not select anything
     * - `'start'`: Select the start of the editor
     */
    autoSelect?: boolean | 'end' | 'start';
    /** Specifies the maximum number of characters allowed in the editor. */
    maxLength?: number;
    plugins?: P[];
    selection?: TSelection;
    /**
     * When `true`, it will normalize the initial `value` passed to the `editor`.
     * This is useful when adding normalization rules on already existing
     * content.
     *
     * @default false
     */
    shouldNormalizeEditor?: boolean;
    /**
     * When `true`, skip the initial value, selection, and normalization logic.
     * Useful when the editor state is managed externally (e.g., Yjs).
     *
     * @default false
     */
    skipInitialization?: boolean;
};
type WithSlateOptions<V extends Value = Value, P extends AnyPluginConfig = CorePlugin> = BaseWithSlateOptions<P> & Pick<Partial<AnySlatePlugin>, 'api' | 'decorate' | 'extendEditor' | 'inject' | 'normalizeInitialValue' | 'options' | 'override' | 'transforms'> & {
    value?: ((editor: SlateEditor) => Promise<V> | V) | V | string | null;
    /** Function to configure the root plugin */
    rootPlugin?: (plugin: AnySlatePlugin) => AnySlatePlugin;
};
/**
 * Applies Plate enhancements to an editor instance (non-React version).
 *
 * @remarks
 *   This function supports server-side usage as it doesn't include the
 *   ReactPlugin.
 * @see {@link createSlateEditor} for a higher-level non-React editor creation function.
 * @see {@link createPlateEditor} for a higher-level React editor creation function.
 * @see {@link usePlateEditor} for a React memoized version.
 * @see {@link withPlate} for the React-specific enhancement function.
 */
declare const withSlate: <V extends Value = Value, P extends AnyPluginConfig = CorePlugin>(e: Editor, { id, autoSelect, maxLength, plugins, rootPlugin, selection, shouldNormalizeEditor, skipInitialization, value, ...pluginConfig }?: WithSlateOptions<V, P>) => TSlateEditor<V, InferPlugins<P[]>>;
type CreateSlateEditorOptions<V extends Value = Value, P extends AnyPluginConfig = CorePlugin> = WithSlateOptions<V, P> & {
    /**
     * Initial editor to be extended with `withPlate`.
     *
     * @default createEditor()
     */
    editor?: Editor;
};
/**
 * Creates a Slate editor without React-specific enhancements.
 *
 * @see {@link createPlateEditor} for a React-specific version of editor creation.
 * @see {@link usePlateEditor} for a memoized React version.
 * @see {@link withSlate} for the underlying function that applies Slate enhancements to an editor.
 */
declare const createSlateEditor: <V extends Value = Value, P extends AnyPluginConfig = CorePlugin>({ editor, ...options }?: CreateSlateEditorOptions<V, P>) => TSlateEditor<V, P>;

export { type InjectNodeProps as $, type AnyPluginConfig as A, type BaseEditor as B, type CreateSlateEditorOptions as C, type InferApi as D, type EditableProps as E, type InferOptions as F, type GetInjectNodePropsOptions as G, type HtmlDeserializer as H, type InferConfig as I, type InferSelectors as J, type InferTransforms as K, type LengthConfig as L, type NodeComponent as M, type NodeComponents as N, type OverrideEditor as O, type PluginConfig as P, type WithAnyKey as Q, type RenderElementProps as R, type SlateEditor as S, type TSlateEditor as T, type HandlerReturnType as U, type Decorate as V, type WithRequiredKey as W, type Deserializer as X, type ExtendEditorApi as Y, type ExtendEditorTransforms as Z, type HtmlSerializer as _, type SlatePlugin as a, type LeafStaticProps as a0, type NodeStaticProps as a1, type NodeStaticWrapperComponent as a2, type NodeStaticWrapperComponentProps as a3, type NodeStaticWrapperComponentReturnType as a4, type NormalizeInitialValue as a5, type Parser as a6, type PartialEditorPlugin as a7, type RenderStaticNodeWrapper as a8, type RenderStaticNodeWrapperFunction as a9, type SlateRenderTextProps as aA, type RenderElementFn as aB, type RenderLeafFn as aC, type RenderTextFn as aD, type RenderStaticNodeWrapperProps as aa, type Serializer as ab, type SlatePluginConfig as ac, type SlatePlugins as ad, type TextStaticProps as ae, type TransformOptions as af, type CorePlugin as ag, type GetCorePluginsOptions as ah, getCorePlugins as ai, type DebugConfig as aj, type DebugErrorType as ak, type LogLevel as al, PlateError as am, DebugPlugin as an, AUTO_SCROLL as ao, type AutoScrollOperationsMap as ap, type DomConfig as aq, type ScrollMode as ar, DOMPlugin as as, type WithAutoScrollOptions as at, withScrolling as au, type InitOptions as av, SlateExtensionPlugin as aw, type BoxStaticProps as ax, type SlateRenderElementProps as ay, type SlateRenderLeafProps as az, type SlatePluginMethods as b, type SlatePluginContext as c, type AnyEditorPlugin as d, type RenderLeafProps as e, type RenderTextProps as f, type SlateRenderNodeProps as g, type ExtendEditor as h, type EditorPlugin as i, type AnySlatePlugin as j, type ParserOptions as k, type InferPlugins as l, type BaseWithSlateOptions as m, type WithSlateOptions as n, createSlateEditor as o, type BaseDeserializer as p, type BaseHtmlDeserializer as q, type BaseInjectProps as r, type BasePlugin as s, type BasePluginContext as t, type BasePluginNode as u, type BaseSerializer as v, withSlate as w, type BaseTransformOptions as x, type ExtendConfig as y, type GetInjectNodePropsReturnType as z };
