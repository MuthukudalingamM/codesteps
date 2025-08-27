import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  progress?: number;
  variant?: "default" | "accent" | "primary";
}

export function ProgressCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  progress,
  variant = "primary" 
}: ProgressCardProps) {
  const getIconBgClass = () => {
    switch (variant) {
      case "accent":
        return "bg-accent/10 text-accent";
      case "primary":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm" data-testid={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground" data-testid={`card-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1" data-testid={`card-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                {description}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconBgClass()}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" data-testid={`progress-${title.toLowerCase().replace(/\s+/g, '-')}`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
