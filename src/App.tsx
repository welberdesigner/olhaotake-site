import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AnimatedWallpaper } from "@/components/animated-wallpaper";
import { DesktopDock } from "@/components/desktop-dock";
import { DesktopTopbar } from "@/components/desktop-topbar";
import { DesktopWidgets } from "@/components/desktop-widgets";
import { LaunchpadOverlay } from "@/components/launchpad-overlay";
import { WindowManager } from "@/components/window-manager";
import type { WindowKey, WindowOrigin } from "@/lib/windows";

export function App() {
  const [openWindow, setOpenWindow] = useState<WindowKey | null>(null);
  const [windowOrigin, setWindowOrigin] = useState<WindowOrigin | null>(null);
  const [launchpadOpen, setLaunchpadOpen] = useState(false);

  function openWindow_(key: WindowKey, origin: WindowOrigin) {
    setLaunchpadOpen(false);
    setWindowOrigin(origin);
    setOpenWindow(key);
  }

  return (
    <div className="relative min-h-svh">
      <AnimatedWallpaper />

      <DesktopTopbar onOpenWindow={openWindow_} />
      <DesktopWidgets />
      <DesktopDock onOpenLaunchpad={() => setLaunchpadOpen(true)} onOpenWindow={openWindow_} />

      <AnimatePresence>
        {launchpadOpen && (
          <LaunchpadOverlay onClose={() => setLaunchpadOpen(false)} onOpenWindow={openWindow_} />
        )}
      </AnimatePresence>

      <WindowManager
        openWindow={openWindow}
        origin={windowOrigin}
        onClose={() => setOpenWindow(null)}
        onOpenWindow={openWindow_}
      />
    </div>
  );
}
