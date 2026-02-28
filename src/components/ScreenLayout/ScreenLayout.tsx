import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

export const ScreenLayout = (): JSX.Element => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / DESIGN_WIDTH;
      const scaleY = window.innerHeight / DESIGN_HEIGHT;
      // 使用较小的缩放比例，确保内容完整显示且不拉伸
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#0a1f2f]">
      <div
        className="relative flex-none"
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};
