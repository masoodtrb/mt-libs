import { DependencyList, useEffect } from 'react'
import { isAbortError } from 'src/hellper/isAbortError'

type Destructor = () => void

export type FunctorAbort<A = unknown> = Promise<
  | {
      aborted: true
      cleanups?: Array<Destructor>
      err?: unknown
    }
  | {
      aborted: false
      cleanups?: Array<Destructor>
      result: A
    }
>
export type Bind = <A, B>(
  fn: (x: A) => FunctorAbort<B>,
) => (elevatedX: FunctorAbort<A>) => FunctorAbort<B>

const fromError = <A>(err: unknown): FunctorAbort<A> =>
  Promise.resolve({
    aborted: true,
    err,
  })

const makeBind: (signal: AbortSignal) => Bind =
  (signal: AbortSignal) =>
  <A, B>(fn: (x: A) => FunctorAbort<B>) =>
  async (elevatedX: FunctorAbort<A>) => {
    const x = await elevatedX
    if (x.aborted) return x
    if (signal.aborted) {
      return {
        aborted: true,
        cleanups: x.cleanups,
      }
    }
    const y = await fn(x.result).catch(fromError<B>)
    return {
      ...y,
      cleanups: y.cleanups?.length
        ? x.cleanups?.length
          ? [...x.cleanups, ...y.cleanups]
          : y.cleanups
        : x.cleanups,
    }
  }

/**
 * "Fancy" functional programming style implementation for useAsyncEffect with cancellation built into FunctorAbort.
 */
export function useAsyncEffectF(
  fn: (bind: Bind, signal: AbortSignal) => FunctorAbort,
  deps?: DependencyList,
) {
  useEffect(() => {
    const controller = new AbortController()

    const bind: Bind = makeBind(controller.signal)
    const promise = fn(bind, controller.signal)
    return () => {
      controller.abort(new Error('dependencies changed'))
      promise.then((r) => {
        if (r.aborted && r.err !== undefined && !isAbortError(r.err)) {
          console.error(r.err)
        }

        const revCleanups = r.cleanups ? r.cleanups.reverse() : []
        // last cleanup should be executed first
        for (const cleanup of revCleanups) {
          cleanup()
        }
      })
    }
  }, deps)
}

export const fromValue = <A>(x: A): FunctorAbort<A> =>
  Promise.resolve({
    aborted: false,
    cleanups: [],
    result: x,
  })
export const fromPromise = <A>(x: Promise<A>): FunctorAbort<A> => x.then(fromValue, fromError<A>)

/**
 * `fn` during its' execution should check for cancelRef value and abort early if it's true.
 */
export function useAsyncEffect(
  fn: (signal: AbortSignal) => Promise<void | Destructor>,
  deps?: DependencyList,
) {
  useAsyncEffectF((_bind, signal) => fromPromise(fn(signal)), deps)
}
