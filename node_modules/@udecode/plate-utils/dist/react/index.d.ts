import React$1 from 'react';
import { PlateElementProps } from '@udecode/plate-core/react';
import { AnyObject } from '@udecode/utils';
import * as _udecode_slate from '@udecode/slate';
import { QueryNodeOptions, TElement, EditorPropOptions } from '@udecode/slate';

declare const createNodeHOC: <T>(HOC: React$1.FC<T>) => (Component: any, props: Omit<T, keyof PlateElementProps>) => (childrenProps: PlateElementProps) => React$1.JSX.Element;

type CreateHOCOptions<T> = {
    /** Set HOC by key. */
    key?: string;
    /** Set HOC by key. */
    keys?: string[];
} & AnyObject & Partial<T>;
/** Create components HOC by plugin key. */
declare const createNodesHOC: <T>(HOC: React.FC<T>) => (components: any, options: CreateHOCOptions<T> | CreateHOCOptions<T>[]) => any;
/** Create components HOC by plugin key with a custom HOC. */
declare const createNodesWithHOC: <T>(withHOC: (component: any, props: T) => any) => (components: any, options: CreateHOCOptions<T> | CreateHOCOptions<T>[]) => any;

declare const useEditorString: () => string;

interface InputProps {
    /**
     * Should we activate the onKeyDownCapture handler to preventDefault when the
     * user presses enter?
     */
    preventDefaultOnEnterKeydown?: boolean;
}
/**
 * Hook to allow the user to spread a set of predefined props to the Div wrapper
 * of an Input element
 *
 * @param param0 An options object which can be expanded to add further
 *   functionality
 * @returns A props object which can be spread onto the element
 */
declare const useFormInputProps: (options?: InputProps) => {
    props: {
        onKeyDownCapture?: undefined;
    };
} | {
    props: {
        onKeyDownCapture: ((e: React.KeyboardEvent<HTMLDivElement>) => void) | undefined;
    };
};

declare const useMarkToolbarButtonState: ({ clear, nodeType, }: {
    nodeType: string;
    clear?: string[] | string;
}) => {
    clear: string | string[] | undefined;
    nodeType: string;
    pressed: boolean;
};
declare const useMarkToolbarButton: (state: ReturnType<typeof useMarkToolbarButtonState>) => {
    props: {
        pressed: boolean;
        onClick: () => void;
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
};

interface PlaceholderProps extends PlateElementProps {
    placeholder: string;
    hideOnBlur?: boolean;
    query?: QueryNodeOptions;
}
declare const usePlaceholderState: ({ element, hideOnBlur, path, query, }: PlaceholderProps) => {
    enabled: boolean;
};

declare const useRemoveNodeButton: ({ element }: {
    element: TElement;
}) => {
    props: {
        onClick: () => void;
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
};

declare function useSelectionCollapsed(): boolean;
declare function useSelectionExpanded(): boolean;
declare function useSelectionWithinBlock(): boolean;
declare function useSelectionAcrossBlocks(): boolean;

declare const useSelectionFragment: (options?: {
    structuralTypes?: string[];
}) => _udecode_slate.ElementOrTextIn<_udecode_slate.Value>[];
declare const useSelectionFragmentProp: ({ structuralTypes, ...options }?: {
    structuralTypes?: string[];
} & Omit<EditorPropOptions, "nodes">) => string | undefined;

export { type CreateHOCOptions, type PlaceholderProps, createNodeHOC, createNodesHOC, createNodesWithHOC, useEditorString, useFormInputProps, useMarkToolbarButton, useMarkToolbarButtonState, usePlaceholderState, useRemoveNodeButton, useSelectionAcrossBlocks, useSelectionCollapsed, useSelectionExpanded, useSelectionFragment, useSelectionFragmentProp, useSelectionWithinBlock };
