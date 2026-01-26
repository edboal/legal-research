declare const IS_APPLE: boolean;

declare const escapeRegExp: (text: string) => string;

declare const findHtmlParentElement: (el: HTMLElement | null, nodeName: string) => HTMLElement | null;

/** Call a handler if defined */
declare const getHandler: <T extends (...args: any) => any>(cb?: T, ...args: Parameters<T>) => () => void;

declare const hexToBase64: (hex: string) => string;

/**
 * RegExps. A URL must match #1 and then at least one of #2/#3. Use two levels
 * of REs to avoid REDOS.
 */
/** Loosely validate a URL `string`. */
declare const isUrl: (string: any) => boolean;

/** Merge props by composing handlers. */
declare const mergeProps: <T>(props?: T, overrideProps?: T, { handlerKeys, handlerQuery, }?: {
    /** The keys of the handlers to merge. */
    handlerKeys?: string[];
    /**
     * A function that returns true if it's a handler to merge.
     *
     * Default: keys having `on` prefix.
     */
    handlerQuery?: ((key: string) => boolean) | null;
}) => T;

interface SanitizeUrlOptions {
    allowedSchemes?: string[];
    permitInvalid?: boolean;
}
declare const sanitizeUrl: (url: string | undefined, { allowedSchemes, permitInvalid }: SanitizeUrlOptions) => string | null;

/** @returns Whether the provided parameter is undefined. */
declare const isUndefined: (obj: any) => obj is undefined;
declare const isNull: (obj: any) => obj is null;
/** @returns Whether the provided parameter is undefined or null. */
declare const isUndefinedOrNull: (obj: any) => obj is null | undefined;
/** @returns Whether the provided parameter is defined. */
declare const isDefined: <T>(arg: T | null | undefined) => arg is T;
declare function bindFirst<T, Args extends any[], R>(fn: (first: T, ...args: Args) => R, firstArg: T): (...args: Args) => R;

/** Any function. */
type AnyFunction = (...args: any) => any;
type AnyObject = Record<string, any>;
type UnknownObject = Record<string, unknown>;

declare type DeepPartial<T> = T extends (infer U)[] ? DeepPartial<U>[] : T extends readonly (infer U)[] ? readonly DeepPartial<U>[] : T extends {
    [key in keyof T]: T[key];
} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
/** 2 levels deep of partial */
type Deep2Partial<T> = {
    [K in keyof T]?: T[K] extends (...args: any[]) => any ? T[K] : Deep2Partial<T[K]>;
};
type DeepRequired<T> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

/** Get the properties from an interface which are functions */
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
/** Get the property names from an interface which are functions */
type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type DeepPartialAny<T> = {
    [P in keyof T]?: T[P] extends AnyObject ? DeepPartialAny<T[P]> : any;
};
/** Modify type properties. https://stackoverflow.com/a/55032655/6689201 */
type Modify<T, R> = Omit<T, keyof R> & R;
/**
 * Makes each property optional and turns each leaf property into any, allowing
 * for type overrides by narrowing any.
 */
/** Modify deep type properties. https://stackoverflow.com/a/65561287/6689201 */
type ModifyDeep<A extends AnyObject, B extends DeepPartialAny<A>> = {
    [K in keyof A]: B[K] extends never ? A[K] : B[K] extends AnyObject ? ModifyDeep<A[K], B[K]> : B[K];
} & (A extends AnyObject ? Omit<B, keyof A> : A);
type OmitFirst<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
type PartialPick<T, K extends keyof T> = {
    [P in K]?: T[P];
};
/** Simplify a complex type expression into a single object. */
type Simplify<T> = T extends any[] | Date ? T : {
    [K in keyof T]: T[K];
} & {};
/** Turn a union type into an intersection. */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type WithPartial<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export { type AnyFunction, type AnyObject, type Deep2Partial, type DeepPartial, type DeepPartialAny, type DeepRequired, type FunctionProperties, type FunctionPropertyNames, IS_APPLE, type Modify, type ModifyDeep, type Nullable, type OmitFirst, type PartialExcept, type PartialPick, type SanitizeUrlOptions, type Simplify, type UnionToIntersection, type UnknownObject, type WithOptional, type WithPartial, type WithRequired, bindFirst, escapeRegExp, findHtmlParentElement, getHandler, hexToBase64, isDefined, isNull, isUndefined, isUndefinedOrNull, isUrl, mergeProps, sanitizeUrl };
