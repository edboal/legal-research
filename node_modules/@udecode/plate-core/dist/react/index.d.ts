export { DefaultPlaceholder, Editable, RenderPlaceholderProps, Slate, useComposing, useFocused, useReadOnly, useSelected, withReact } from 'slate-react';
import * as React$1 from 'react';
import React__default, { HTMLAttributes } from 'react';
import { HotkeysOptions, Keys, HotkeysEvent } from '@udecode/react-hotkeys';
import * as _udecode_slate from '@udecode/slate';
import { Value, Editor, EditorApi, EditorTransforms, NodeEntry, DecoratedRange, TText, TElement, Descendant, ElementEntry, Path, TRange, ValueOf, TSelection, TNode } from '@udecode/slate';
import { Modify, UnionToIntersection, Nullable, Deep2Partial, AnyObject, UnknownObject } from '@udecode/utils';
import * as zustand_x from 'zustand-x';
import { TCreatedStoreType, TEqualityChecker } from 'zustand-x';
export { useStoreSelect, useStoreState, useStoreValue, useTracked, useTrackedStore } from 'zustand-x';
import { A as AnyPluginConfig, P as PluginConfig, U as HandlerReturnType, av as InitOptions, ar as ScrollMode, ap as AutoScrollOperationsMap, at as WithAutoScrollOptions, W as WithRequiredKey, a as SlatePlugin, F as InferOptions, D as InferApi, K as InferTransforms, J as InferSelectors, h as ExtendEditor$1, aq as DomConfig, ag as CorePlugin, m as BaseWithSlateOptions, l as InferPlugins, B as BaseEditor, s as BasePlugin, t as BasePluginContext, Q as WithAnyKey, j as AnySlatePlugin, ac as SlatePluginConfig, c as SlatePluginContext, M as NodeComponent, r as BaseInjectProps, G as GetInjectNodePropsOptions, x as BaseTransformOptions, z as GetInjectNodePropsReturnType, k as ParserOptions, p as BaseDeserializer, v as BaseSerializer, q as BaseHtmlDeserializer, E as EditableProps, aB as RenderElementFn, aC as RenderLeafFn, aD as RenderTextFn, e as RenderLeafProps, R as RenderElementProps, f as RenderTextProps } from '../withSlate-QBgDQMgy.js';
import * as jotai from 'jotai';
import { Atom } from 'jotai';
export { atom } from 'jotai';
import * as jotai_x from 'jotai-x';
import { JotaiStore } from 'jotai-x';
export { createAtomStore, useStoreAtomState, useStoreAtomValue, useStoreSetAtom } from 'jotai-x';
import 'mutative';
import 'is-hotkey';

declare function EditorHotkeysEffect({ id, editableRef, }: {
    editableRef: React__default.RefObject<HTMLDivElement | null>;
    id?: string;
}): React__default.JSX.Element;

declare const EditorMethodsEffect: ({ id }: {
    id?: string;
}) => null;

type DOMHandler<C extends AnyPluginConfig = PluginConfig, EV = {}> = (ctx: PlatePluginContext<C> & {
    event: EV;
}) => HandlerReturnType;
interface DOMHandlers<C extends AnyPluginConfig = PluginConfig> {
    onAbort?: DOMHandler<C, React__default.SyntheticEvent>;
    onAbortCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onAnimationEnd?: DOMHandler<C, React__default.AnimationEvent>;
    onAnimationEndCapture?: DOMHandler<C, React__default.AnimationEvent>;
    onAnimationIteration?: DOMHandler<C, React__default.AnimationEvent>;
    onAnimationIterationCapture?: DOMHandler<C, React__default.AnimationEvent>;
    onAnimationStart?: DOMHandler<C, React__default.AnimationEvent>;
    onAnimationStartCapture?: DOMHandler<C, React__default.AnimationEvent>;
    onAuxClick?: DOMHandler<C, React__default.MouseEvent>;
    onAuxClickCapture?: DOMHandler<C, React__default.MouseEvent>;
    onBeforeInput?: DOMHandler<C, React__default.FormEvent>;
    onBeforeInputCapture?: DOMHandler<C, React__default.FormEvent>;
    onBlur?: DOMHandler<C, React__default.FocusEvent>;
    onBlurCapture?: DOMHandler<C, React__default.FocusEvent>;
    onCanPlay?: DOMHandler<C, React__default.SyntheticEvent>;
    onCanPlayCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onCanPlayThrough?: DOMHandler<C, React__default.SyntheticEvent>;
    onCanPlayThroughCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onClick?: DOMHandler<C, React__default.MouseEvent>;
    onClickCapture?: DOMHandler<C, React__default.MouseEvent>;
    onCompositionEnd?: DOMHandler<C, React__default.CompositionEvent>;
    onCompositionEndCapture?: DOMHandler<C, React__default.CompositionEvent>;
    onCompositionStart?: DOMHandler<C, React__default.CompositionEvent>;
    onCompositionStartCapture?: DOMHandler<C, React__default.CompositionEvent>;
    onCompositionUpdate?: DOMHandler<C, React__default.CompositionEvent>;
    onCompositionUpdateCapture?: DOMHandler<C, React__default.CompositionEvent>;
    onContextMenu?: DOMHandler<C, React__default.MouseEvent>;
    onContextMenuCapture?: DOMHandler<C, React__default.MouseEvent>;
    onCopy?: DOMHandler<C, React__default.ClipboardEvent>;
    onCopyCapture?: DOMHandler<C, React__default.ClipboardEvent>;
    onCut?: DOMHandler<C, React__default.ClipboardEvent>;
    onCutCapture?: DOMHandler<C, React__default.ClipboardEvent>;
    onDOMBeforeInput?: DOMHandler<C, Event>;
    onDoubleClick?: DOMHandler<C, React__default.MouseEvent>;
    onDoubleClickCapture?: DOMHandler<C, React__default.MouseEvent>;
    onDrag?: DOMHandler<C, React__default.DragEvent>;
    onDragCapture?: DOMHandler<C, React__default.DragEvent>;
    onDragEnd?: DOMHandler<C, React__default.DragEvent>;
    onDragEndCapture?: DOMHandler<C, React__default.DragEvent>;
    onDragEnter?: DOMHandler<C, React__default.DragEvent>;
    onDragEnterCapture?: DOMHandler<C, React__default.DragEvent>;
    onDragExit?: DOMHandler<C, React__default.DragEvent>;
    onDragExitCapture?: DOMHandler<C, React__default.DragEvent>;
    onDragLeave?: DOMHandler<C, React__default.DragEvent>;
    onDragLeaveCapture?: DOMHandler<C, React__default.DragEvent>;
    onDragOver?: DOMHandler<C, React__default.DragEvent>;
    onDragOverCapture?: DOMHandler<C, React__default.DragEvent>;
    onDragStart?: DOMHandler<C, React__default.DragEvent>;
    onDragStartCapture?: DOMHandler<C, React__default.DragEvent>;
    onDrop?: DOMHandler<C, React__default.DragEvent>;
    onDropCapture?: DOMHandler<C, React__default.DragEvent>;
    onDurationChange?: DOMHandler<C, React__default.SyntheticEvent>;
    onDurationChangeCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onEmptied?: DOMHandler<C, React__default.SyntheticEvent>;
    onEmptiedCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onEncrypted?: DOMHandler<C, React__default.SyntheticEvent>;
    onEncryptedCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onEnded?: DOMHandler<C, React__default.SyntheticEvent>;
    onEndedCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onFocus?: DOMHandler<C, React__default.FocusEvent>;
    onFocusCapture?: DOMHandler<C, React__default.FocusEvent>;
    onGotPointerCapture?: DOMHandler<C, React__default.PointerEvent>;
    onGotPointerCaptureCapture?: DOMHandler<C, React__default.PointerEvent>;
    onInput?: DOMHandler<C, React__default.FormEvent>;
    onInputCapture?: DOMHandler<C, React__default.FormEvent>;
    onInvalid?: DOMHandler<C, React__default.FormEvent>;
    onInvalidCapture?: DOMHandler<C, React__default.FormEvent>;
    onKeyDown?: DOMHandler<C, React__default.KeyboardEvent>;
    onKeyDownCapture?: DOMHandler<C, React__default.KeyboardEvent>;
    onKeyPress?: DOMHandler<C, React__default.KeyboardEvent>;
    onKeyPressCapture?: DOMHandler<C, React__default.KeyboardEvent>;
    onKeyUp?: DOMHandler<C, React__default.KeyboardEvent>;
    onKeyUpCapture?: DOMHandler<C, React__default.KeyboardEvent>;
    onLoad?: DOMHandler<C, React__default.SyntheticEvent>;
    onLoadCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onLoadedData?: DOMHandler<C, React__default.SyntheticEvent>;
    onLoadedDataCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onLoadedMetadata?: DOMHandler<C, React__default.SyntheticEvent>;
    onLoadedMetadataCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onLoadStart?: DOMHandler<C, React__default.SyntheticEvent>;
    onLoadStartCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onLostPointerCapture?: DOMHandler<C, React__default.PointerEvent>;
    onLostPointerCaptureCapture?: DOMHandler<C, React__default.PointerEvent>;
    onMouseDown?: DOMHandler<C, React__default.MouseEvent>;
    onMouseDownCapture?: DOMHandler<C, React__default.MouseEvent>;
    onMouseEnter?: DOMHandler<C, React__default.MouseEvent>;
    onMouseLeave?: DOMHandler<C, React__default.MouseEvent>;
    onMouseMove?: DOMHandler<C, React__default.MouseEvent>;
    onMouseMoveCapture?: DOMHandler<C, React__default.MouseEvent>;
    onMouseOut?: DOMHandler<C, React__default.MouseEvent>;
    onMouseOutCapture?: DOMHandler<C, React__default.MouseEvent>;
    onMouseOver?: DOMHandler<C, React__default.MouseEvent>;
    onMouseOverCapture?: DOMHandler<C, React__default.MouseEvent>;
    onMouseUp?: DOMHandler<C, React__default.MouseEvent>;
    onMouseUpCapture?: DOMHandler<C, React__default.MouseEvent>;
    onPaste?: DOMHandler<C, React__default.ClipboardEvent>;
    onPasteCapture?: DOMHandler<C, React__default.ClipboardEvent>;
    onPause?: DOMHandler<C, React__default.SyntheticEvent>;
    onPauseCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onPlay?: DOMHandler<C, React__default.SyntheticEvent>;
    onPlayCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onPlaying?: DOMHandler<C, React__default.SyntheticEvent>;
    onPlayingCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onPointerCancel?: DOMHandler<C, React__default.PointerEvent>;
    onPointerCancelCapture?: DOMHandler<C, React__default.PointerEvent>;
    onPointerDown?: DOMHandler<C, React__default.PointerEvent>;
    onPointerDownCapture?: DOMHandler<C, React__default.PointerEvent>;
    onPointerEnter?: DOMHandler<C, React__default.PointerEvent>;
    onPointerLeave?: DOMHandler<C, React__default.PointerEvent>;
    onPointerMove?: DOMHandler<C, React__default.PointerEvent>;
    onPointerMoveCapture?: DOMHandler<C, React__default.PointerEvent>;
    onPointerOut?: DOMHandler<C, React__default.PointerEvent>;
    onPointerOutCapture?: DOMHandler<C, React__default.PointerEvent>;
    onPointerOver?: DOMHandler<C, React__default.PointerEvent>;
    onPointerOverCapture?: DOMHandler<C, React__default.PointerEvent>;
    onPointerUp?: DOMHandler<C, React__default.PointerEvent>;
    onPointerUpCapture?: DOMHandler<C, React__default.PointerEvent>;
    onProgress?: DOMHandler<C, React__default.SyntheticEvent>;
    onProgressCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onRateChange?: DOMHandler<C, React__default.SyntheticEvent>;
    onRateChangeCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onReset?: DOMHandler<C, React__default.FormEvent>;
    onResetCapture?: DOMHandler<C, React__default.FormEvent>;
    onScroll?: DOMHandler<C, React__default.UIEvent>;
    onScrollCapture?: DOMHandler<C, React__default.UIEvent>;
    onSeeked?: DOMHandler<C, React__default.SyntheticEvent>;
    onSeekedCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onSeeking?: DOMHandler<C, React__default.SyntheticEvent>;
    onSeekingCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onSelect?: DOMHandler<C, React__default.SyntheticEvent>;
    onSelectCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onStalled?: DOMHandler<C, React__default.SyntheticEvent>;
    onStalledCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onSubmit?: DOMHandler<C, React__default.FormEvent>;
    onSubmitCapture?: DOMHandler<C, React__default.FormEvent>;
    onSuspend?: DOMHandler<C, React__default.SyntheticEvent>;
    onSuspendCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onTimeUpdate?: DOMHandler<C, React__default.SyntheticEvent>;
    onTimeUpdateCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onTouchCancel?: DOMHandler<C, React__default.TouchEvent>;
    onTouchCancelCapture?: DOMHandler<C, React__default.TouchEvent>;
    onTouchEnd?: DOMHandler<C, React__default.TouchEvent>;
    onTouchEndCapture?: DOMHandler<C, React__default.TouchEvent>;
    onTouchMove?: DOMHandler<C, React__default.TouchEvent>;
    onTouchMoveCapture?: DOMHandler<C, React__default.TouchEvent>;
    onTouchStart?: DOMHandler<C, React__default.TouchEvent>;
    onTouchStartCapture?: DOMHandler<C, React__default.TouchEvent>;
    onTransitionEnd?: DOMHandler<C, React__default.TransitionEvent>;
    onTransitionEndCapture?: DOMHandler<C, React__default.TransitionEvent>;
    onVolumeChange?: DOMHandler<C, React__default.SyntheticEvent>;
    onVolumeChangeCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onWaiting?: DOMHandler<C, React__default.SyntheticEvent>;
    onWaitingCapture?: DOMHandler<C, React__default.SyntheticEvent>;
    onWheel?: DOMHandler<C, React__default.WheelEvent>;
    onWheelCapture?: DOMHandler<C, React__default.WheelEvent>;
}

type KeyboardHandler<C extends AnyPluginConfig = PluginConfig> = DOMHandler<C, React__default.KeyboardEvent>;

type PlatePluginConfig$2<K extends string = any, O = {}, A = {}, T = {}, S = {}> = Omit<Partial<Modify<PlatePlugin<PluginConfig<K, O, A, T, S>>, {
    node: Partial<PlatePlugin<PluginConfig<K, O, A, T, S>>['node']>;
}>>, keyof PlatePluginMethods | 'optionsStore' | 'useOptionsStore'>;
type TPlatePluginConfig<C extends AnyPluginConfig = PluginConfig> = Omit<Partial<Modify<PlatePlugin<C>, {
    node: Partial<PlatePlugin<C>['node']>;
}>>, keyof PlatePluginMethods | 'optionsStore' | 'useOptionsStore'>;
declare const createPlatePlugin: <K extends string = any, O = {}, A = {}, T = {}, S = {}>(config?: ((editor: PlateEditor) => PlatePluginConfig$2<K, O, A, T, S>) | PlatePluginConfig$2<K, O, A, T, S>) => PlatePlugin<PluginConfig<K, O, A, T, S>>;
/**
 * Explicitly typed version of `createPlatePlugin`.
 *
 * @remarks
 *   While `createPlatePlugin` uses type inference, this function requires an
 *   explicit type parameter. Use this when you need precise control over the
 *   plugin's type structure or when type inference doesn't provide the desired
 *   result.
 */
declare function createTPlatePlugin<C extends AnyPluginConfig = PluginConfig>(config?: ((editor: PlateEditor) => TPlatePluginConfig<C>) | TPlatePluginConfig<C>): PlatePlugin<C>;

declare const getPlateCorePlugins: () => (PlatePlugin<PluginConfig<"slateExtension", {}, {
    redecorate: () => void;
}, {
    init: ({ autoSelect, selection, shouldNormalizeEditor, value, }: InitOptions) => Promise<void>;
    setValue: <V extends _udecode_slate.Value>(value?: V | string) => void;
}, {}>> | PlatePlugin<PluginConfig<"eventEditor", {}, {}, {}, {}>> | PlatePlugin<PluginConfig<"p", {}, {}, {}, {}>> | PlatePlugin<PluginConfig<"dom", {
    scrollMode?: ScrollMode;
    scrollOperations?: AutoScrollOperationsMap;
    scrollOptions?: _udecode_slate.ScrollIntoViewOptions;
}, {
    isScrolling: () => boolean;
}, {
    reset: (options: _udecode_slate.ResetOptions | undefined) => void;
    withScrolling: (fn: () => void, options?: WithAutoScrollOptions | undefined) => void;
}, {}>>)[];

/**
 * A memoized version of createPlateEditor for use in React components.
 *
 * @param {CreatePlateEditorOptions} options - Configuration options for
 *   creating the Plate editor.
 * @param {React.DependencyList} [deps=[]] - Additional dependencies for the
 *   useMemo hook, in addition to `options.id`. Default is `[]`
 * @see {@link createPlateEditor} for detailed information on React editor creation and configuration.
 * @see {@link createSlateEditor} for a non-React version of editor creation.
 * @see {@link withPlate} for the underlying React-specific enhancement function.
 */
declare function usePlateEditor<V extends Value = Value, P extends AnyPluginConfig = PlateCorePlugin, TEnabled extends boolean | undefined = undefined>(options?: CreatePlateEditorOptions<V, P> & {
    enabled?: TEnabled;
}, deps?: React__default.DependencyList): TEnabled extends false ? null : TEnabled extends true | undefined ? TPlateEditor<V, P> : TPlateEditor<V, P> | null;

declare function getEditorPlugin<P extends AnyPluginConfig | PlatePlugin<AnyPluginConfig>>(editor: PlateEditor, plugin: WithRequiredKey<P>): PlatePluginContext<InferConfig<P> extends never ? P : InferConfig<P>>;

/** Get editor plugin by key or plugin object. */
declare function getPlugin<C extends AnyPluginConfig = PluginConfig>(editor: PlateEditor, plugin: WithRequiredKey<C>): C extends {
    node: any;
} ? C : PlatePlugin<C>;

declare const omitPluginContext: <T extends PlatePluginContext<AnyPlatePlugin>>(ctx: T) => Omit<T, "api" | "type" | "setOptions" | "tf" | "getOption" | "getOptions" | "setOption" | "editor" | "plugin">;

type PlatePluginConfig$1<C extends AnyPluginConfig, EO = {}, EA = {}, ET = {}, ES = {}> = Omit<Partial<PlatePlugin<PluginConfig<C['key'], EO & InferOptions<C>, EA & InferApi<C>, ET & InferTransforms<C>, ES & InferSelectors<C>>>>, keyof PlatePluginMethods | 'api' | 'node' | 'options' | 'transforms'> & {
    api?: EA & Partial<InferApi<C>>;
    node?: Partial<PlatePlugin<C>['node']>;
    options?: EO & Partial<InferOptions<C>>;
    selectors?: ES & Partial<InferSelectors<C>>;
    transforms?: ET & Partial<InferTransforms<C>>;
};
/**
 * Extends a SlatePlugin to create a React PlatePlugin.
 *
 * @remarks
 *   This function transforms a SlatePlugin into a React PlatePlugin, allowing for
 *   React-specific functionality to be added.
 * @param basePlugin - The base SlatePlugin to be extended.
 * @param extendConfig - A function or object that provides the extension
 *   configuration. If a function, it receives the plugin context and should
 *   return a partial PlatePlugin. If an object, it should be a partial
 *   PlatePlugin configuration.
 * @returns A new PlatePlugin that combines the base SlatePlugin functionality
 *   with React-specific features defined in the extension configuration.
 */
declare function toPlatePlugin<C extends AnyPluginConfig, EO = {}, EA = {}, ET = {}, ES = {}>(basePlugin: SlatePlugin<C>, extendConfig?: ((ctx: PlatePluginContext<C>) => PlatePluginConfig$1<C, EO, EA, ET>) | PlatePluginConfig$1<C, EO, EA, ET>): PlatePlugin<PluginConfig<C['key'], EO & InferOptions<C>, EA & InferApi<C>, ET & InferTransforms<C>, ES & InferSelectors<C>>>;
type ExtendPluginConfig<C extends AnyPluginConfig = PluginConfig> = Omit<Partial<PlatePlugin<PluginConfig<C['key'], Partial<InferOptions<C>>, Partial<InferApi<C>>, Partial<InferTransforms<C>>>>>, keyof PlatePluginMethods>;
/**
 * Explicitly typed version of {@link toPlatePlugin}.
 *
 * @remarks
 *   This function requires explicit type parameters for both the base plugin
 *   configuration and the extension configuration. Use this when you need
 *   precise control over the plugin's type structure or when type inference
 *   doesn't provide the desired result.
 * @typeParam C - The type of the extension configuration for the PlatePlugin
 *   (required).
 * @typeParam TContext - The type of the base SlatePlugin configuration
 *   (optional).
 */
declare function toTPlatePlugin<C extends AnyPluginConfig = PluginConfig, TContext extends AnyPluginConfig = AnyPluginConfig>(basePlugin: SlatePlugin<TContext>, extendConfig?: ((ctx: PlatePluginContext<TContext>) => ExtendPluginConfig<C>) | ExtendPluginConfig<C>): PlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>>>;

declare const SlateReactExtensionPlugin: PlatePlugin<PluginConfig<"slateExtension", {}, {
    redecorate: () => void;
}, {
    init: ({ autoSelect, selection, shouldNormalizeEditor, value, }: InitOptions) => Promise<void>;
    setValue: <V extends _udecode_slate.Value>(value?: V | string) => void;
}, {}>>;

declare const EventEditorPlugin: PlatePlugin<PluginConfig<"eventEditor", {}, {}, {}, {}>>;

type EventEditorState = {
    /** Last editor id that has been blurred. */
    blur: string | null;
    /** Editor id that is currently being focused. */
    focus: string | null;
    /** Last editor id. */
    last: string | null;
};
/** Store where the keys are event names and the values are editor ids. */
declare const EventEditorStore: zustand_x.TStateApi<EventEditorState, [["zustand/mutative-x", never]], {}, {}>;
declare const useEventEditorValue: {
    <K extends keyof EventEditorState>(key: K): EventEditorState[K];
    <K extends never>(key: K, ...args: Parameters<{}[K]>): ReturnType<{}[K]>;
    (key: "state"): EventEditorState;
    <K extends keyof EventEditorState>(key: K, equalityFn?: zustand_x.TEqualityChecker<EventEditorState[K]> | undefined): EventEditorState[K];
    <K extends never>(key: K, ...args: [...Parameters<{}[K]>, (zustand_x.TEqualityChecker<ReturnType<{}[K]>> | undefined)?]): ReturnType<{}[K]>;
};

declare const getEventPlateId: (id?: string) => string;

declare const FOCUS_EDITOR_EVENT = "focus-editor-event";
declare const BLUR_EDITOR_EVENT = "blur-editor-event";
declare const useFocusEditorEvents: ({ editorRef, onEditorBlur, onEditorFocus, }: {
    editorRef: PlateEditor | null;
    onEditorBlur?: () => void;
    onEditorFocus?: () => void;
}) => void;

declare const ParagraphPlugin: PlatePlugin<PluginConfig<"p", {}, {}, {}, {}>>;

/** @see {@link withReact} */
declare const ReactPlugin: PlatePlugin<PluginConfig<"dom", {
    scrollMode?: ScrollMode;
    scrollOperations?: AutoScrollOperationsMap;
    scrollOptions?: _udecode_slate.ScrollIntoViewOptions;
}, {
    isScrolling: () => boolean;
}, {
    reset: (options: _udecode_slate.ResetOptions | undefined) => void;
    withScrolling: (fn: () => void, options?: WithAutoScrollOptions | undefined) => void;
}, {}>>;

declare const withPlateReact: ExtendEditor$1<DomConfig>;

type PlateCorePlugin = CorePlugin | typeof SlateReactExtensionPlugin;
type WithPlateOptions<V extends Value = Value, P extends AnyPluginConfig = PlateCorePlugin> = BaseWithSlateOptions<P> & Pick<Partial<AnyPlatePlugin>, 'api' | 'decorate' | 'extendEditor' | 'handlers' | 'inject' | 'normalizeInitialValue' | 'options' | 'override' | 'priority' | 'render' | 'shortcuts' | 'transforms' | 'useHooks'> & {
    /**
     * Specifies the component for each plugin key.
     *
     * @example
     *   const editor = createPlateEditor({
     *     plugins: [ParagraphPlugin, LinkPlugin],
     *     components: {
     *       [ParagraphPlugin.key]: ParagraphElement,
     *       [LinkPlugin.key]: LinkElement,
     *       // ...other components
     *     },
     *   });
     */
    components?: AnyPlatePlugin['override']['components'];
    value?: ((editor: PlateEditor) => V) | V | string;
    rootPlugin?: (plugin: AnyPlatePlugin) => AnyPlatePlugin;
};
/**
 * Applies Plate-specific enhancements to an editor instance with ReactPlugin.
 *
 * @see {@link createPlateEditor} for a higher-level React editor creation function.
 * @see {@link usePlateEditor} for a memoized version in React components.
 * @see {@link withSlate} for the non-React version of editor enhancement
 */
declare const withPlate: <V extends Value = Value, P extends AnyPluginConfig = PlateCorePlugin>(e: Editor, { plugins, ...options }?: WithPlateOptions<V, P>) => TPlateEditor<V, InferPlugins<P[]>>;
type CreatePlateEditorOptions<V extends Value = Value, P extends AnyPluginConfig = PlateCorePlugin> = WithPlateOptions<V, P> & {
    /**
     * Initial editor to be extended with `withPlate`.
     *
     * @default createEditor()
     */
    editor?: Editor;
};
/**
 * Creates a fully configured Plate editor with optional customizations.
 *
 * @remarks
 *   This function creates a Plate editor with the following enhancements and
 *   configurations:
 *
 *   1. Editor Initialization:
 *
 *   - Assigns a unique ID to the editor if not already present.
 *   - Extend editor state properties.
 *
 *   2. Plugin System:
 *
 *   - Integrates core plugins and user-provided plugins.
 *   - Creates a root plugin that encapsulates all other plugins.
 *   - Resolves plugins into editor.plugins, editor.pluginList.
 *
 *   3. Content Initialization:
 *
 *   - Sets initial editor content if provided.
 *   - Ensures the editor always has content by using a default factory if empty.
 *
 *   4. Selection Handling:
 *
 *   - Applies initial selection if provided.
 *   - Supports auto-selection at start or end of the document.
 *
 *   5. Normalization:
 *
 *   - Performs initial value normalization.
 *   - Optionally applies full editor normalization.
 *
 *   6. Extensibility:
 *
 *   - Allows for deep customization through plugins and overrides.
 *   - Supports custom editor types and configurations.
 *
 *   The resulting editor is a fully-initialized Plate instance, ready for use
 *   with Plate components and APIs, with all core functionalities and custom
 *   plugins applied.
 * @example
 *   const editor = createPlateEditor({
 *     plugins: [ParagraphPlugin, BoldPlugin],
 *     components: {
 *       [ParagraphPlugin.key]: CustomParagraphComponent,
 *     },
 *   });
 *
 * @template V - The value type.
 * @template P - The plugins type.
 * @see {@link createSlateEditor} for a non-React version of editor creation.
 *  * @see {@link usePlateEditor} for a memoized version, suitable for use in React components.
 *  * @see {@link withPlate} for the underlying function that applies Plate enhancements to an editor.
 *  * @see {@link withSlate} for a non-React version of editor enhancement.
 */
declare const createPlateEditor: <V extends Value = Value, P extends AnyPluginConfig = PlateCorePlugin>({ editor, ...options }?: CreatePlateEditorOptions<V, P>) => TPlateEditor<V, InferPlugins<P[]>>;

type PlateEditor = {
    api: EditorApi & UnionToIntersection<InferApi<PlateCorePlugin>>;
    pluginList: AnyEditorPlatePlugin[];
    plugins: Record<string, AnyEditorPlatePlugin>;
    shortcuts: Shortcuts;
    tf: EditorTransforms & UnionToIntersection<InferTransforms<PlateCorePlugin>>;
    transforms: EditorTransforms & UnionToIntersection<InferTransforms<PlateCorePlugin>>;
    getApi: <C extends AnyPluginConfig = PluginConfig>(plugin?: WithRequiredKey<C>) => PlateEditor['api'] & InferApi<C>;
    getPlugin: <C extends AnyPluginConfig = PluginConfig>(plugin: WithRequiredKey<C>) => C extends {
        node: any;
    } ? C : EditorPlatePlugin<C>;
    getTransforms: <C extends AnyPluginConfig = PluginConfig>(plugin?: WithRequiredKey<C>) => PlateEditor['tf'] & InferTransforms<C>;
    uid?: string;
} & BaseEditor;
type TPlateEditor<V extends Value = Value, P extends AnyPluginConfig = PlateCorePlugin> = PlateEditor & {
    api: EditorApi<V> & UnionToIntersection<InferApi<P | PlateCorePlugin>>;
    children: V;
    pluginList: P[];
    plugins: {
        [K in P['key']]: Extract<P, {
            key: K;
        }>;
    };
    tf: EditorTransforms<V> & UnionToIntersection<InferTransforms<P | PlateCorePlugin>>;
    transforms: EditorTransforms<V> & UnionToIntersection<InferTransforms<P | PlateCorePlugin>>;
    getApi: <C extends AnyPluginConfig = PluginConfig>(plugin?: WithRequiredKey<C>) => TPlateEditor<V>['api'] & InferApi<C>;
    getTransforms: <C extends AnyPluginConfig = PluginConfig>(plugin?: WithRequiredKey<C>) => TPlateEditor<V>['tf'] & InferTransforms<C>;
};

type AnyEditorPlatePlugin = EditorPlatePlugin<AnyPluginConfig>;
type AnyPlatePlugin = PlatePlugin<AnyPluginConfig>;
/**
 * Property used by Plate to decorate editor ranges. If the function returns
 * undefined then no ranges are modified. If the function returns an array the
 * returned ranges are merged with the ranges called by other plugins.
 */
type Decorate<C extends AnyPluginConfig = PluginConfig> = (ctx: PlatePluginContext<C> & {
    entry: NodeEntry;
}) => DecoratedRange[] | undefined;
type Deserializer<C extends AnyPluginConfig = PluginConfig> = BaseDeserializer & {
    parse?: (options: PlatePluginContext<C> & {
        element: any;
    }) => Partial<Descendant> | undefined | void;
    query?: (options: PlatePluginContext<C> & {
        element: any;
    }) => boolean;
};
type EditableSiblingComponent = (editableProps: EditableProps) => React__default.ReactElement<any> | null;
type EditorPlatePlugin<C extends AnyPluginConfig = PluginConfig> = Omit<PlatePlugin<C>, keyof PlatePluginMethods | 'override' | 'plugins'>;
/** Plate plugin overriding the `editor` methods. Naming convention is `with*`. */
type ExtendEditor<C extends AnyPluginConfig = PluginConfig> = (ctx: PlatePluginContext<C>) => PlateEditor;
type ExtendEditorApi<C extends AnyPluginConfig = PluginConfig, EA = {}> = (ctx: PlatePluginContext<C>) => EA & Deep2Partial<EditorApi> & {
    [K in keyof InferApi<C>]?: InferApi<C>[K] extends (...args: any[]) => any ? (...args: Parameters<InferApi<C>[K]>) => ReturnType<InferApi<C>[K]> : InferApi<C>[K] extends Record<string, (...args: any[]) => any> ? {
        [N in keyof InferApi<C>[K]]?: (...args: Parameters<InferApi<C>[K][N]>) => ReturnType<InferApi<C>[K][N]>;
    } : never;
};
type ExtendEditorTransforms<C extends AnyPluginConfig = PluginConfig, ET = {}> = (ctx: PlatePluginContext<C>) => ET & Deep2Partial<EditorTransforms> & {
    [K in keyof InferTransforms<C>]?: InferTransforms<C>[K] extends (...args: any[]) => any ? (...args: Parameters<InferTransforms<C>[K]>) => ReturnType<InferTransforms<C>[K]> : InferTransforms<C>[K] extends Record<string, (...args: any[]) => any> ? {
        [N in keyof InferTransforms<C>[K]]?: (...args: Parameters<InferTransforms<C>[K][N]>) => ReturnType<InferTransforms<C>[K][N]>;
    } : never;
};
type HtmlDeserializer<C extends AnyPluginConfig = PluginConfig> = BaseHtmlDeserializer & {
    parse?: (options: PlatePluginContext<C> & {
        element: HTMLElement;
        node: AnyObject;
    }) => Partial<Descendant> | undefined | void;
    query?: (options: PlatePluginContext<C> & {
        element: HTMLElement;
    }) => boolean;
};
type HtmlReactSerializer<C extends AnyPluginConfig = PluginConfig> = {
    parse?: React__default.FC<PlateElementProps<TElement, C> & PlateLeafProps<TText, C>>;
    query?: (options: PlateElementProps) => boolean;
};
type HtmlSerializer<C extends AnyPluginConfig = PluginConfig> = {
    parse?: (options: PlatePluginContext<C> & {
        node: Descendant;
    }) => string;
    query?: (options: PlatePluginContext<C> & {
        node: Descendant;
    }) => boolean;
};
type InferConfig<P> = P extends PlatePlugin<infer C> | SlatePlugin<infer C> ? C : never;
/** Properties used by Plate to inject props into any {@link NodeComponent}. */
type InjectNodeProps<C extends AnyPluginConfig = PluginConfig> = BaseInjectProps & {
    /** Whether to inject the props. If true, overrides all other checks. */
    query?: (options: NonNullable<NonNullable<InjectNodeProps>> & PlatePluginContext<C> & {
        nodeProps: GetInjectNodePropsOptions;
    }) => boolean;
    /**
     * Transform the className.
     *
     * @default clsx(className, classNames[value])
     */
    transformClassName?: (options: TransformOptions<C>) => any;
    /**
     * Transform the node value for the style or className.
     *
     * @default nodeValue
     */
    transformNodeValue?: (options: TransformOptions<C>) => any;
    /** Transform the injected props. */
    transformProps?: (options: TransformOptions<C> & {
        props: GetInjectNodePropsReturnType;
    }) => AnyObject | undefined;
    /**
     * Transform the style.
     *
     * @default { ...style, [styleKey]: value }
     */
    transformStyle?: (options: TransformOptions<C>) => CSSStyleDeclaration;
};
type LeafNodeProps<C extends AnyPluginConfig = PluginConfig> = ((props: PlateLeafProps<TText, C>) => AnyObject | undefined) | AnyObject;
/**
 * Property used by Plate to override node `component` props. If function, its
 * returning value will be shallow merged to the old props, with the old props
 * as parameter. If object, its value will be shallow merged to the old props.
 */
type NodeProps<C extends AnyPluginConfig = PluginConfig> = ((props: PlateElementProps<TElement, C> & PlateLeafProps<TText, C>) => AnyObject | undefined) | AnyObject;
/** @deprecated Use {@link RenderNodeWrapper} instead. */
type NodeWrapperComponent<C extends AnyPluginConfig = PluginConfig> = (props: NodeWrapperComponentProps<C>) => NodeWrapperComponentReturnType<C>;
/** @deprecated Use {@link RenderNodeWrapperProps} instead. */
interface NodeWrapperComponentProps<C extends AnyPluginConfig = PluginConfig> extends PlateElementProps<TElement, C> {
    key: string;
}
/** @deprecated Use {@link RenderNodeWrapperFunction} instead. */
type NodeWrapperComponentReturnType<C extends AnyPluginConfig = PluginConfig> = React__default.FC<PlateElementProps<TElement, C>> | undefined;
type NormalizeInitialValue<C extends AnyPluginConfig = PluginConfig> = (ctx: PlatePluginContext<C> & {
    value: Value;
}) => void;
/**
 * Function called whenever a change occurs in the editor. Return `false` to
 * prevent calling the next plugin handler.
 *
 * @see {@link SlatePropsOnChange}
 */
type OnChange<C extends AnyPluginConfig = PluginConfig> = (ctx: PlatePluginContext<C> & {
    value: Value;
}) => HandlerReturnType;
type OverrideEditor<C extends AnyPluginConfig = PluginConfig> = (ctx: PlatePluginContext<C>) => {
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
/**
 * Used by parser plugins like html to deserialize inserted data to a slate
 * fragment. The fragment will be inserted to the editor if not empty.
 */
type Parser<C extends AnyPluginConfig = PluginConfig> = {
    /** Format to get data. Example data types are text/plain and text/uri-list. */
    format?: string[] | string;
    mimeTypes?: string[];
    /** Deserialize data to fragment */
    deserialize?: (options: ParserOptions & PlatePluginContext<C>) => Descendant[] | undefined;
    /**
     * Function called on `editor.tf.insertData` just before
     * `editor.tf.insertFragment`. Default: if the block above the selection is
     * empty and the first fragment node type is not inline, set the selected node
     * type to the first fragment node type.
     *
     * @returns If true, the next handlers will be skipped.
     */
    preInsert?: (options: ParserOptions & PlatePluginContext<C> & {
        fragment: Descendant[];
    }) => HandlerReturnType;
    /** Query to skip this plugin. */
    query?: (options: ParserOptions & PlatePluginContext<C>) => boolean;
    /** Transform the inserted data. */
    transformData?: (options: ParserOptions & PlatePluginContext<C>) => string;
    /** Transform the fragment to insert. */
    transformFragment?: (options: ParserOptions & PlatePluginContext<C> & {
        fragment: Descendant[];
    }) => Descendant[];
};
/** The `PlatePlugin` interface is a React interface for all plugins. */
type PlatePlugin<C extends AnyPluginConfig = PluginConfig> = BasePlugin<C> & Nullable<{
    /** @see {@link Decorate} */
    decorate?: Decorate<WithAnyKey<C>>;
    /** @see {@link ExtendEditor} */
    extendEditor?: ExtendEditor<WithAnyKey<C>>;
    /** Normalize initial value before passing it into the editor. */
    normalizeInitialValue?: NormalizeInitialValue<WithAnyKey<C>>;
    /** @see {@link UseHooks} */
    useHooks?: UseHooks<WithAnyKey<C>>;
}> & PlatePluginMethods<C> & {
    /**
     * Handlers called whenever the corresponding event occurs in the editor.
     * Event handlers can return a boolean flag to specify whether the event
     * can be treated as being handled. If it returns `true`, the next
     * handlers will not be called.
     */
    handlers: Nullable<DOMHandlers<WithAnyKey<C>> & {
        /** @see {@link OnChange} */
        onChange?: OnChange<WithAnyKey<C>>;
    }>;
    /** Plugin injection. */
    inject: Nullable<{
        nodeProps?: InjectNodeProps<WithAnyKey<C>>;
        /**
         * Property that can be used by a plugin to allow other plugins to
         * inject code. For example, if multiple plugins have defined
         * `inject.editor.tf.insertData.transformData` for `key=HtmlPlugin.key`,
         * `insertData` plugin will call all of these `transformData` for
         * `HtmlPlugin.key` plugin. Differs from `override.plugins` as this is
         * not overriding any plugin.
         */
        plugins?: Record<string, Partial<EditorPlatePlugin<AnyPluginConfig>>>;
        /**
         * A function that returns a plugin config to be injected into other
         * plugins `inject.plugins` specified by targetPlugins.
         */
        targetPluginToInject?: (ctx: PlatePluginContext<C> & {
            targetPlugin: string;
        }) => Partial<PlatePlugin<AnyPluginConfig>>;
    }>;
    node: {
        /** Override `data-slate-leaf` element attributes */
        leafProps?: LeafNodeProps<WithAnyKey<C>>;
        /** Override node attributes */
        props?: NodeProps<WithAnyKey<C>>;
        /** Override `data-slate-node="text"` element attributes */
        textProps?: TextNodeProps<WithAnyKey<C>>;
    };
    override: {
        /** Replace plugin {@link NodeComponent} by key. */
        components?: Record<string, NodeComponent>;
        /** Extend {@link PlatePlugin} by key. */
        plugins?: Record<string, Partial<EditorPlatePlugin<AnyPluginConfig>>>;
    };
    /** @see {@link Parser} */
    parser: Nullable<Parser<WithAnyKey<C>>>;
    parsers: (Record<string, {
        /** @see {@link Deserializer} */
        deserializer?: Deserializer<WithAnyKey<C>>;
        /** @see {@link Serializer} */
        serializer?: Serializer<WithAnyKey<C>>;
    }> & {
        html?: never;
        htmlReact?: never;
    }) | {
        html?: Nullable<{
            /** @see {@link HtmlDeserializer} */
            deserializer?: HtmlDeserializer<WithAnyKey<C>>;
            /** @see {@link HtmlSerializer} */
            serializer?: HtmlSerializer<WithAnyKey<C>>;
        }>;
        htmlReact?: Nullable<{
            /** Function to deserialize HTML to Slate nodes using React. */
            serializer?: HtmlReactSerializer<WithAnyKey<C>>;
        }>;
    };
    render: Nullable<{
        /**
         * When other plugins' node components are rendered, this function can
         * return an optional wrapper function that turns a node's props to a
         * wrapper React node as its parent. Useful for wrapping or decorating
         * nodes with additional UI elements.
         *
         * NOTE: The function can run React hooks. NOTE: Do not run React hooks
         * in the wrapper function. It is not equivalent to a React component.
         */
        aboveNodes?: RenderNodeWrapper<WithAnyKey<C>>;
        /** Renders a component after the `Container` component. */
        afterContainer?: EditableSiblingComponent;
        /**
         * Renders a component after the `Editable` component. This is the last
         * render position within the editor structure.
         */
        afterEditable?: EditableSiblingComponent;
        /** Renders a component before the `Container` component. */
        beforeContainer?: EditableSiblingComponent;
        /** Renders a component before the `Editable` component. */
        beforeEditable?: EditableSiblingComponent;
        /**
         * When other plugins' node components are rendered, this function can
         * return an optional wrapper function that turns a node's props to a
         * wrapper React node. The wrapper node is the node's child and its
         * original children's parent. Useful for wrapping or decorating nodes
         * with additional UI elements.
         *
         * NOTE: The function can run React hooks. NOTE: Do not run React hooks
         * in the wrapper function. It is not equivalent to a React component.
         */
        belowNodes?: RenderNodeWrapper<WithAnyKey<C>>;
        /**
         * Function to render content below the root element but above its
         * children. Similar to belowNodes but renders directly in the element
         * rather than wrapping. Multiple plugins can provide this, and all
         * their content will be rendered in sequence.
         *
         * NOTE: This is implemented in PlateElement (@udecode/plate-utils), not
         * in plate-core.
         */
        belowRootNodes?: (props: PlateElementProps<TElement, C>) => React__default.ReactNode;
    }>;
    /** @see {@link Shortcuts} */
    shortcuts: Shortcuts;
    useOptionsStore: TCreatedStoreType<C['options'], [
        ['zustand/mutative-x', never]
    ]>;
};
type PlatePluginConfig<K extends string = any, O = {}, A = {}, T = {}, S = {}, EO = {}, EA = {}, ET = {}, ES = {}> = Partial<Omit<PlatePlugin<PluginConfig<K, Partial<O>, A, T, S>>, keyof PlatePluginMethods | 'api' | 'node' | 'optionsStore' | 'transforms' | 'useOptionsStore'> & {
    api: EA;
    node: Partial<PlatePlugin<PluginConfig<K, O, A, T, S>>['node']>;
    options: EO;
    selectors: ES;
    transforms: ET;
}>;
type PlatePluginContext<C extends AnyPluginConfig = PluginConfig, E extends PlateEditor = PlateEditor> = BasePluginContext<C> & {
    editor: E;
    plugin: EditorPlatePlugin<C>;
};
type PlatePluginMethods<C extends AnyPluginConfig = PluginConfig> = {
    __apiExtensions: ((ctx: PlatePluginContext<AnyPluginConfig>) => any)[];
    __configuration: ((ctx: PlatePluginContext<AnyPluginConfig>) => any) | null;
    __extensions: ((ctx: PlatePluginContext<AnyPluginConfig>) => any)[];
    __selectorExtensions: ((ctx: PlatePluginContext<AnyPluginConfig>) => any)[];
    clone: () => PlatePlugin<C>;
    configure: (config: ((ctx: PlatePluginContext<C>) => PlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>>) | PlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>>) => PlatePlugin<C>;
    configurePlugin: <P extends AnyPlatePlugin | AnySlatePlugin>(plugin: Partial<P>, config: (P extends AnyPlatePlugin ? PlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>> : SlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>>) | ((ctx: P extends AnyPlatePlugin ? PlatePluginContext<P> : SlatePluginContext<P>) => P extends AnyPlatePlugin ? PlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>> : SlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>>)) => PlatePlugin<C>;
    extend: <EO = {}, EA = {}, ET = {}, ES = {}>(extendConfig: ((ctx: PlatePluginContext<C>) => PlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>, EO, EA, ET, ES>) | PlatePluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, InferSelectors<C>, EO, EA, ET, ES>) => PlatePlugin<PluginConfig<C['key'], EO & InferOptions<C>, EA & InferApi<C>, ET & InferTransforms<C>, InferSelectors<C>>>;
    extendApi: <EA extends Record<string, (...args: any[]) => any> = Record<string, never>>(extension: (ctx: PlatePluginContext<C>) => EA) => PlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C> & Record<C['key'], EA>, InferTransforms<C>, InferSelectors<C>>>;
    /**
     * Extends the plugin's API with new methods or nested objects.
     *
     * This method allows you to add new functionality to the plugin's API or
     * extend existing ones. You can add top-level methods, nested objects with
     * methods, or extend existing nested objects. The types of existing methods
     * and nested objects are preserved, while new ones are inferred.
     *
     * @remarks
     *   - New methods can be added at the top level or within nested objects.
     *   - Existing methods can be overridden, but their parameter and return types
     *       must match the original.
     *   - When extending nested objects, you don't need to specify all existing
     *       properties; they will be preserved.
     *   - Only one level of nesting is supported for API objects.
     *
     * @example
     *   ```typescript
     *   const extendedPlugin = basePlugin.extendEditorApi(({ plugin }) => ({
     *     newMethod: (param: string) => param.length,
     *     existingMethod: (n) => n * 2, // Must match original signature
     *     nested: {
     *       newNestedMethod: () => 'new nested method',
     *     },
     *   }));
     *   ```;
     *
     * @template EA - The type of the extended API, inferred from the returned
     *   object.
     * @param extendedApi - A function that returns an object with the new or
     *   extended API methods.
     * @returns A new instance of the plugin with the extended API.
     */
    extendEditorApi: <EA extends Record<string, ((...args: any[]) => any) | Record<string, (...args: any[]) => any>> = Record<string, never>>(extension: ExtendEditorApi<C, EA>) => PlatePlugin<PluginConfig<C['key'], InferOptions<C>, {
        [K in keyof (EA & InferApi<C>)]: (EA & InferApi<C>)[K] extends (...args: any[]) => any ? (EA & InferApi<C>)[K] : {
            [N in keyof (EA & InferApi<C>)[K]]: (EA & InferApi<C>)[K][N];
        };
    }, InferTransforms<C>, InferSelectors<C>>>;
    extendEditorTransforms: <ET extends Record<string, ((...args: any[]) => any) | Record<string, (...args: any[]) => any>> = Record<string, never>>(extension: ExtendEditorTransforms<C, ET>) => PlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C>, {
        [K in keyof (ET & InferTransforms<C>)]: (ET & InferTransforms<C>)[K] extends (...args: any[]) => any ? (ET & InferTransforms<C>)[K] : {
            [N in keyof (ET & InferTransforms<C>)[K]]: (ET & InferTransforms<C>)[K][N];
        };
    }, InferSelectors<C>>>;
    extendPlugin: <P extends AnyPlatePlugin | AnySlatePlugin, EO = {}, EA = {}, ET = {}>(plugin: Partial<P>, extendConfig: (P extends AnyPlatePlugin ? PlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>, EO, EA, ET> : SlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>, EO, EA, ET>) | ((ctx: P extends AnyPlatePlugin ? PlatePluginContext<P> : SlatePluginContext<P>) => P extends AnyPlatePlugin ? PlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>, EO, EA, ET> : SlatePluginConfig<any, InferOptions<P>, InferApi<P>, InferTransforms<P>, InferSelectors<P>, EO, EA, ET>)) => PlatePlugin<C>;
    extendSelectors: <ES extends Record<string, (...args: any[]) => any> = Record<string, never>>(extension: (ctx: PlatePluginContext<C>) => ES) => PlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C>, ES & InferSelectors<C>>>;
    extendTransforms: <ET extends Record<string, (...args: any[]) => any> = Record<string, never>>(extension: (ctx: PlatePluginContext<C>) => ET) => PlatePlugin<PluginConfig<C['key'], InferOptions<C>, InferApi<C>, InferTransforms<C> & Record<C['key'], ET>, InferSelectors<C>>>;
    overrideEditor: (override: OverrideEditor<C>) => PlatePlugin<C>;
    /**
     * Set {@link NodeComponent} for the plugin.
     *
     * @param component {@link NodeComponent}.
     * @returns A new instance of the plugin with the updated
     *   {@link NodeComponent}.
     */
    withComponent: (component: NodeComponent) => PlatePlugin<C>;
    __resolved?: boolean;
};
type PlatePlugins = AnyPlatePlugin[];
type RenderNodeWrapper<C extends AnyPluginConfig = PluginConfig> = (props: RenderNodeWrapperProps<C>) => RenderNodeWrapperFunction;
type RenderNodeWrapperFunction = ((elementProps: PlateElementProps) => React__default.ReactNode) | undefined;
interface RenderNodeWrapperProps<C extends AnyPluginConfig = PluginConfig> extends PlateElementProps<TElement, C> {
    key: string;
}
type Serializer<C extends AnyPluginConfig = PluginConfig> = BaseSerializer & {
    parser?: (options: PlatePluginContext<C> & {
        node: Descendant;
    }) => any;
    query?: (options: PlatePluginContext<C> & {
        node: Descendant;
    }) => boolean;
};
type Shortcut = HotkeysOptions & {
    keys?: Keys;
    priority?: number;
    handler?: (ctx: {
        editor: PlateEditor;
        event: KeyboardEvent;
        eventDetails: HotkeysEvent;
    }) => void;
};
type Shortcuts = Record<string, Shortcut | null>;
type TextNodeProps<C extends AnyPluginConfig = PluginConfig> = ((props: PlateLeafProps<TText, C>) => AnyObject | undefined) | AnyObject;
type TransformOptions<C extends AnyPluginConfig = PluginConfig> = BaseTransformOptions & PlatePluginContext<C>;
/** Hook called when the editor is initialized. */
type UseHooks<C extends AnyPluginConfig = PluginConfig> = (ctx: PlatePluginContext<C>) => void;

declare function EditorRefPluginEffect({ id, plugin, }: {
    plugin: AnyEditorPlatePlugin;
    id?: string;
}): null;
declare function EditorRefEffect({ id }: {
    id?: string;
}): React__default.JSX.Element;

declare const EditorStateEffect: React__default.MemoExoticComponent<() => null>;

/**
 * Get the element by plugin key. If no element is found in the context, it will
 * return an empty object.
 */
declare const useElement: <T extends TElement = TElement>(pluginKey?: string) => T;

interface UseElementSelectorOptions<T> {
    key?: string;
    equalityFn?: (a: T, b: T) => boolean;
}
declare const useElementSelector: <T>(selector: <N extends TElement>(state: NodeEntry<N>, prev?: T) => T, deps: React__default.DependencyList, { key, equalityFn, }?: UseElementSelectorOptions<T>) => T;

declare const SCOPE_ELEMENT = "element";
type ElementStoreState = {
    element: TElement;
    entry: ElementEntry;
    path: Path;
};
declare const ElementProvider: React$1.FC<jotai_x.ProviderProps<{
    element: TElement;
    entry: ElementEntry;
    path: Path;
}>>;
declare const elementStore: jotai_x.StoreApi<ElementStoreState, object, "element">;
declare const useElementStore: jotai_x.UseStoreApi<ElementStoreState, object>;

/** Get the memoized path of the closest element. */
declare const usePath: (pluginKey?: string) => Path;

/** Get last event editor id: focus, blur or last. */
declare const useEventPlateId: (id?: string) => string;

type PlateChangeKey = 'versionDecorate' | 'versionEditor' | 'versionSelection' | 'versionValue';
type PlateStoreState<E extends PlateEditor = PlateEditor> = Nullable<{
    decorate: NonNullable<(options: {
        editor: E;
        entry: NodeEntry;
    }) => TRange[]>;
    /** Whether `Editable` is rendered so slate DOM is resolvable. */
    isMounted: boolean;
    /**
     * Whether the editor is primary. If no editor is active, then PlateController
     * will use the first-mounted primary editor.
     *
     * @default true
     */
    primary: boolean;
    readOnly: boolean;
    renderElement: NonNullable<EditableProps['renderElement']>;
    renderLeaf: NonNullable<EditableProps['renderLeaf']>;
    renderText: NonNullable<EditableProps['renderText']>;
    /**
     * Version incremented when calling `redecorate`. This is a dependency of the
     * `decorate` function.
     */
    versionDecorate: number;
    /** Version incremented on each editor change. */
    versionEditor: number;
    /** Version incremented on each editor.selection change. */
    versionSelection: number;
    /** Version incremented on each editor.children change. */
    versionValue: number;
    /** Controlled callback called when the editor state changes. */
    onChange: (options: {
        editor: E;
        value: ValueOf<E>;
    }) => void;
    /** Controlled callback called when the editor.selection changes. */
    onSelectionChange: (options: {
        editor: E;
        selection: TSelection;
    }) => void;
    /** Controlled callback called when the editor.children changes. */
    onValueChange: (options: {
        editor: E;
        value: ValueOf<E>;
    }) => void;
}> & {
    /**
     * A unique id used as a provider scope. Use it if you have multiple `Plate`
     * in the same React tree.
     *
     * @default random id
     */
    id: string;
    /** A reference to the editor container element. */
    containerRef: React.RefObject<HTMLDivElement | null>;
    /**
     * Slate editor reference.
     *
     * @default createPlateFallbackEditor()
     */
    editor: E;
    /**
     * A reference to the editor scroll container element.
     *
     * @default containerRef
     */
    scrollRef: React.RefObject<HTMLDivElement | null>;
};

type PlateStore = ReturnType<typeof usePlateStore>;
declare const PLATE_SCOPE = "plate";
declare const GLOBAL_PLATE_SCOPE: unique symbol;
declare const createPlateStore: <E extends PlateEditor = PlateEditor>({ id, containerRef, decorate, editor, isMounted, primary, readOnly, renderElement, renderLeaf, renderText, scrollRef, versionDecorate, versionEditor, versionSelection, versionValue, onChange, onSelectionChange, onValueChange, ...state }?: Partial<PlateStoreState<E>>) => jotai_x.AtomStoreApi<PlateStoreState<E>, {
    trackedEditor: jotai.Atom<{
        editor: any;
        version: number | null;
    }>;
    trackedSelection: jotai.Atom<{
        selection: any;
        version: number | null;
    }>;
    trackedValue: jotai.Atom<{
        value: any;
        version: number | null;
    }>;
}, "plate">;
declare const PlateStoreProvider: React__default.FC<jotai_x.ProviderProps<{
    decorate: ((options: {
        editor: PlateEditor;
        entry: _udecode_slate.NodeEntry;
    }) => _udecode_slate.TRange[]) | null;
    isMounted: boolean | null;
    primary: boolean | null;
    readOnly: boolean | null;
    renderElement: RenderElementFn | null;
    renderLeaf: RenderLeafFn | null;
    renderText: RenderTextFn | null;
    versionDecorate: number | null;
    versionEditor: number | null;
    versionSelection: number | null;
    versionValue: number | null;
    onChange: ((options: {
        editor: PlateEditor;
        value: _udecode_slate.Value;
    }) => void) | null;
    onSelectionChange: ((options: {
        editor: PlateEditor;
        selection: _udecode_slate.TSelection;
    }) => void) | null;
    onValueChange: ((options: {
        editor: PlateEditor;
        value: _udecode_slate.Value;
    }) => void) | null;
    id: string;
    containerRef: React__default.RefObject<HTMLDivElement | null>;
    editor: PlateEditor;
    scrollRef: React__default.RefObject<HTMLDivElement | null>;
}>>;
declare const plateStore: jotai_x.StoreApi<PlateStoreState<PlateEditor>, {
    trackedEditor: jotai.Atom<{
        editor: any;
        version: number | null;
    }>;
    trackedSelection: jotai.Atom<{
        selection: any;
        version: number | null;
    }>;
    trackedValue: jotai.Atom<{
        value: any;
        version: number | null;
    }>;
}, "plate">;
declare const usePlateLocalSet: <K extends "id" | "decorate" | "editor" | "onChange" | "readOnly" | "renderElement" | "renderText" | "renderLeaf" | "versionDecorate" | "versionEditor" | "versionSelection" | "versionValue" | "onSelectionChange" | "onValueChange" | "primary" | "isMounted" | "containerRef" | "scrollRef" | "trackedEditor" | "trackedSelection" | "trackedValue">(key: K, options?: string | jotai_x.UseAtomOptions) => ({
    decorate: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        entry: _udecode_slate.NodeEntry;
    }) => _udecode_slate.TRange[]) | null>;
    isMounted: jotai_x.SimpleWritableAtom<boolean | null>;
    primary: jotai_x.SimpleWritableAtom<boolean | null>;
    readOnly: jotai_x.SimpleWritableAtom<boolean | null>;
    renderElement: jotai_x.SimpleWritableAtom<RenderElementFn | null>;
    renderLeaf: jotai_x.SimpleWritableAtom<RenderLeafFn | null>;
    renderText: jotai_x.SimpleWritableAtom<RenderTextFn | null>;
    versionDecorate: jotai_x.SimpleWritableAtom<number | null>;
    versionEditor: jotai_x.SimpleWritableAtom<number | null>;
    versionSelection: jotai_x.SimpleWritableAtom<number | null>;
    versionValue: jotai_x.SimpleWritableAtom<number | null>;
    onChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        value: _udecode_slate.Value;
    }) => void) | null>;
    onSelectionChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        selection: _udecode_slate.TSelection;
    }) => void) | null>;
    onValueChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        value: _udecode_slate.Value;
    }) => void) | null>;
    id: jotai_x.SimpleWritableAtom<string>;
    containerRef: jotai_x.SimpleWritableAtom<React__default.RefObject<HTMLDivElement | null>>;
    editor: jotai_x.SimpleWritableAtom<PlateEditor>;
    scrollRef: jotai_x.SimpleWritableAtom<React__default.RefObject<HTMLDivElement | null>>;
} & {
    trackedEditor: jotai.Atom<{
        editor: any;
        version: number | null;
    }>;
    trackedSelection: jotai.Atom<{
        selection: any;
        version: number | null;
    }>;
    trackedValue: jotai.Atom<{
        value: any;
        version: number | null;
    }>;
})[K] extends jotai.WritableAtom<infer _V, infer A extends unknown[], infer R> ? (...args: A) => R : never;
declare const usePlateLocalState: <K extends "id" | "decorate" | "editor" | "onChange" | "readOnly" | "renderElement" | "renderText" | "renderLeaf" | "versionDecorate" | "versionEditor" | "versionSelection" | "versionValue" | "onSelectionChange" | "onValueChange" | "primary" | "isMounted" | "containerRef" | "scrollRef" | "trackedEditor" | "trackedSelection" | "trackedValue">(key: K, options?: string | jotai_x.UseAtomOptions) => ({
    decorate: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        entry: _udecode_slate.NodeEntry;
    }) => _udecode_slate.TRange[]) | null>;
    isMounted: jotai_x.SimpleWritableAtom<boolean | null>;
    primary: jotai_x.SimpleWritableAtom<boolean | null>;
    readOnly: jotai_x.SimpleWritableAtom<boolean | null>;
    renderElement: jotai_x.SimpleWritableAtom<RenderElementFn | null>;
    renderLeaf: jotai_x.SimpleWritableAtom<RenderLeafFn | null>;
    renderText: jotai_x.SimpleWritableAtom<RenderTextFn | null>;
    versionDecorate: jotai_x.SimpleWritableAtom<number | null>;
    versionEditor: jotai_x.SimpleWritableAtom<number | null>;
    versionSelection: jotai_x.SimpleWritableAtom<number | null>;
    versionValue: jotai_x.SimpleWritableAtom<number | null>;
    onChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        value: _udecode_slate.Value;
    }) => void) | null>;
    onSelectionChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        selection: _udecode_slate.TSelection;
    }) => void) | null>;
    onValueChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        value: _udecode_slate.Value;
    }) => void) | null>;
    id: jotai_x.SimpleWritableAtom<string>;
    containerRef: jotai_x.SimpleWritableAtom<React__default.RefObject<HTMLDivElement | null>>;
    editor: jotai_x.SimpleWritableAtom<PlateEditor>;
    scrollRef: jotai_x.SimpleWritableAtom<React__default.RefObject<HTMLDivElement | null>>;
} & {
    trackedEditor: jotai.Atom<{
        editor: any;
        version: number | null;
    }>;
    trackedSelection: jotai.Atom<{
        selection: any;
        version: number | null;
    }>;
    trackedValue: jotai.Atom<{
        value: any;
        version: number | null;
    }>;
})[K] extends jotai.WritableAtom<infer V, infer A extends unknown[], infer R> ? [V, (...args: A) => R] : never;
declare const usePlateLocalStore: jotai_x.UseStoreApi<PlateStoreState<PlateEditor>, {
    trackedEditor: jotai.Atom<{
        editor: any;
        version: number | null;
    }>;
    trackedSelection: jotai.Atom<{
        selection: any;
        version: number | null;
    }>;
    trackedValue: jotai.Atom<{
        value: any;
        version: number | null;
    }>;
}>;
declare const usePlateLocalValue: <K extends "id" | "decorate" | "editor" | "onChange" | "readOnly" | "renderElement" | "renderText" | "renderLeaf" | "versionDecorate" | "versionEditor" | "versionSelection" | "versionValue" | "onSelectionChange" | "onValueChange" | "primary" | "isMounted" | "containerRef" | "scrollRef" | "trackedEditor" | "trackedSelection" | "trackedValue", S = ({
    decorate: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        entry: _udecode_slate.NodeEntry;
    }) => _udecode_slate.TRange[]) | null>;
    isMounted: jotai_x.SimpleWritableAtom<boolean | null>;
    primary: jotai_x.SimpleWritableAtom<boolean | null>;
    readOnly: jotai_x.SimpleWritableAtom<boolean | null>;
    renderElement: jotai_x.SimpleWritableAtom<RenderElementFn | null>;
    renderLeaf: jotai_x.SimpleWritableAtom<RenderLeafFn | null>;
    renderText: jotai_x.SimpleWritableAtom<RenderTextFn | null>;
    versionDecorate: jotai_x.SimpleWritableAtom<number | null>;
    versionEditor: jotai_x.SimpleWritableAtom<number | null>;
    versionSelection: jotai_x.SimpleWritableAtom<number | null>;
    versionValue: jotai_x.SimpleWritableAtom<number | null>;
    onChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        value: _udecode_slate.Value;
    }) => void) | null>;
    onSelectionChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        selection: _udecode_slate.TSelection;
    }) => void) | null>;
    onValueChange: jotai_x.SimpleWritableAtom<((options: {
        editor: PlateEditor;
        value: _udecode_slate.Value;
    }) => void) | null>;
    id: jotai_x.SimpleWritableAtom<string>;
    containerRef: jotai_x.SimpleWritableAtom<React__default.RefObject<HTMLDivElement | null>>;
    editor: jotai_x.SimpleWritableAtom<PlateEditor>;
    scrollRef: jotai_x.SimpleWritableAtom<React__default.RefObject<HTMLDivElement | null>>;
} & {
    trackedEditor: jotai.Atom<{
        editor: any;
        version: number | null;
    }>;
    trackedSelection: jotai.Atom<{
        selection: any;
        version: number | null;
    }>;
    trackedValue: jotai.Atom<{
        value: any;
        version: number | null;
    }>;
})[K] extends jotai.Atom<infer V> ? V : never>(key: K, options?: ({
    selector?: ((v: ({
        decorate: jotai_x.SimpleWritableAtom<((options: {
            editor: PlateEditor;
            entry: _udecode_slate.NodeEntry;
        }) => _udecode_slate.TRange[]) | null>;
        isMounted: jotai_x.SimpleWritableAtom<boolean | null>;
        primary: jotai_x.SimpleWritableAtom<boolean | null>;
        readOnly: jotai_x.SimpleWritableAtom<boolean | null>;
        renderElement: jotai_x.SimpleWritableAtom<RenderElementFn | null>;
        renderLeaf: jotai_x.SimpleWritableAtom<RenderLeafFn | null>;
        renderText: jotai_x.SimpleWritableAtom<RenderTextFn | null>;
        versionDecorate: jotai_x.SimpleWritableAtom<number | null>;
        versionEditor: jotai_x.SimpleWritableAtom<number | null>;
        versionSelection: jotai_x.SimpleWritableAtom<number | null>;
        versionValue: jotai_x.SimpleWritableAtom<number | null>;
        onChange: jotai_x.SimpleWritableAtom<((options: {
            editor: PlateEditor;
            value: _udecode_slate.Value;
        }) => void) | null>;
        onSelectionChange: jotai_x.SimpleWritableAtom<((options: {
            editor: PlateEditor;
            selection: _udecode_slate.TSelection;
        }) => void) | null>;
        onValueChange: jotai_x.SimpleWritableAtom<((options: {
            editor: PlateEditor;
            value: _udecode_slate.Value;
        }) => void) | null>;
        id: jotai_x.SimpleWritableAtom<string>;
        containerRef: jotai_x.SimpleWritableAtom<React__default.RefObject<HTMLDivElement | null>>;
        editor: jotai_x.SimpleWritableAtom<PlateEditor>;
        scrollRef: jotai_x.SimpleWritableAtom<React__default.RefObject<HTMLDivElement | null>>;
    } & {
        trackedEditor: jotai.Atom<{
            editor: any;
            version: number | null;
        }>;
        trackedSelection: jotai.Atom<{
            selection: any;
            version: number | null;
        }>;
        trackedValue: jotai.Atom<{
            value: any;
            version: number | null;
        }>;
    })[K] extends jotai.Atom<infer V_1> ? V_1 : never, prevSelectorOutput?: S | undefined) => S) | undefined;
    equalityFn?: ((prev: S, next: S) => boolean) | undefined;
} & jotai_x.UseAtomOptions) | undefined, deps?: unknown[]) => S;

declare const usePlateStore: (id?: string) => jotai_x.ReturnOfUseStoreApi<PlateStoreState<PlateEditor>, {
    trackedEditor: jotai.Atom<{
        editor: any;
        version: number | null;
    }>;
    trackedSelection: jotai.Atom<{
        selection: any;
        version: number | null;
    }>;
    trackedValue: jotai.Atom<{
        value: any;
        version: number | null;
    }>;
}>;
declare const usePlateSet: typeof usePlateLocalSet;
declare const usePlateValue: typeof usePlateLocalValue;
declare const usePlateState: typeof usePlateLocalState;
/** Get the closest `Plate` id. */
declare const useEditorId: () => string;
declare const useEditorContainerRef: (id?: string) => React__default.RefObject<HTMLDivElement | null>;
declare const useEditorScrollRef: (id?: string) => React__default.RefObject<HTMLDivElement | null>;
/** Returns the scrollRef if it exists, otherwise returns the containerRef. */
declare const useScrollRef: (id?: string) => React__default.RefObject<HTMLDivElement | null>;
declare const useEditorMounted: (id?: string) => boolean;
/**
 * Whether the editor is read-only. You can also use `useReadOnly` from
 * `slate-react` in node components.
 */
declare const useEditorReadOnly: (id?: string) => boolean;
/**
 * Get a reference to the editor instance that remains stable across re-renders.
 * The editor object is enhanced with a `store` property that provides access to
 * the Plate store.
 *
 * @example
 *   ```tsx
 *   const editor = useEditorRef();
 *   const readOnly = useAtomStoreValue(editor.store, 'readOnly');
 */
declare const useEditorRef: <E extends PlateEditor = PlateEditor>(id?: string) => E & {
    store: PlateStore;
};
/** Get the editor selection (deeply memoized). */
declare const useEditorSelection: (id?: string) => any;
/** Get editor state which is updated on editor change. */
declare const useEditorState: <E extends PlateEditor = PlateEditor>(id?: string) => E;
/** Version incremented on each editor change. */
declare const useEditorVersion: (id?: string) => number | null;
/** Version incremented on selection change. */
declare const useSelectionVersion: (id?: string) => number | null;
/** Get the editor value (deeply memoized). */
declare const useEditorValue: (id?: string) => any;
/** Version incremented on value change. */
declare const useValueVersion: (id?: string) => number | null;
declare const useIncrementVersion: (key: PlateChangeKey, id?: string) => () => void;
declare const useRedecorate: (id?: string) => () => void;

/** Get editor and plugin context. */
declare function useEditorPlugin<P extends AnyPluginConfig | PlatePlugin<AnyPluginConfig>, E extends PlateEditor = PlateEditor>(p: WithRequiredKey<P>, id?: string): PlatePluginContext<InferConfig<P> extends never ? P : InferConfig<P>, E> & {
    store: PlateStore;
};

interface UseEditorSelectorOptions<T> {
    id?: string;
    equalityFn?: (a: T, b: T) => boolean;
}
declare const useEditorSelector: <T, E extends PlateEditor = PlateEditor>(selector: (editor: E, prev?: T) => T, deps: React__default.DependencyList, { id, equalityFn }?: UseEditorSelectorOptions<T>) => T;

/**
 * Hook to access plugin options. For usage outside `<Plate>`, use
 * `useEditorPluginOption` instead.
 *
 * @example
 *   const value = usePluginOption(plugin, 'value');
 *   const doubleValue = usePluginOption(plugin, 'doubleValue', 2);
 */
declare function usePluginOption<C extends AnyPluginConfig, StateType extends InferOptions<C>, TSelectors extends InferSelectors<C>, K extends keyof StateType | keyof TSelectors | 'state'>(plugin: WithRequiredKey<C>, key: K, ...args: [
    ...(K extends keyof TSelectors ? Parameters<TSelectors[K]> : unknown[]),
    TEqualityChecker<K extends 'state' ? StateType : K extends keyof TSelectors ? ReturnType<TSelectors[K]> : K extends keyof StateType ? StateType[K] : never>?
]): K extends 'state' ? StateType : K extends keyof TSelectors ? ReturnType<TSelectors[K]> : K extends keyof StateType ? StateType[K] : never;
declare function useEditorPluginOption<C extends AnyPluginConfig, StateType extends InferOptions<C>, TSelectors extends InferSelectors<C>, K extends keyof StateType | keyof TSelectors | 'state'>(editor: PlateEditor, plugin: WithRequiredKey<C>, key: K, ...args: [
    ...(K extends keyof TSelectors ? Parameters<TSelectors[K]> : unknown[]),
    TEqualityChecker<K extends 'state' ? StateType : K extends keyof TSelectors ? ReturnType<TSelectors[K]> : K extends keyof StateType ? StateType[K] : never>?
]): K extends 'state' ? StateType : K extends keyof TSelectors ? ReturnType<TSelectors[K]> : K extends keyof StateType ? StateType[K] : never;
/**
 * Use zustand store selector.
 *
 * @example
 *   const name = usePluginOptions(plugin, (state) => state.name, equalityFn);
 */
declare function usePluginOptions<C extends AnyPluginConfig, U>(plugin: WithRequiredKey<C>, selector: (state: InferOptions<C>) => U, { id, equalityFn, }?: {
    id?: string;
    equalityFn?: (a: U, b: U) => boolean;
}): U;
declare function useEditorPluginOptions<C extends AnyPluginConfig, U>(editor: PlateEditor, plugin: WithRequiredKey<C>, selector: (state: InferOptions<C>) => U, { equalityFn, }?: {
    equalityFn?: (a: U, b: U) => boolean;
}): U;

declare const PlateController: React__default.FC<jotai_x.ProviderProps<{
    activeId: string | null;
    editorStores: Record<string, ({
        get: <Value>(atom: Atom<Value>) => Value;
        set: <Value, Args extends unknown[], Result>(atom: jotai.WritableAtom<Value, Args, Result>, ...args: Args) => Result;
        sub: (atom: Atom<unknown>, listener: () => void) => () => void;
    } & Partial<{
        dev_subscribe_store: (l: (action: {
            type: "write";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "async-write";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "sub";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "unsub";
        } | {
            type: "restore";
            flushed: Set<Atom<unknown>>;
        }) => void, rev: 2) => () => void;
        dev_get_mounted_atoms: () => IterableIterator<Atom<unknown>>;
        dev_get_atom_state: (a: Atom<unknown>) => ({
            d: Map<Atom<unknown>, /*elided*/ any & ({
                e: unknown;
            } | {
                v: unknown;
            })>;
        } & ({
            e: unknown;
        } | {
            v: unknown;
        })) | undefined;
        dev_get_mounted: (a: Atom<unknown>) => {
            l: Set<() => void>;
            t: Set<Atom<unknown>>;
            u?: () => void;
        } | undefined;
        dev_restore_atoms: (values: Iterable<readonly [Atom<unknown>, unknown]>) => void;
    }>) | null>;
    primaryEditorIds: string[];
}>>;
declare const plateControllerStore: jotai_x.StoreApi<{
    activeId: jotai.PrimitiveAtom<string | null> & {
        init: string | null;
    };
    editorStores: jotai.PrimitiveAtom<Record<string, ({
        get: <Value>(atom: Atom<Value>) => Value;
        set: <Value, Args extends unknown[], Result>(atom: jotai.WritableAtom<Value, Args, Result>, ...args: Args) => Result;
        sub: (atom: Atom<unknown>, listener: () => void) => () => void;
    } & Partial<{
        dev_subscribe_store: (l: (action: {
            type: "write";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "async-write";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "sub";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "unsub";
        } | {
            type: "restore";
            flushed: Set<Atom<unknown>>;
        }) => void, rev: 2) => () => void;
        dev_get_mounted_atoms: () => IterableIterator<Atom<unknown>>;
        dev_get_atom_state: (a: Atom<unknown>) => ({
            d: Map<Atom<unknown>, /*elided*/ any & ({
                e: unknown;
            } | {
                v: unknown;
            })>;
        } & ({
            e: unknown;
        } | {
            v: unknown;
        })) | undefined;
        dev_get_mounted: (a: Atom<unknown>) => {
            l: Set<() => void>;
            t: Set<Atom<unknown>>;
            u?: () => void;
        } | undefined;
        dev_restore_atoms: (values: Iterable<readonly [Atom<unknown>, unknown]>) => void;
    }>) | null>> & {
        init: Record<string, ({
            get: <Value>(atom: Atom<Value>) => Value;
            set: <Value, Args extends unknown[], Result>(atom: jotai.WritableAtom<Value, Args, Result>, ...args: Args) => Result;
            sub: (atom: Atom<unknown>, listener: () => void) => () => void;
        } & Partial<{
            dev_subscribe_store: (l: (action: {
                type: "write";
                flushed: Set<Atom<unknown>>;
            } | {
                type: "async-write";
                flushed: Set<Atom<unknown>>;
            } | {
                type: "sub";
                flushed: Set<Atom<unknown>>;
            } | {
                type: "unsub";
            } | {
                type: "restore";
                flushed: Set<Atom<unknown>>;
            }) => void, rev: 2) => () => void;
            dev_get_mounted_atoms: () => IterableIterator<Atom<unknown>>;
            dev_get_atom_state: (a: Atom<unknown>) => ({
                d: Map<Atom<unknown>, /*elided*/ any & ({
                    e: unknown;
                } | {
                    v: unknown;
                })>;
            } & ({
                e: unknown;
            } | {
                v: unknown;
            })) | undefined;
            dev_get_mounted: (a: Atom<unknown>) => {
                l: Set<() => void>;
                t: Set<Atom<unknown>>;
                u?: () => void;
            } | undefined;
            dev_restore_atoms: (values: Iterable<readonly [Atom<unknown>, unknown]>) => void;
        }>) | null>;
    };
    primaryEditorIds: jotai.PrimitiveAtom<string[]> & {
        init: string[];
    };
}, object, "plateController">;
declare const _usePlateControllerStore: jotai_x.UseStoreApi<{
    activeId: jotai.PrimitiveAtom<string | null> & {
        init: string | null;
    };
    editorStores: jotai.PrimitiveAtom<Record<string, ({
        get: <Value>(atom: Atom<Value>) => Value;
        set: <Value, Args extends unknown[], Result>(atom: jotai.WritableAtom<Value, Args, Result>, ...args: Args) => Result;
        sub: (atom: Atom<unknown>, listener: () => void) => () => void;
    } & Partial<{
        dev_subscribe_store: (l: (action: {
            type: "write";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "async-write";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "sub";
            flushed: Set<Atom<unknown>>;
        } | {
            type: "unsub";
        } | {
            type: "restore";
            flushed: Set<Atom<unknown>>;
        }) => void, rev: 2) => () => void;
        dev_get_mounted_atoms: () => IterableIterator<Atom<unknown>>;
        dev_get_atom_state: (a: Atom<unknown>) => ({
            d: Map<Atom<unknown>, /*elided*/ any & ({
                e: unknown;
            } | {
                v: unknown;
            })>;
        } & ({
            e: unknown;
        } | {
            v: unknown;
        })) | undefined;
        dev_get_mounted: (a: Atom<unknown>) => {
            l: Set<() => void>;
            t: Set<Atom<unknown>>;
            u?: () => void;
        } | undefined;
        dev_restore_atoms: (values: Iterable<readonly [Atom<unknown>, unknown]>) => void;
    }>) | null>> & {
        init: Record<string, ({
            get: <Value>(atom: Atom<Value>) => Value;
            set: <Value, Args extends unknown[], Result>(atom: jotai.WritableAtom<Value, Args, Result>, ...args: Args) => Result;
            sub: (atom: Atom<unknown>, listener: () => void) => () => void;
        } & Partial<{
            dev_subscribe_store: (l: (action: {
                type: "write";
                flushed: Set<Atom<unknown>>;
            } | {
                type: "async-write";
                flushed: Set<Atom<unknown>>;
            } | {
                type: "sub";
                flushed: Set<Atom<unknown>>;
            } | {
                type: "unsub";
            } | {
                type: "restore";
                flushed: Set<Atom<unknown>>;
            }) => void, rev: 2) => () => void;
            dev_get_mounted_atoms: () => IterableIterator<Atom<unknown>>;
            dev_get_atom_state: (a: Atom<unknown>) => ({
                d: Map<Atom<unknown>, /*elided*/ any & ({
                    e: unknown;
                } | {
                    v: unknown;
                })>;
            } & ({
                e: unknown;
            } | {
                v: unknown;
            })) | undefined;
            dev_get_mounted: (a: Atom<unknown>) => {
                l: Set<() => void>;
                t: Set<Atom<unknown>>;
                u?: () => void;
            } | undefined;
            dev_restore_atoms: (values: Iterable<readonly [Atom<unknown>, unknown]>) => void;
        }>) | null>;
    };
    primaryEditorIds: jotai.PrimitiveAtom<string[]> & {
        init: string[];
    };
}, object>;

declare const usePlateControllerLocalStore: typeof _usePlateControllerStore;
declare const usePlateControllerExists: () => boolean;
/**
 * Retrieve from PlateController the JotaiStore for the editor with a given ID,
 * or the active editor if no ID is provided, or the first primary editor if no
 * editor is active, or null.
 */
declare const usePlateControllerStore: (idProp?: string) => JotaiStore | null;

interface PlateProps<E extends PlateEditor = PlateEditor> extends Partial<Pick<PlateStoreState<E>, 'decorate' | 'onChange' | 'onSelectionChange' | 'onValueChange' | 'primary' | 'readOnly'>> {
    children: React__default.ReactNode;
    editor: E | null;
    renderElement?: EditableProps['renderElement'];
    renderLeaf?: EditableProps['renderLeaf'];
    suppressInstanceWarning?: boolean;
}
declare function Plate<E extends PlateEditor = PlateEditor>(props: PlateProps<E>): React__default.JSX.Element | null;

declare const PlateContainer: {
    ({ children, ...props }: HTMLAttributes<HTMLDivElement>): React__default.JSX.Element;
    displayName: string;
};

type PlateContentProps = Omit<EditableProps, 'decorate'> & {
    /** Autofocus when it becomes editable (readOnly false -> readOnly true) */
    autoFocusOnEditable?: boolean;
    decorate?: PlateStoreState['decorate'];
    disabled?: boolean;
    /** R enders the editable content. */
    renderEditable?: (editable: React__default.ReactElement<any>) => React__default.ReactNode;
};
/**
 * Editable with plugins.
 *
 * - Decorate prop
 * - DOM handler props
 * - ReadOnly prop
 * - Render.afterEditable
 * - Render.beforeEditable
 * - RenderElement prop
 * - RenderLeaf prop
 * - UseHooks
 */
declare const PlateContent: React__default.ForwardRefExoticComponent<Omit<EditableProps, "decorate"> & {
    /** Autofocus when it becomes editable (readOnly false -> readOnly true) */
    autoFocusOnEditable?: boolean;
    decorate?: PlateStoreState["decorate"];
    disabled?: boolean;
    /** R enders the editable content. */
    renderEditable?: (editable: React__default.ReactElement<any>) => React__default.ReactNode;
} & React__default.RefAttributes<unknown>>;

interface PlateControllerEffectProps {
    id?: string;
}
declare const PlateControllerEffect: ({ id: idProp, }: PlateControllerEffectProps) => null;

/**
 * Slate with plugins.
 *
 * - OnChange prop
 * - RenderAboveSlate
 */
declare function PlateSlate({ id, children, }: {
    children: React__default.ReactNode;
    id?: string;
}): React__default.ReactElement<any, string | React__default.JSXElementConstructor<any>>;

declare function PlateTest({ editableProps, shouldNormalizeEditor, variant, ...props }: CreatePlateEditorOptions & PlateProps & {
    editableProps?: PlateContentProps;
    variant?: 'comment' | 'wordProcessor';
}): React__default.JSX.Element;

declare const useNodeAttributes: (props: any, ref?: any) => any;
type PlateElementProps<N extends TElement = TElement, C extends AnyPluginConfig = PluginConfig> = PlateNodeProps<C> & RenderElementProps<N> & {
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
type PlateNodeProps<C extends AnyPluginConfig = PluginConfig> = PlatePluginContext<C> & {
    /**
     * Optional ref to be merged with `attributes.ref`
     *
     * @default undefined
     */
    ref?: any;
};
type PlateHTMLProps<C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = 'div'> = PlateNodeProps<C> & {
    /** HTML attributes to pass to the underlying HTML element */
    attributes: React__default.PropsWithoutRef<React__default.JSX.IntrinsicElements[T]> & UnknownObject;
    as?: T;
    /** Class to be merged with `attributes.className` */
    className?: string;
    /** Style to be merged with `attributes.style` */
    style?: React__default.CSSProperties;
};
type StyledPlateElementProps<N extends TElement = TElement, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = 'div'> = Omit<PlateElementProps<N, C>, keyof DeprecatedNodeProps> & PlateHTMLProps<C, T>;
declare const PlateElement: <N extends TElement = TElement, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = "div">(props: StyledPlateElementProps<N, C, T>) => React__default.ReactElement;
type PlateTextProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig> = PlateNodeProps<C> & RenderTextProps<N> & DeprecatedNodeProps;
type StyledPlateTextProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = 'span'> = Omit<PlateTextProps<N, C>, keyof DeprecatedNodeProps> & PlateHTMLProps<C, T>;
declare const PlateText: <N extends TText = TText, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = "span">(props: StyledPlateTextProps<N, C, T>) => React__default.ReactElement;
type PlateLeafProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig> = PlateNodeProps<C> & RenderLeafProps<N> & DeprecatedNodeProps;
type StyledPlateLeafProps<N extends TText = TText, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = 'span'> = Omit<PlateLeafProps<N, C>, keyof DeprecatedNodeProps> & PlateHTMLProps<C, T>;
declare const PlateLeaf: <N extends TText = TText, C extends AnyPluginConfig = PluginConfig, T extends keyof HTMLElementTagNameMap = "span">({ className, ...props }: StyledPlateLeafProps<N, C, T>) => React__default.ReactElement;

type RefComponent<P, R> = React__default.FC<P> & {
    ref?: React__default.Ref<R>;
};
declare const withHOC: <ComponentProps, HOCProps, ComponentRef, HOCRef>(HOC: RefComponent<HOCProps, HOCRef>, Component: RefComponent<ComponentProps, ComponentRef>, hocProps?: Omit<HOCProps, "children">, hocRef?: React__default.Ref<HOCRef>) => React__default.ForwardRefExoticComponent<React__default.PropsWithoutRef<ComponentProps> & React__default.RefAttributes<ComponentRef>>;

declare const useEditableProps: ({ disabled, readOnly: readOnlyProp, ...editableProps }?: Omit<EditableProps, "decorate"> & Pick<PlateProps, "decorate">) => EditableProps;

declare const useNodePath: (node: TNode) => _udecode_slate.Path | undefined;

interface SlateProps extends UnknownObject {
    children: React__default.ReactNode;
    editor: Editor;
    initialValue: Value;
    onChange?: (value: Value) => void;
    onSelectionChange?: (selection: TSelection) => void;
    onValueChange?: (value: Value) => void;
}
/** Get Slate props stored in a global store. */
declare const useSlateProps: ({ id, }: {
    id?: string;
}) => Omit<SlateProps, "children">;

declare const createPlateFallbackEditor: (options?: CreatePlateEditorOptions) => TPlateEditor<_udecode_slate.Value, PlateCorePlugin>;

declare const DOM_HANDLERS: (keyof DOMHandlers)[];

/**
 * Override node props with plugin props. Allowed properties in
 * `props.element.attributes` are passed into `props.attributes`. Extend the
 * class name with the node type.
 */
declare const getRenderNodeProps: ({ attributes: nodeAttributes, editor, plugin, props, }: {
    editor: PlateEditor;
    props: PlateHTMLProps;
    attributes?: AnyObject;
    plugin?: AnyEditorPlatePlugin;
}) => PlateHTMLProps;

declare const convertDomEventToSyntheticEvent: (domEvent: Event) => React__default.SyntheticEvent<unknown, unknown>;
/** Check if an event is overrided by a handler. */
declare const isEventHandled: <EventType extends React__default.SyntheticEvent<unknown, unknown>>(event: EventType, handler?: (event: EventType) => boolean | void) => boolean;
/**
 * Generic pipe for handlers.
 *
 * - Get all the plugins handlers by `handlerKey`.
 * - If there is no plugin handler or editable prop handler for this key, return
 *   `undefined`.
 * - Return a handler calling all the plugins handlers then the prop handler.
 * - Any handler returning true will stop the next handlers to be called,
 *   including slate internal handler.
 */
declare const pipeHandler: <K extends keyof DOMHandlers>(editor: PlateEditor, { editableProps, handlerKey, }: {
    handlerKey: K;
    editableProps?: Omit<EditableProps, "decorate"> | null;
}) => ((event: any) => void) | undefined;

declare const pipeOnChange: (editor: PlateEditor, value: Value) => boolean;

/** @see {@link RenderElement} */
declare const pipeRenderElement: (editor: PlateEditor, renderElementProp?: EditableProps["renderElement"]) => EditableProps["renderElement"];

/** @see {@link RenderLeaf} */
declare const pipeRenderLeaf: (editor: PlateEditor, renderLeafProp?: EditableProps["renderLeaf"]) => EditableProps["renderLeaf"];

/** @see {@link RenderText} */
declare const pipeRenderText: (editor: PlateEditor, renderTextProp?: EditableProps["renderText"]) => EditableProps["renderText"];

/**
 * Function used to render an element. If the function returns undefined then
 * the next RenderElement function is called. If the function renders a JSX
 * element then that JSX element is rendered.
 */
type RenderElement = (props: PlateElementProps) => React__default.ReactElement<any> | undefined;
/**
 * Get a `Editable.renderElement` handler for `plugin.node.type`. If the type is
 * equals to the slate element type, render `plugin.render.node`. Else, return
 * `undefined` so the pipeline can check the next plugin.
 */
declare const pluginRenderElement: (editor: PlateEditor, plugin: AnyEditorPlatePlugin) => RenderElement;

type RenderLeaf = (props: PlateLeafProps) => React__default.ReactElement<any>;
/**
 * Get a `Editable.renderLeaf` handler for `plugin.node.type`. If the type is
 * equals to the slate leaf type, render `plugin.render.node`. Else, return
 * `children`.
 */
declare const pluginRenderLeaf: (editor: PlateEditor, plugin: AnyEditorPlatePlugin) => RenderLeaf;

type RenderText = (props: PlateTextProps) => React__default.ReactElement<any>;
/**
 * Get a `Editable.renderText` handler for `plugin.node.type`. If the type is
 * equals to the slate text type and isDecoration is false, render
 * `plugin.render.node`. Else, return the default text rendering.
 */
declare const pluginRenderText: (editor: PlateEditor, plugin: AnyEditorPlatePlugin) => RenderText;

export { type AnyEditorPlatePlugin, type AnyPlatePlugin, BLUR_EDITOR_EVENT, type CreatePlateEditorOptions, type DOMHandler, type DOMHandlers, DOM_HANDLERS, type Decorate, type Deserializer, type EditableSiblingComponent, EditorHotkeysEffect, EditorMethodsEffect, type EditorPlatePlugin, EditorRefEffect, EditorRefPluginEffect, EditorStateEffect, ElementProvider, type ElementStoreState, EventEditorPlugin, type EventEditorState, EventEditorStore, type ExtendEditor, type ExtendEditorApi, type ExtendEditorTransforms, FOCUS_EDITOR_EVENT, GLOBAL_PLATE_SCOPE, type HtmlDeserializer, type HtmlReactSerializer, type HtmlSerializer, type InferConfig, type InjectNodeProps, type KeyboardHandler, type LeafNodeProps, type NodeProps, type NodeWrapperComponent, type NodeWrapperComponentProps, type NodeWrapperComponentReturnType, type NormalizeInitialValue, type OnChange, type OverrideEditor, PLATE_SCOPE, ParagraphPlugin, type Parser, Plate, type PlateChangeKey, PlateContainer, PlateContent, type PlateContentProps, PlateController, PlateControllerEffect, type PlateControllerEffectProps, type PlateCorePlugin, type PlateEditor, PlateElement, type PlateElementProps, type PlateHTMLProps, PlateLeaf, type PlateLeafProps, type PlateNodeProps, type PlatePlugin, type PlatePluginConfig, type PlatePluginContext, type PlatePluginMethods, type PlatePlugins, type PlateProps, PlateSlate, type PlateStore, PlateStoreProvider, type PlateStoreState, PlateTest, PlateText, type PlateTextProps, ReactPlugin, type RenderElement, type RenderLeaf, type RenderNodeWrapper, type RenderNodeWrapperFunction, type RenderNodeWrapperProps, type RenderText, SCOPE_ELEMENT, type Serializer, type Shortcut, type Shortcuts, SlateReactExtensionPlugin, type StyledPlateElementProps, type StyledPlateLeafProps, type StyledPlateTextProps, type TPlateEditor, type TextNodeProps, type TransformOptions, type UseEditorSelectorOptions, type UseHooks, type WithPlateOptions, convertDomEventToSyntheticEvent, createPlateEditor, createPlateFallbackEditor, createPlatePlugin, createPlateStore, createTPlatePlugin, elementStore, getEditorPlugin, getEventPlateId, getPlateCorePlugins, getPlugin, getRenderNodeProps, isEventHandled, omitPluginContext, pipeHandler, pipeOnChange, pipeRenderElement, pipeRenderLeaf, pipeRenderText, plateControllerStore, plateStore, pluginRenderElement, pluginRenderLeaf, pluginRenderText, toPlatePlugin, toTPlatePlugin, useEditableProps, useEditorContainerRef, useEditorId, useEditorMounted, useEditorPlugin, useEditorPluginOption, useEditorPluginOptions, useEditorReadOnly, useEditorRef, useEditorScrollRef, useEditorSelection, useEditorSelector, useEditorState, useEditorValue, useEditorVersion, useElement, useElementSelector, useElementStore, useEventEditorValue, useEventPlateId, useFocusEditorEvents, useIncrementVersion, useNodeAttributes, useNodePath, usePath, usePlateControllerExists, usePlateControllerLocalStore, usePlateControllerStore, usePlateEditor, usePlateLocalStore, usePlateSet, usePlateState, usePlateStore, usePlateValue, usePluginOption, usePluginOptions, useRedecorate, useScrollRef, useSelectionVersion, useSlateProps, useValueVersion, withHOC, withPlate, withPlateReact };
