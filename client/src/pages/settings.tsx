import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Shield, 
  User, 
  Volume2,
  Monitor,
  Moon,
  Sun,
  Smartphone
} from "lucide-react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    pushNotifications: true,
    lessonReminders: true,
    communityUpdates: false,
    achievementAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    difficulty: "intermediate",
    codeTheme: "dark",
    fontSize: "medium",
    autoSave: true,
    soundEffects: true,
  });

  const [account, setAccount] = useState({
    username: "Alex",
    email: "alex@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences updated",
      description: "Your learning preferences have been saved.",
    });
  };

  const handleSaveAccount = () => {
    if (account.newPassword && account.newPassword !== account.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account updated",
      description: "Your account settings have been saved.",
    });
    
    setAccount({
      ...account,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog
    toast({
      title: "Account deletion requested",
      description: "Please contact support to complete account deletion.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Customize your CodeSteps experience</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" data-testid="tab-appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account" data-testid="tab-account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Learning Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Primary Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                    <SelectTrigger data-testid="language-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Default Difficulty</Label>
                  <Select value={preferences.difficulty} onValueChange={(value) => setPreferences({...preferences, difficulty: value})}>
                    <SelectTrigger data-testid="difficulty-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Code Editor Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="code-theme">Code Theme</Label>
                    <Select value={preferences.codeTheme} onValueChange={(value) => setPreferences({...preferences, codeTheme: value})}>
                      <SelectTrigger data-testid="code-theme-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (follows system)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select value={preferences.fontSize} onValueChange={(value) => setPreferences({...preferences, fontSize: value})}>
                      <SelectTrigger data-testid="font-size-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save code</Label>
                    <p className="text-sm text-muted-foreground">Automatically save your code as you type</p>
                  </div>
                  <Switch
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                    data-testid="auto-save-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for achievements and notifications</p>
                  </div>
                  <Switch
                    checked={preferences.soundEffects}
                    onCheckedChange={(checked) => setPreferences({...preferences, soundEffects: checked})}
                    data-testid="sound-effects-switch"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePreferences} data-testid="save-preferences">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email digest</Label>
                    <p className="text-sm text-muted-foreground">Weekly summary of your progress</p>
                  </div>
                  <Switch
                    checked={notifications.emailDigest}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailDigest: checked})}
                    data-testid="email-digest-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                    data-testid="push-notifications-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lesson reminders</Label>
                    <p className="text-sm text-muted-foreground">Daily reminders to continue learning</p>
                  </div>
                  <Switch
                    checked={notifications.lessonReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, lessonReminders: checked})}
                    data-testid="lesson-reminders-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Community updates</Label>
                    <p className="text-sm text-muted-foreground">New posts and replies in discussions you follow</p>
                  </div>
                  <Switch
                    checked={notifications.communityUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, communityUpdates: checked})}
                    data-testid="community-updates-switch"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Achievement alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications when you earn new achievements</p>
                  </div>
                  <Switch
                    checked={notifications.achievementAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, achievementAlerts: checked})}
                    data-testid="achievement-alerts-switch"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} data-testid="save-notifications">
                  Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Theme & Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground mb-3">Choose your preferred theme</p>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      data-testid="theme-light"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Sun className="h-6 w-6" />
                        <span className="text-sm font-medium">Light</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setTheme("dark")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      data-testid="theme-dark"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Moon className="h-6 w-6" />
                        <span className="text-sm font-medium">Dark</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setTheme("system")}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      data-testid="theme-system"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Monitor className="h-6 w-6" />
                        <span className="text-sm font-medium">System</span>
                      </div>
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Accessibility</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High contrast mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                    </div>
                    <Switch data-testid="high-contrast-switch" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduce motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                    </div>
                    <Switch data-testid="reduce-motion-switch" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={account.username}
                    onChange={(e) => setAccount({...account, username: e.target.value})}
                    data-testid="username-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={account.email}
                    onChange={(e) => setAccount({...account, email: e.target.value})}
                    data-testid="email-input"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Change Password</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={account.currentPassword}
                      onChange={(e) => setAccount({...account, currentPassword: e.target.value})}
                      data-testid="current-password-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={account.newPassword}
                        onChange={(e) => setAccount({...account, newPassword: e.target.value})}
                        data-testid="new-password-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={account.confirmPassword}
                        onChange={(e) => setAccount({...account, confirmPassword: e.target.value})}
                        data-testid="confirm-password-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAccount} data-testid="save-account">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="font-medium text-foreground mb-2">Delete Account</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  data-testid="delete-account-button"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
