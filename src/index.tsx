import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScreenLayout } from "./components/ScreenLayout";
import { Element } from "./screens/Element";
import { Screen } from "./screens/Screen";
import { NewScreen } from "./screens/NewScreen";
import { DeviceDashboard } from "./screens/DeviceDashboard";
import { Paifeng } from "./screens/Paifeng";
import { Nenghao } from "./screens/Nenghao";
import { Tongfeng } from "./screens/Tongfeng";
import { Environment5F } from "./screens/Environment5F";
import { LabIntroduction } from "./screens/LabIntroduction";
import { HistoricalDataPage } from "./screens/HistoricalData";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 主应用页面 - 使用 ScreenLayout */}
        <Route element={<ScreenLayout />}>
          <Route path="/" element={<Element />} />
          <Route path="/screen" element={<Screen />} />
          <Route path="/ventilation" element={<NewScreen />} />
          <Route path="/device-dashboard" element={<DeviceDashboard />} />
          <Route path="/paifeng" element={<Paifeng />} />
          <Route path="/nenghao" element={<Nenghao />} />
          <Route path="/tongfeng" element={<Tongfeng />} />
          <Route path="/environment-5f" element={<Environment5F />} />
          <Route path="/nenghao-5f" element={<Nenghao />} />
          <Route path="/lab-introduction" element={<LabIntroduction />} />
        </Route>
        {/* 历史数据 - 独立页面，不经过 ScreenLayout */}
        <Route path="/historical-data" element={<HistoricalDataPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
