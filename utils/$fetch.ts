import type { AsyncData, FetchResult, UseFetchOptions } from 'nuxt/app'
import type { KeysOf, PickFrom } from 'nuxt/dist/app/composables/asyncData'
import { FetchError } from 'ofetch'
import type { FetchOptions } from 'ofetch'
import type { NitroFetchRequest, AvailableRouterMethod as _AvailableRouterMethod } from 'nitropack'

type AvailableRouterMethod<R extends NitroFetchRequest> = _AvailableRouterMethod<R> | Uppercase<_AvailableRouterMethod<R>>
interface NitroFetchOptions<R extends NitroFetchRequest, M extends AvailableRouterMethod<R> = AvailableRouterMethod<R>> extends FetchOptions {
  method: Uppercase<M> | M
}

export async function $efetch<
  T = unknown,
  R extends NitroFetchRequest = NitroFetchRequest,
  O extends NitroFetchOptions<R> = NitroFetchOptions<R>,
>(
  request: R,
  options?: O,
) {
  const headers = useRequestHeaders(['cookie'])

  const p = $fetch<T, R>(request, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  })

  p
    .catch((error) => {
      if (!isInstanceof(error, FetchError))
        throw error

      const e = error as unknown as FetchError<T>
      switch (e.response?.status) {
        case 401:
        case 419:
          useCookie('authorization').value = undefined
          navigateTo('/account')
          break
        default:
          throw error
      }
    })

  return await p
}

export function useEfetch<
  ResT = void,
  ErrorT = FetchError,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'get' extends AvailableRouterMethod<ReqT> ? 'get' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
  DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
>(
  request: Ref<ReqT> | ReqT | (() => ReqT),
  opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null>
export function useEfetch<
  ResT = void,
  ErrorT = FetchError,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'get' extends AvailableRouterMethod<ReqT> ? 'get' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
  DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = DataT,
>(
  request: Ref<ReqT> | ReqT | (() => ReqT),
  opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, ErrorT | null>
export async function useEfetch<
  ResT = void,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'get' extends AvailableRouterMethod<ReqT> ? 'get' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
  DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
>(
  request: Ref<ReqT> | ReqT | (() => ReqT),
  opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>,
) {
  const headers = useRequestHeaders(['cookie'])

  const result = await useFetch(request, {
    ...opts,
    headers,
  })

  const { error, status } = result

  if (status.value === 'error') {
    switch (error.value?.statusCode) {
      case 401:
      case 419:
        useCookie('authorization').value = undefined
        navigateTo('/account')
        break
      default:
        throw error
    }
  }

  return result
}
