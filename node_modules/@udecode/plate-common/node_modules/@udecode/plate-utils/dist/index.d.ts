import { ApplyDeepToNodesOptions, SlateEditor } from '@udecode/plate-core';
import { TNode } from '@udecode/slate';

/** Recursively merge a source object to children nodes with a query. */
declare const defaultsDeepToNodes: <N extends TNode>(options: Omit<ApplyDeepToNodesOptions<N>, "apply">) => void;

/** Does the node match the type provided. */
declare const isType: (editor: SlateEditor, node: any, key?: string[] | string) => boolean;

interface MoveSelectionByOffsetOptions {
    query?: (editor: SlateEditor) => boolean;
}
declare const moveSelectionByOffset: (editor: SlateEditor, { event, query, }: {
    event: KeyboardEvent;
} & MoveSelectionByOffsetOptions) => boolean | undefined;

type ClassNames<T> = {
    classNames?: Partial<T>;
};

type OnError = (err: any) => void;
interface ErrorHandler {
    onError?: OnError;
}

export { type ClassNames, type ErrorHandler, type MoveSelectionByOffsetOptions, type OnError, defaultsDeepToNodes, isType, moveSelectionByOffset };
