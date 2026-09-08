import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AnimatedWallpaper } from "@/components/animated-wallpaper";
import { BootScreen } from "@/components/boot-screen";
import { DesktopContextMenu } from "@/components/desktop-context-menu";
import { DesktopDock } from "@/components/desktop-dock";
import { DesktopTopbar } from "@/components/desktop-topbar";
import { DesktopWidgets } from "@/components/desktop-widgets";
import { InstagramNotificationToast } from "@/components/instagram-notification-toast";
import { LaunchpadOverlay } from "@/components/launchpad-overlay";
import { MobileHomeScreen } from "@/components/mobile-home-screen";
import { WindowManager } from "@/components/window-manager";
import { useIsMobile } from "@/hooks/use-mobile";
import type { WindowKey, WindowOrigin } from "@/lib/windows";

export function App() {
  const isMobile = useIsMobile();
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

      {isMobile ? (
        <MobileHomeScreen onOpenWindow={openWindow_} onOpenLaunchpad={() => setLaunchpadOpen(true)} />
      ) : (
        <>
          <DesktopTopbar onOpenWindow={openWindow_} />
          <DesktopWidgets />
          <DesktopDock onOpenLaunchpad={() => setLaunchpadOpen(true)} onOpenWindow={openWindow_} />
        </>
      )}

      <AnimatePresence>
        {launchpadOpen && (
          <LaunchpadOverlay onClose={() => setLaunchpadOpen(false)} onOpenWindow={openWindow_} />
        )}
      </AnimatePresence>

      <InstagramNotificationToast onOpenWindow={openWindow_} />
      <DesktopContextMenu onOpenWindow={openWindow_} />

      <WindowManager
        openWindow={openWindow}
        origin={windowOrigin}
        onClose={() => setOpenWindow(null)}
        onOpenWindow={openWindow_}
      />

      <BootScreen />
    </div>
  );
}
