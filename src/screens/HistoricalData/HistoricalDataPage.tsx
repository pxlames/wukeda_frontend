import { useEffect } from "react";
import { ScalableViewport } from "../../components/ScalableViewport";
import { HistoricalDataFullscreen } from "../HistoricalDataFullscreen";

/**
 * 历史数据 - 全屏页面（新 UI）：无外边距/内边距，100vw×100vh，Flex 布局铺满视口
 */
export const HistoricalDataPage = (): JSX.Element => {
  useEffect(() => {
    document.body.classList.add("historical-data-fullscreen");
    return () => document.body.classList.remove("historical-data-fullscreen");
  }, []);

  return (
    <div
      className="historical-data-page"
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
        zIndex: 9998,
      }}
    >
      <ScalableViewport>
        <HistoricalDataFullscreen />
      </ScalableViewport>
    </div>
  );
};
