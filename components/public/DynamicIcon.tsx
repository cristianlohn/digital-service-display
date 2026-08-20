import React from "react";
import * as LucideIcons from "lucide-react";

interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className, size = 24, ...props }: DynamicIconProps) {
  const iconsRecord = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>;
  const IconComponent = iconsRecord[name] || LucideIcons.Zap;

  return <IconComponent className={className} size={size} {...props} />;
}
