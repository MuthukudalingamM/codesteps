import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Brain, 
  Code, 
  Bug, 
  Trophy, 
  Users, 
  User, 
  Settings, 
  HelpCircle,
  BookOpen
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Course", href: "/course", icon: BookOpen },
  { name: "AI Tutor", href: "/ai-tutor", icon: Brain },
  { name: "Code Editor", href: "/code-editor", icon: Code },
  { name: "Error Solver", href: "/error-solver", icon: Bug },
  { name: "Challenges", href: "/challenges", icon: Trophy },
  { name: "Community", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0 hidden lg:flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Code className="text-primary-foreground h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">CodeSteps</h1>
            <p className="text-xs text-muted-foreground">AI Programming Tutor</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <Link
          href="/help"
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors w-full"
          data-testid="nav-help"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help & Support</span>
        </Link>
      </div>
    </aside>
  );
}
