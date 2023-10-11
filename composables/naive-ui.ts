import type { LoadingBarApi } from 'naive-ui'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'

export const loadingbar = ref<LoadingBarApi>()
export const messageApi = ref<MessageApiInjection>()
export const notificationApi = ref<NotificationApiInjection>()
