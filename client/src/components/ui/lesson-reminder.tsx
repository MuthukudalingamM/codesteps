import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Clock, 
  BookOpen, 
  X, 
  Calendar, 
  Star,
  Target,
  TrendingUp 
} from "lucide-react";
import { useLocation } from "wouter";

interface LessonReminder {
  id: string;
  title: string;
  type: 'daily' | 'streak' | 'comeback' | 'achievement' | 'scheduled';
  message: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
  lessonId?: string;
  dueDate?: Date;
  streak?: number;
}

interface LessonReminderProps {
  userId?: string;
  currentProgress?: any;
  lastActive?: Date;
}

export function LessonReminder({ userId, currentProgress, lastActive }: LessonReminderProps) {
  const [reminders, setReminders] = useState<LessonReminder[]>([]);
  const [dismissedReminders, setDismissedReminders] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    generateReminders();
  }, [currentProgress, lastActive]);

  const generateReminders = () => {
    const newReminders: LessonReminder[] = [];
    const now = new Date();
    const daysSinceLastActive = lastActive 
      ? Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Daily Learning Reminder
    const lastLessonToday = localStorage.getItem('lastLessonDate');
    const today = now.toDateString();
    
    if (lastLessonToday !== today) {
      newReminders.push({
        id: 'daily-reminder',
        title: 'Daily Learning Goal',
        type: 'daily',
        message: "You haven't completed your daily lesson yet. Keep your learning streak alive!",
        action: 'Start Learning',
        priority: 'medium'
      });
    }

    // Streak Reminder
    const currentStreak = parseInt(localStorage.getItem('learningStreak') || '0');
    if (currentStreak >= 3 && daysSinceLastActive === 0) {
      newReminders.push({
        id: 'streak-celebration',
        title: `${currentStreak}-Day Streak! 🔥`,
        type: 'streak',
        message: `Amazing! You're on a ${currentStreak}-day learning streak. Don't break the chain!`,
        action: 'Continue Streak',
        priority: 'high',
        streak: currentStreak
      });
    }

    // Comeback Reminder
    if (daysSinceLastActive >= 3) {
      newReminders.push({
        id: 'comeback-reminder',
        title: 'We Miss You!',
        type: 'comeback',
        message: `It's been ${daysSinceLastActive} days since your last lesson. Let's get back to coding!`,
        action: 'Resume Learning',
        priority: 'high'
      });
    }

    // Progress-based reminders
    if (currentProgress) {
      const completedLessons = currentProgress.filter((p: any) => p.status === 'completed').length;
      const totalLessons = currentProgress.length;
      const progressPercentage = (completedLessons / totalLessons) * 100;

      if (progressPercentage >= 50 && progressPercentage < 75) {
        newReminders.push({
          id: 'halfway-milestone',
          title: 'Halfway There! 🎯',
          type: 'achievement',
          message: `You've completed ${Math.round(progressPercentage)}% of your course. You're doing great!`,
          action: 'Continue Learning',
          priority: 'medium'
        });
      }
    }

    // Scheduled Reminder (morning motivation)
    const currentHour = now.getHours();
    if (currentHour >= 9 && currentHour <= 11) {
      newReminders.push({
        id: 'morning-motivation',
        title: 'Good Morning! ☀️',
        type: 'scheduled',
        message: "Perfect time to start coding! Your brain is fresh and ready to learn new concepts.",
        action: 'Start Coding',
        priority: 'low'
      });
    }

    // Evening wrap-up
    if (currentHour >= 18 && currentHour <= 20) {
      newReminders.push({
        id: 'evening-review',
        title: 'Evening Review 📚',
        type: 'scheduled',
        message: "End your day with some coding practice or review what you learned today.",
        action: 'Review & Practice',
        priority: 'low'
      });
    }

    // Filter out dismissed reminders
    const activeReminders = newReminders.filter(
      reminder => !dismissedReminders.includes(reminder.id)
    );

    setReminders(activeReminders);
  };

  const dismissReminder = (reminderId: string) => {
    setDismissedReminders(prev => [...prev, reminderId]);
    setReminders(prev => prev.filter(r => r.id !== reminderId));
    
    // Store dismissed reminders in localStorage with expiry
    const dismissed = JSON.parse(localStorage.getItem('dismissedReminders') || '{}');
    dismissed[reminderId] = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    localStorage.setItem('dismissedReminders', JSON.stringify(dismissed));
  };

  const handleReminderAction = (reminder: LessonReminder) => {
    // Mark lesson date for daily tracking
    if (reminder.type === 'daily' || reminder.type === 'streak') {
      localStorage.setItem('lastLessonDate', new Date().toDateString());
    }

    // Navigate based on reminder type
    switch (reminder.type) {
      case 'daily':
      case 'streak':
      case 'comeback':
        setLocation('/ai-tutor');
        break;
      case 'achievement':
        setLocation('/course');
        break;
      case 'scheduled':
        setLocation('/code-editor');
        break;
      default:
        setLocation('/dashboard');
    }

    dismissReminder(reminder.id);
    
    toast({
      title: "Great Choice! 🚀",
      description: "Let's continue your coding journey!"
    });
  };

  const getReminderIcon = (type: LessonReminder['type']) => {
    switch (type) {
      case 'daily': return <Clock className="h-4 w-4" />;
      case 'streak': return <TrendingUp className="h-4 w-4" />;
      case 'comeback': return <BookOpen className="h-4 w-4" />;
      case 'achievement': return <Star className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: LessonReminder['priority']) => {
    switch (priority) {
      case 'high': return 'border-destructive bg-destructive/5';
      case 'medium': return 'border-primary bg-primary/5';
      case 'low': return 'border-muted bg-muted/5';
      default: return 'border-border bg-background';
    }
  };

  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {reminders.slice(0, 3).map((reminder) => (
        <Alert 
          key={reminder.id} 
          className={`relative ${getPriorityColor(reminder.priority)} transition-all duration-300 hover:shadow-md`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getReminderIcon(reminder.type)}
            </div>
            <div className="flex-1 min-w-0">
              <AlertTitle className="flex items-center justify-between">
                <span className="font-semibold">{reminder.title}</span>
                <div className="flex items-center space-x-2">
                  {reminder.streak && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                      {reminder.streak} days
                    </Badge>
                  )}
                  <Badge 
                    variant={
                      reminder.priority === 'high' ? 'destructive' : 
                      reminder.priority === 'medium' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {reminder.priority}
                  </Badge>
                </div>
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm leading-relaxed">
                {reminder.message}
              </AlertDescription>
              <div className="flex items-center justify-between mt-4">
                <Button 
                  onClick={() => handleReminderAction(reminder)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  {reminder.action}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissReminder(reminder.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      ))}
      
      {reminders.length > 3 && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Bell className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">
                +{reminders.length - 3} more reminders
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Hook for managing lesson reminders
export function useLessonReminders() {
  const [reminderSettings, setReminderSettings] = useState({
    dailyReminders: true,
    streakReminders: true,
    comebackReminders: true,
    achievementReminders: true,
    scheduledReminders: true,
    reminderTime: '09:00'
  });

  const updateReminderSettings = (newSettings: Partial<typeof reminderSettings>) => {
    const updated = { ...reminderSettings, ...newSettings };
    setReminderSettings(updated);
    localStorage.setItem('reminderSettings', JSON.stringify(updated));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const scheduleNotification = (title: string, message: string, delay: number = 0) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }, delay);
    }
  };

  return {
    reminderSettings,
    updateReminderSettings,
    requestNotificationPermission,
    scheduleNotification
  };
}
