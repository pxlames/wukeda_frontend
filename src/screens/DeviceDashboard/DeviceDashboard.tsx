import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceStatusDashboardSection } from "./sections/DeviceStatusDashboardSection";
import { NavigationSidebarSection } from "./sections/NavigationSidebarSection";

export const DeviceDashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFloor, setSelectedFloor] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日 ${weekday}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const weatherInfo = [
    { label: "晴转多云" },
    { label: "17-18℃" },
    { label: "东南风" },
  ];

  const navigationTabs: Array<{ label: string; active: boolean; route?: string }> = [
    { label: "环境", active: false, route: "/screen" },
    { label: "排风", active: true, route: "/device-dashboard" },
    { label: "通风", active: false, route: "/tongfeng" },
    { label: "气路", active: false },
    { label: "废水", active: false },
    { label: "能耗", active: false, route: "/nenghao" },
  ];

  /**
   * 处理楼层切换
   */
  const handleFloorChange = (floor: string | undefined) => {
    setSelectedFloor(floor);
  };

  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,rgba(8,34,49,1)_0%,rgba(24,53,69,1)_57%)] w-full h-full min-w-[1920px] min-h-[1080px] relative">
      <div className="top-0 left-0 w-[1920px] h-[1080px] gap-[664px] absolute flex">
        <div className="w-[551px] h-[1080px]" />

        <div className="w-[705px] h-[1080px] rotate-180" />
      </div>

      <div className="absolute top-0 left-0 w-[543px] h-[1080px] backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-0 left-[1375px] w-[543px] h-[1080px] rotate-180 backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-px left-0 w-[1924px] h-[1082px] overflow-visible">
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover pointer-events-none"
          alt="Element"
          src="https://c.animaapp.com/mlf6o2v3f0K6fB/img/11-1-1.png"
        />
        
        <DeviceStatusDashboardSection floor={selectedFloor} />

        <h1 
          onClick={() => navigate('/device-dashboard')}
          className="absolute top-[5px] left-[673px] w-[531px] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl text-center tracking-[5.04px] leading-[48px] whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity z-10"
        >
          新天普智慧实验室可视化平台
        </h1>
      </div>

      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="主导航"
      >
        {navigationTabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap cursor-pointer hover:opacity-100 transition-opacity ${
              tab.active ? "text-white opacity-[0.58]" : "text-[#ffffff94]"
            }`}
            aria-current={tab.active ? "page" : undefined}
            onClick={() => tab.route && navigate(tab.route)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div
        className="inline-flex items-center gap-4 absolute top-9 left-[63px]"
        role="complementary"
        aria-label="天气信息"
      >
        <img
          className="relative w-[43px] h-8"
          alt="天气图标"
          src="https://c.animaapp.com/mlf6o2v3f0K6fB/img/header-cloud.png"
        />

        {weatherInfo.map((info, index) => (
          <div
            key={index}
            className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]"
          >
            {info.label}
          </div>
        ))}
      </div>

      <div
        className="w-[243px] items-center top-[39px] left-[1601px] absolute flex"
        role="complementary"
        aria-label="日期时间"
      >
        <time className="relative w-[172px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[10px]">
          {formatDate(currentTime)}
        </time>

        <time className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          {formatTime(currentTime)}
        </time>
      </div>

      <NavigationSidebarSection 
        selectedFloor={selectedFloor} 
        onFloorChange={handleFloorChange} 
      />
      <span
        className="absolute top-[78px] left-[1805px] w-20 h-5 flex items-center"
        aria-label="回到首页"
      >
        <span className="absolute w-[70.00%] h-full top-0 left-[30.00%] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#95e2ff] text-sm text-center tracking-[0] leading-[normal]">
          回到首页
        </span>

        <img
          className="absolute w-[25.00%] top-0 left-0 h-5"
          alt="首页图标"
          src="https://c.animaapp.com/mlf6o2v3f0K6fB/img/frame.svg"
        />
      </span>
    </div>
  );
};
