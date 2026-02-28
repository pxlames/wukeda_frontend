import { useState, useEffect, ReactNode } from "react";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

interface ScalableViewportProps {
  children: ReactNode;
}

/**
 * 1920x1080 设计稿缩放视口
 * 拉伸铺满视口：无 margin/padding，无留白，背景覆盖整个视口
 */
export const ScalableViewport = ({ children }: ScalableViewportProps): JSX.Element => {
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  useEffect(() => {
    const update = () => {
      setScaleX(window.innerWidth / DESIGN_WIDTH);
      setScaleY(window.innerHeight / DESIGN_HEIGHT);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        minWidth: "100vw",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#0a2f47",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          margin: 0,
          padding: 0,
          position: "absolute",
          top: 0,
          left: 0,
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
};
