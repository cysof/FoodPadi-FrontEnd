import { FetchAPI } from "@/store/FetchAPI";

export interface INotification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  notification_channel: string;
  is_read: boolean;
  created_at: string;
  related_object_type: string | null;
  related_object_id: number | null;
}

interface INotificationResponse {
  count: number;
  results: INotification[];
}

const NotificationApi = FetchAPI.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<INotificationResponse, void>({
      query: () => ({
        url: `notifyme/notifications/?notification_channel=IN_APP`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    getUnreadCount: build.query<{ unread_count: number }, void>({
      query: () => ({
        url: `notifyme/notifications/unread-count/`,
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    markAsRead: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `notifyme/notifications/${id}/mark-read/`,
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),
    markAllAsRead: build.mutation<void, void>({
      query: () => ({
        url: `notifyme/notifications/mark-all-read/`,
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = NotificationApi;