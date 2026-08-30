import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Dark translucent floating panel — the vmax-style content surface that every
 * section renders its content inside, so the fixed 3D RL world shows behind it.
 *
 * Usage:
 *   <GlassPanel className="p-8 md:p-10">...</GlassPanel>
 *
 * The `.glass-panel` class (see globals.css) supplies the blur, tint, border,
 * and shadow. Pass padding / max-width / layout via className.
 */
export const GlassPanel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("glass-panel", className)} {...props}>
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
