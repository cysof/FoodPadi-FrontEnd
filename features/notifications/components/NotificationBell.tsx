"use client";

import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  INotification,
} from "../data/NotificationApi";

const NotificationItem = ({
  notification,
  onRead,
}: {
  notification: INotification;
  onRead: (id: number) => void;
}) => {
  return (
    <div
      onClick={() => !notification.is_read && onRead(notification.id)}
      className={`flex flex-col gap-1 p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
        notification.is_read
          ? "bg-white hover:bg-gray-50"
          : "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h5
          className={`font-square text-sm ${
            notification.is_read
              ? "font-normal text-gray-600"
              : "font-medium text-primary-black"
          }`}
        >
          {notification.title}
        </h5>
        {!notification.is_read && (
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
        )}
      </div>
      <p className="font-inter text-xs text-gray-500 line-clamp-2">
        {notification.message}
      </p>
      <p className="font-inter text-xs text-gray-400">
        {new Intl.DateTimeFormat("en-NG", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(notification.created_at))}
      </p>
    </div>
  );
};

const NotificationBell = () => {
  const op = useRef<OverlayPanel>(null);
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000, // poll every 30 seconds
  });
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const unreadCount = unreadData?.unread_count ?? 0;

  const handleRead = async (id: number) => {
    await markAsRead({ id });
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <>
      <button
        onClick={(e) => op.current?.toggle(e)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <i className="pi pi-bell text-xl text-primary-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <OverlayPanel
        ref={op}
        className="w-80 shadow-lg"
        pt={{
          content: { className: "p-0" },
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-square font-bold text-sm text-primary-black">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs">
                {unreadCount}
              </span>
            )}
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="font-inter text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="flex flex-col gap-1 p-2 max-h-80 overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1 p-3">
                <Skeleton width="60%" height="14px" />
                <Skeleton width="100%" height="12px" />
                <Skeleton width="40%" height="10px" />
              </div>
            ))
          ) : notifications?.results?.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <i className="pi pi-bell-slash text-3xl text-gray-300" />
              <p className="font-inter text-sm text-gray-400">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications?.results?.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleRead}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications && notifications.results?.length > 0 && (
          <div className="px-4 py-3 border-t">
            <p className="font-inter text-xs text-gray-400 text-center">
              Showing latest {notifications.results.length} notifications
            </p>
          </div>
        )}
      </OverlayPanel>
    </>
  );
};

export default NotificationBell;