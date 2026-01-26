import * as zustand from 'zustand';
import { StateCreator, StoreMutatorIdentifier, Mutate, StoreApi } from 'zustand';
import { DevtoolsOptions as DevtoolsOptions$1, PersistOptions as PersistOptions$1, devtools, persist } from 'zustand/middleware';
export { devtools as devToolsMiddleware, persist as persistMiddleware } from 'zustand/middleware';
import { Draft as Draft$1, PatchesOptions, Options as Options$2 } from 'mutative';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import { Draft } from 'immer';

type TExtractMutatorFromMiddleware<M> = M extends (initializer: StateCreator<any, any, any, any>, ...rest: any[]) => StateCreator<any, any, infer Mutators, any> ? Mutators extends [infer Mutator, ...infer Rest] ? Mutator extends [StoreMutatorIdentifier, unknown] ? Mutator : never : never : never;
type TFlattenMiddlewares<Middlewares extends TMiddleware[]> = {
    [K in keyof Middlewares]: TExtractMutatorFromMiddleware<Middlewares[K]>;
};
type TMiddleware = (initializer: StateCreator<any, any, any>, ...rest: any[]) => StateCreator<any, any, any>;

type DevtoolsOptions = MiddlewareOption<Partial<DevtoolsOptions$1>>;

declare module 'zustand' {
    interface StoreMutators<S, A> {
        ['zustand/immer-x']: WithImmer<S>;
    }
}
type Write$1<T, U> = Omit<T, keyof U> & U;
type SkipTwo$1<T> = T extends {
    length: 0;
} ? [] : T extends {
    length: 1;
} ? [] : T extends {
    length: 0 | 1;
} ? [] : T extends [unknown, unknown, ...infer A] ? A : T extends [unknown, unknown?, ...infer A] ? A : T extends [unknown?, unknown?, ...infer A] ? A : never;
type SetStateType$1<T extends unknown[]> = Exclude<T[0], AnyFunction>;
type WithImmer<S> = Write$1<S, StoreImmer<S>>;
type StoreImmer<S> = S extends {
    setState: infer SetState;
} ? SetState extends {
    (...a: infer A1): infer Sr1;
    (...a: infer A2): infer Sr2;
} ? {
    setState(nextStateOrUpdater: SetStateType$1<A1> | Partial<SetStateType$1<A1>> | ((state: Draft<Partial<SetStateType$1<A1>>>) => void), shouldReplace?: true, ...a: SkipTwo$1<A1>): Sr1;
    setState(nextStateOrUpdater: SetStateType$1<A2> | ((state: Draft<Partial<SetStateType$1<A2>>>) => void), shouldReplace: false, ...a: SkipTwo$1<A2>): Sr2;
} : never : never;
type Options$1 = {
    enableMapSet?: boolean;
    enabledAutoFreeze?: boolean;
};
type Immer = <T, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [...Mps, ['zustand/immer-x', never]], Mcs>, options?: Options$1) => StateCreator<T, Mps, [['zustand/immer-x', never], ...Mcs]>;
declare const immerMiddleware: Immer;
type ImmerOptions = MiddlewareOption<Options$1>;

declare module 'zustand/vanilla' {
    interface StoreMutators<S, A> {
        ['zustand/mutative-x']: WithMutative<S>;
    }
}
type SetStateType<T extends unknown[]> = Exclude<T[0], AnyFunction>;
type WithMutative<S> = Write<S, StoreMutative<S>>;
type Write<T, U> = Omit<T, keyof U> & U;
type SkipTwo<T> = T extends {
    length: 0;
} ? [] : T extends {
    length: 1;
} ? [] : T extends {
    length: 0 | 1;
} ? [] : T extends [unknown, unknown, ...infer A] ? A : T extends [unknown, unknown?, ...infer A] ? A : T extends [unknown?, unknown?, ...infer A] ? A : never;
type StoreMutative<S> = S extends {
    setState: infer SetState;
} ? SetState extends {
    (...a: infer A1): infer Sr1;
    (...a: infer A2): infer Sr2;
} ? {
    setState(nextStateOrUpdater: SetStateType<A1> | Partial<SetStateType<A1>> | ((state: Draft$1<Partial<SetStateType<A1>>>) => void), shouldReplace?: true, ...a: SkipTwo<A1>): Sr1;
    setState(nextStateOrUpdater: SetStateType<A2> | ((state: Draft$1<Partial<SetStateType<A2>>>) => void), shouldReplace: false, ...a: SkipTwo<A2>): Sr2;
} : never : never;
type Options<O extends PatchesOptions, F extends boolean> = Omit<Options$2<O, F>, 'enablePatches'>;
type Mutative = <T, Mps extends [StoreMutatorIdentifier, unknown][] = [], Mcs extends [StoreMutatorIdentifier, unknown][] = [], F extends boolean = false>(initializer: StateCreator<T, [...Mps, ['zustand/mutative-x', never]], Mcs>, options?: Options<false, F>) => StateCreator<T, Mps, [['zustand/mutative-x', never], ...Mcs]>;
declare const mutativeMiddleware: Mutative;
type MutativeOptions<F extends boolean = false> = MiddlewareOption<Options<false, F>>;

type PersistOptions<StateType> = MiddlewareOption<Partial<PersistOptions$1<StateType, Partial<StateType>>>>;

type TState = object;
type TEqualityChecker<StateType> = (state: StateType, newState: StateType) => boolean;
type TCreatedStoreMutateType<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][]> = Mutate<StoreApi<StateType>, Mutators>;
type TCreatedStoreType<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][]> = UseBoundStoreWithEqualityFn<TCreatedStoreMutateType<StateType, Mutators>>;
type MiddlewareOption<T> = boolean | (T & {
    enabled?: boolean;
});
type ArrayElement<T> = T extends (infer E)[] ? E : never;
type RemoveNever<T> = T extends [infer First, ...infer Rest] ? [First] extends [never] ? RemoveNever<Rest> : [First, ...RemoveNever<Rest>] : [];

type TBaseStoreOptions<StateType extends TState> = {
    name: string;
    /**
     * Devtools middleware options.
     * https://zustand.docs.pmnd.rs/middlewares/devtools
     */
    devtools?: DevtoolsOptions;
    /**
     * Immer middleware options.
     * https://zustand.docs.pmnd.rs/middlewares/immer
     */
    immer?: ImmerOptions;
    /**
     * Mutative middleware options.
     * https://www.npmjs.com/package/mutative
     */
    mutative?: MutativeOptions;
    /**
     * Persist middleware options.
     * https://zustand.docs.pmnd.rs/middlewares/persist
     */
    persist?: PersistOptions<StateType>;
    /**
     * If you're using custom middleware like `immer` and `mutative`
     * and no need to return new state then set this value to `true`.
     */
    isMutativeState?: boolean;
};

type ConditionalMiddleware<T, Middleware extends TMiddleware, IsDefault extends boolean = false> = T extends {
    enabled: true;
} | true ? Middleware : IsDefault extends true ? T extends {
    enabled: false;
} | false ? never : Middleware : never;
type DefaultMutators<StateType extends TState, CreateStoreOptions extends TBaseStoreOptions<StateType>> = RemoveNever<TFlattenMiddlewares<[
    ConditionalMiddleware<CreateStoreOptions['devtools'], typeof devtools>,
    ConditionalMiddleware<CreateStoreOptions['persist'], typeof persist<StateType>>,
    ConditionalMiddleware<CreateStoreOptions['immer'], typeof immerMiddleware>,
    ConditionalMiddleware<CreateStoreOptions['mutative'], typeof mutativeMiddleware>
]>>;

type AnyFunction = (...args: any[]) => any;
type TSelectorBuilder<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}> = (api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>) => Record<string, AnyFunction>;
type TActionBuilder<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}> = (api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>) => Record<string, AnyFunction>;
type TStoreApiGet<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TSelectors extends Record<string, AnyFunction> = {}> = {
    <K extends keyof StateType>(key: K): StateType[K];
    <K extends keyof TSelectors>(key: K, ...args: Parameters<TSelectors[K]>): ReturnType<TSelectors[K]>;
    (key: 'state'): ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>;
};
type TStoreApiSet<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}> = {
    <K extends keyof StateType>(key: K, value: StateType[K]): void;
    <K extends keyof TActions>(key: K, ...args: Parameters<TActions[K]>): ReturnType<TActions[K]>;
    (key: 'state', value: Parameters<TCreatedStoreType<StateType, Mutators>['setState']>[0]): void;
};
type TStoreApiSubscribe<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TSelectors extends Record<string, AnyFunction> = {}> = {
    <K extends keyof StateType>(key: K, listener: (state: StateType[K], previousState: StateType[K]) => void): () => void;
    <K extends keyof StateType, S = StateType[K]>(key: K, selector: (state: StateType[K]) => S, listener: (state: S, previousState: S) => void, options?: {
        equalityFn?: TEqualityChecker<S>;
        fireImmediately?: boolean;
    }): () => void;
    <K extends keyof TSelectors>(key: K, ...args: [
        ...Parameters<TSelectors[K]>,
        listener: (state: ReturnType<TSelectors[K]>, previousState: ReturnType<TSelectors[K]>) => void
    ]): () => void;
    <K extends keyof TSelectors, S = ReturnType<TSelectors[K]>>(key: K, ...args: [
        ...Parameters<TSelectors[K]>,
        selector: (state: ReturnType<TSelectors[K]>) => S,
        listener: (state: S, previousState: S) => void,
        options?: {
            equalityFn?: TEqualityChecker<S>;
            fireImmediately?: boolean;
        }
    ]): () => void;
    (key: 'state', listener: (state: ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>, previousState: ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>) => void): () => void;
    <S = ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>>(key: 'state', selector: (state: ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>) => S, listener: (state: S, previousState: S) => void, options?: {
        equalityFn?: TEqualityChecker<S>;
        fireImmediately?: boolean;
    }): () => void;
};
type TStateApi<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}> = {
    name: string;
    get: TStoreApiGet<StateType, Mutators, TSelectors>;
    set: TStoreApiSet<StateType, Mutators, TActions>;
    subscribe: TStoreApiSubscribe<StateType, Mutators, TSelectors>;
    actions: TActions;
    selectors: TSelectors;
    store: TCreatedStoreMutateType<StateType, Mutators>;
    useStore: TCreatedStoreType<StateType, Mutators>;
    useValue: {
        <K extends keyof StateType>(key: K): StateType[K];
        <K extends keyof TSelectors>(key: K, ...args: Parameters<TSelectors[K]>): ReturnType<TSelectors[K]>;
        (key: 'state'): ReturnType<TCreatedStoreType<StateType, Mutators>['getState']>;
        <K extends keyof StateType>(key: K, equalityFn?: TEqualityChecker<StateType[K]>): StateType[K];
        <K extends keyof TSelectors>(key: K, ...args: [
            ...Parameters<TSelectors[K]>,
            TEqualityChecker<ReturnType<TSelectors[K]>>?
        ]): ReturnType<TSelectors[K]>;
    };
    useState: {
        <K extends keyof StateType>(key: K, equalityFn?: TEqualityChecker<StateType[K]>): [StateType[K], (value: StateType[K]) => void];
    };
    useTracked: <K extends keyof StateType>(key: K) => StateType[K];
    useTrackedStore: () => StateType;
    extendSelectors<SelectorBuilder extends TSelectorBuilder<StateType, Mutators, TActions, TSelectors>>(builder: SelectorBuilder): TStateApi<StateType, Mutators, TActions, TSelectors & ReturnType<SelectorBuilder>>;
    extendActions<ActionBuilder extends TActionBuilder<StateType, Mutators, TActions, TSelectors>>(builder: ActionBuilder): TStateApi<StateType, Mutators, TActions & ReturnType<ActionBuilder>, TSelectors>;
};
type TStateApiForBuilder<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}> = Omit<TStateApi<StateType, Mutators, TActions, TSelectors>, 'extendActions' | 'extendSelectors'>;

/**
 * Creates zustand store with additional selectors and actions.
 *
 * @param {StateType | StateCreator<StateType, Mps, Mcs>} initializer - A function or object that initializes the state.
 * @param {TBaseStoreOptions<StateType>} options - store create options.
 */
declare const createStore: <StateType extends object, Mps extends [keyof zustand.StoreMutators<unknown, unknown>, unknown][] = [], Mcs extends [keyof zustand.StoreMutators<unknown, unknown>, unknown][] = [], CreateStoreOptions extends TBaseStoreOptions<StateType> = TBaseStoreOptions<StateType>>(initializer: StateType | StateCreator<StateType, Mps, Mcs>, options: CreateStoreOptions) => TStateApi<StateType, [...DefaultMutators<StateType, CreateStoreOptions>, ...Mcs], {}, {}>;
declare const createZustandStore: <StateType extends object, Mps extends [keyof zustand.StoreMutators<unknown, unknown>, unknown][] = [], Mcs extends [keyof zustand.StoreMutators<unknown, unknown>, unknown][] = [], CreateStoreOptions extends TBaseStoreOptions<StateType> = TBaseStoreOptions<StateType>>(initializer: StateType | StateCreator<StateType, Mps, Mcs>, options: CreateStoreOptions) => TStateApi<StateType, [...DefaultMutators<StateType, CreateStoreOptions>, ...Mcs], {}, {}>;

declare function useStoreValue<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}, K extends keyof StateType = keyof StateType>(store: TStateApi<StateType, Mutators, TActions, TSelectors>, key: K): StateType[K];
declare function useStoreValue<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}, K extends keyof TSelectors = keyof TSelectors>(store: TStateApi<StateType, Mutators, TActions, TSelectors>, key: K, ...args: Parameters<TSelectors[K]>): ReturnType<TSelectors[K]>;
declare function useStoreValue<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}>(store: TStateApi<StateType, Mutators, TActions, TSelectors>, key: 'state'): StateType;
declare function useStoreValue<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}, K extends keyof StateType = keyof StateType>(store: TStateApi<StateType, Mutators, TActions, TSelectors>, key: K, equalityFn?: TEqualityChecker<StateType[K]>): StateType[K];
declare function useStoreValue<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}, K extends keyof TSelectors = keyof TSelectors>(store: TStateApi<StateType, Mutators, TActions, TSelectors>, key: K, ...args: [
    ...Parameters<TSelectors[K]>,
    TEqualityChecker<ReturnType<TSelectors[K]>>?
]): ReturnType<TSelectors[K]>;
declare function useStoreState<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}, K extends keyof StateType = keyof StateType>(store: TStateApi<StateType, Mutators, TActions, TSelectors>, key: K, equalityFn?: TEqualityChecker<StateType[K]>): [StateType[K], (value: StateType[K]) => void];
declare function useTrackedStore<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}>(store: TStateApi<StateType, Mutators, TActions, TSelectors>): StateType;
declare function useTracked<StateType extends TState, Mutators extends [StoreMutatorIdentifier, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}, K extends keyof StateType = keyof StateType>(store: TStateApi<StateType, Mutators, TActions, TSelectors>, key: K): StateType[K];
/**
 * Use zustand store selector with optional equality function.
 * @example
 * const name = useStoreSelect(store, (state) => state.name, equalityFn)
 */
declare const useStoreSelect: <StateType extends object, Mutators extends [keyof zustand.StoreMutators<unknown, unknown>, unknown][], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}, U = StateType>(store: TStateApi<StateType, Mutators, TActions, TSelectors>, selector: (state: StateType) => U, equalityFn?: ((a: U, b: U) => boolean) | undefined) => U;

declare const extendActions: <StateType extends object, Mutators extends [keyof zustand.StoreMutators<unknown, unknown>, unknown][], TActions extends Record<string, AnyFunction>, TSelectors extends Record<string, AnyFunction>, Builder extends TActionBuilder<StateType, Mutators, TActions, TSelectors>>(builder: Builder, api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>) => {
    actions: TActions & Record<string, AnyFunction>;
    set: <K extends keyof StateType & keyof TActions>(key: K, ...args: K extends keyof TActions ? Parameters<TActions[K]> : K extends keyof StateType ? [StateType[K]] : never) => any;
    subscribe: TStoreApiSubscribe<StateType, Mutators, TSelectors>;
    get: TStoreApiGet<StateType, Mutators, TSelectors>;
    name: string;
    store: zustand.Mutate<zustand.StoreApi<StateType>, Mutators>;
    selectors: TSelectors;
    useStore: TCreatedStoreType<StateType, Mutators>;
    useValue: {
        <K_1 extends keyof StateType>(key: K_1): StateType[K_1];
        <K_2 extends keyof TSelectors>(key: K_2, ...args: Parameters<TSelectors[K_2]>): ReturnType<TSelectors[K_2]>;
        (key: "state"): ReturnType<TCreatedStoreType<StateType, Mutators>["getState"]>;
        <K_3 extends keyof StateType>(key: K_3, equalityFn?: TEqualityChecker<StateType[K_3]> | undefined): StateType[K_3];
        <K_4 extends keyof TSelectors>(key: K_4, ...args: [...Parameters<TSelectors[K_4]>, (TEqualityChecker<ReturnType<TSelectors[K_4]>> | undefined)?]): ReturnType<TSelectors[K_4]>;
    };
    useState: <K_5 extends keyof StateType>(key: K_5, equalityFn?: TEqualityChecker<StateType[K_5]> | undefined) => [StateType[K_5], (value: StateType[K_5]) => void];
    useTracked: <K_6 extends keyof StateType>(key: K_6) => StateType[K_6];
    useTrackedStore: () => StateType;
};

declare const extendSelectors: <StateType extends object, Mutators extends [keyof zustand.StoreMutators<unknown, unknown>, unknown][], TActions extends Record<string, AnyFunction>, TSelectors extends Record<string, AnyFunction>, Builder extends TSelectorBuilder<StateType, Mutators, TActions, TSelectors>>(builder: Builder, api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>) => {
    get: <K extends "state" | keyof StateType | keyof TSelectors>(key: K, ...args: K extends keyof TSelectors ? Parameters<TSelectors[K]> : []) => any;
    subscribe: <K_1 extends "state" | keyof StateType | keyof TSelectors>(key: "state" | keyof StateType | keyof TSelectors, args_0: K_1 extends keyof TSelectors ? Parameters<TSelectors[K_1]> : [], selector: AnyFunction, listener: AnyFunction, options?: any) => () => void;
    selectors: TSelectors & Record<string, AnyFunction>;
    useValue: <K_2 extends keyof StateType | keyof TSelectors>(key: K_2, ...args: K_2 extends keyof TSelectors ? [...Parameters<TSelectors[K_2]>, TEqualityChecker<ReturnType<TSelectors[K_2]>> | undefined] : [TEqualityChecker<StateType[keyof StateType]> | undefined]) => any;
    set: TStoreApiSet<StateType, Mutators, TActions>;
    name: string;
    store: zustand.Mutate<zustand.StoreApi<StateType>, Mutators>;
    actions: TActions;
    useStore: TCreatedStoreType<StateType, Mutators>;
    useState: <K_3 extends keyof StateType>(key: K_3, equalityFn?: TEqualityChecker<StateType[K_3]> | undefined) => [StateType[K_3], (value: StateType[K_3]) => void];
    useTracked: <K_4 extends keyof StateType>(key: K_4) => StateType[K_4];
    useTrackedStore: () => StateType;
};

declare const getOptions: <T extends MiddlewareOption<object> | undefined>(option: T, fallbackEnabled?: boolean) => {
    enabled: boolean;
} & Omit<Exclude<T, boolean | undefined>, "enabled">;

declare const storeFactory: <StateType extends object, Mutators extends [keyof zustand.StoreMutators<unknown, unknown>, unknown][] = [], TActions extends Record<string, AnyFunction> = {}, TSelectors extends Record<string, AnyFunction> = {}>(api: TStateApiForBuilder<StateType, Mutators, TActions, TSelectors>) => TStateApi<StateType, Mutators, TActions, TSelectors>;

export { type AnyFunction, type ArrayElement, type DefaultMutators, type DevtoolsOptions, type ImmerOptions, type MiddlewareOption, type MutativeOptions, type PersistOptions, type RemoveNever, type TActionBuilder, type TBaseStoreOptions, type TCreatedStoreMutateType, type TCreatedStoreType, type TEqualityChecker, type TExtractMutatorFromMiddleware, type TFlattenMiddlewares, type TMiddleware, type TSelectorBuilder, type TState, type TStateApi, type TStateApiForBuilder, type TStoreApiGet, type TStoreApiSet, type TStoreApiSubscribe, createStore, createZustandStore, extendActions, extendSelectors, getOptions, immerMiddleware, mutativeMiddleware, storeFactory, useStoreSelect, useStoreState, useStoreValue, useTracked, useTrackedStore };
