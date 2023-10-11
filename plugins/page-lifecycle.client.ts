import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'
import { PAGE_LIFECYCLE_FROZEN } from '~/contants'

export default defineNuxtPlugin(() => {
  const state = ref(lifecycle.state)
  const frozenListeners: (() => void)[] = []
  const frozenState = useLocalStorage(PAGE_LIFECYCLE_FROZEN, false)

  lifecycle.addEventListener('statechange', (evt) => {
    if (evt.newState === 'hidden' && evt.oldState === 'frozen') {
      frozenState.value = false
      nextTick().then(() => window.location.reload())
      return
    }

    if (evt.newState === 'frozen') {
      frozenState.value = true
      frozenListeners.forEach(listener => listener())
    }
    else {
      state.value = evt.newState
    }
  })

  const addFrozenListener = (listener: () => void) => {
    frozenListeners.push(listener)
  }

  addFrozenListener(() => {
    closeDatabases()
  })

  return {
    provide: {
      pageLifecycle: reactive({
        state,
        addFrozenListener,
      }),
    },
  }
})
