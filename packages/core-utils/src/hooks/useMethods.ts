import { type Reducer, useMemo, useReducer, useRef } from 'react';

/**
 * Represents an action dispatched to update state.
 * @template T - The type of state being updated.
 */
type Action<T> = {
  type: keyof T;
  payload?: any;
};

/**
 * Defines a function that generates methods for state updates.
 * @template T - The type of state being updated.
 */
type CreateMethods<T> = (state: T) => Record<string, (...args: any[]) => T>;

/**
 * Defines the structure of wrapped methods returned by useMethods.
 * @template M - The methods available for updating state.
 */
type WrappedMethods<M> = {
  [P in keyof M]: M[P] extends (...args: infer A) => void
    ? (...args: A) => void
    : never;
};

/**
 * Custom React hook for managing state using a reducer pattern with method-based actions.
 *
 * @template T - The type of state being managed.
 * @template M - The methods available for updating state.
 *
 * @param {CreateMethods<T>} createMethods - A function that generates methods for updating state.
 * @param {T} initialState - The initial state.
 * @param {(state: T, action: keyof ReturnType<M>) => void} [onStateChange] -
 *        Optional callback triggered whenever the state changes, providing the updated state and executed action.
 *
 * @returns {[T, WrappedMethods<ReturnType<M>>]} - The state and wrapped methods to update the state.
 */
export const useMethods = <T, M extends CreateMethods<T>>(
  createMethods: M,
  initialState: T,
  onStateChange?: (state: T, action: keyof ReturnType<M>) => void
): [T, WrappedMethods<ReturnType<M>>] => {
  // Tracks the last executed action to prevent duplicate calls in Strict Mode
  const lastExecutedAction = useRef<keyof ReturnType<M> | null>(null); // 🔥 Tracks last action

  const reducer = useMemo<Reducer<T, Action<ReturnType<M>>>>(
    () => (reducerState: T, action: Action<ReturnType<M>>) => {
      const methods = createMethods(reducerState);
      const methodKey = action.type as keyof typeof methods;

      if (methodKey in methods) {
        const newState = methods[methodKey](...(action.payload || []));

        // Prevent duplicate execution by checking the last action
        if (onStateChange && lastExecutedAction.current !== action.type) {
          lastExecutedAction.current = action.type;
          onStateChange(newState, action.type);
        }

        return newState;
      }
      return reducerState;
    },
    [createMethods, onStateChange]
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Wraps dispatch calls to provide action-based state updates.
   * Converts method names into dispatchable actions.
   */
  const wrappedMethods = useMemo(() => {
    const actionTypes = Object.keys(createMethods(initialState)) as Array<
      keyof ReturnType<M>
    >;

    return actionTypes.reduce(
      (acc, type) => {
        acc[type] = ((...payload: any[]) =>
          dispatch({ type, payload })) as WrappedMethods<
          ReturnType<M>
        >[typeof type];
        return acc;
      },
      {} as WrappedMethods<ReturnType<M>>
    );
  }, [createMethods, initialState]);

  return [state, wrappedMethods];
};

