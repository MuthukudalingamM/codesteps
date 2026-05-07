import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  Trophy, BookOpen, Flame, Star, MessageCircle, Zap, CheckCircle, Info
} from "lucide-react";

export interface Notification {
  id: string;
  type: "achievement" | "lesson" | "streak" | "tip" | "community" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const ICONS: Record<Notification["type"], React.ElementType> = {
  achievement: Trophy,
  lesson: BookOpen,
  streak: Flame,
  tip: Zap,
  community: MessageCircle,
  system: Info,
};

const COLORS: Record<Notification["type"], string> = {
  achievement: "text-yellow-500 bg-yellow-500/10",
  lesson: "text-blue-500 bg-blue-500/10",
  streak: "text-orange-500 bg-orange-500/10",
  tip: "text-purple-500 bg-purple-500/10",
  community: "text-pink-500 bg-pink-500/10",
  system: "text-gray-500 bg-gray-500/10",
};

function buildDefaultNotifications(username: string): Notification[] {
  return [
    {
      id: "welcome",
      type: "system",
      title: "Welcome to CodeSteps!",
      message: `Hi ${username}! Your account is set up and ready. Start with the Beginner course.`,
      time: "Just now",
      read: false,
    },
    {
      id: "tip-1",
      type: "tip",
      title: "Pro Tip",
      message: "Ask the AI Tutor anything while you learn — it remembers your conversation context.",
      time: "2 min ago",
      read: false,
    },
    {
      id: "streak-1",
      type: "streak",
      title: "Start Your Streak!",
      message: "Complete at least one lesson today to begin your daily learning streak.",
      time: "5 min ago",
      read: false,
    },
    {
      id: "course-ready",
      type: "lesson",
      title: "Course Ready",
      message: "80 lessons across Beginner, Intermediate, Advanced, and Expert levels are available for you.",
      time: "10 min ago",
      read: true,
    },
    {
      id: "challenge-1",
      type: "achievement",
      title: "Challenges Unlocked",
      message: "3 coding challenges are waiting for you. Can you solve FizzBuzz?",
      time: "1 hour ago",
      read: true,
    },
    {
      id: "community-1",
      type: "community",
      title: "Community is Live",
      message: "Join the discussion in the Community tab — ask questions and share your progress.",
      time: "2 hours ago",
      read: true,
    },
  ];
}

const STORAGE_KEY = "codesteps_notifications";

function loadNotifications(userId: string, username: string): Notification[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  const defaults = buildDefaultNotifications(username);
  saveNotifications(userId, defaults);
  return defaults;
}

function saveNotifications(userId: string, notifs: Notification[]) {
  localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(notifs));
}

export function addNotification(userId: string, notif: Omit<Notification, "id" | "read" | "time">) {
  const key = `${STORAGE_KEY}_${userId}`;
  try {
    const current: Notification[] = JSON.parse(localStorage.getItem(key) || "[]");
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false,
    };
    const updated = [newNotif, ...current].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updated));
    // Dispatch custom event to refresh any mounted NotificationCenter
    window.dispatchEvent(new CustomEvent("notifications-updated", { detail: { userId } }));
  } catch {}
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const userId = user?.id ?? "guest";

  const refresh = () => {
    if (user) setNotifications(loadNotifications(userId, user.username));
  };

  useEffect(() => {
    refresh();
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.userId === userId) refresh();
    };
    window.addEventListener("notifications-updated", handler);
    return () => window.removeEventListener("notifications-updated", handler);
  }, [user]);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(userId, updated);
  };

  const markRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveNotifications(userId, updated);
  };

  const clearAll = () => {
    setNotifications([]);
    saveNotifications(userId, []);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
            {unread > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">{unread}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unread > 0 && (
              <button
                className="text-xs text-primary hover:underline"
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                className="text-xs text-muted-foreground hover:underline"
                onClick={clearAll}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <ScrollArea className="max-h-[360px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map(notif => {
                const Icon = ICONS[notif.type];
                const color = COLORS[notif.type];
                return (
                  <button
                    key={notif.id}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors ${!notif.read ? "bg-primary/5" : ""}`}
                    onClick={() => markRead(notif.id)}
                  >
                    <div className={`p-1.5 rounded-full mt-0.5 shrink-0 ${color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-foreground">{notif.title}</p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
