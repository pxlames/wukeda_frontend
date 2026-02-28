import { Link, useNavigate } from "react-router-dom";
import { ControlPanelSection } from "./sections/ControlPanelSection";
import { EnvironmentalMonitoringSection } from "./sections/EnvironmentalMonitoringSection/EnvironmentalMonitoringSection";
import { EquipmentStatusSection } from "./sections/EquipmentStatusSection";

export const Element = (): JSX.Element => {
  const navigate = useNavigate();
  
  const controlButtons = [
    { label: "自动行走", link: null },
    { label: "回归原点", link: null },
    { label: "切换全屏", link: null },
  ];

  const navigationTabs = [
    { label: "环境", active: true, route: "/screen" },
    { label: "排风", active: false, route: "/paifeng" },
    { label: "通风", active: false, route: "/tongfeng" },
    { label: "气路", active: false, route: null },
    { label: "废水", active: false, route: null },
    { label: "能耗", active: false, route: "/nenghao" },
  ];

  const handleTabClick = (route: string | null) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div
      className="bg-[#375162] overflow-hidden w-full h-full min-w-[1920px] min-h-[1080px] relative"
      data-model-id="1705:122018"
    >
      <div className="absolute top-[-5px] left-[-3px] w-[1926px] h-[1087px]">
        <img
          className="absolute top-[5px] left-[3px] w-[1920px] h-[1080px] object-cover"
          alt="Background image"
          src="https://c.animaapp.com/CVwc6w4U/img/image-6.png"
        />

        <div className="absolute top-0 left-0 w-[1926px] h-[1087px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(0,31,47,0.57)_100%)]" />
      </div>

      <div className="top-0 left-0 w-[1920px] h-[1080px] gap-[664px] absolute flex">
        <div className="w-[551px] h-[1080px]" />

        <div className="w-[705px] h-[1080px] rotate-180" />
      </div>

      <div className="absolute top-0 left-0 w-[543px] h-[1080px] backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-0 left-[1375px] w-[543px] h-[1080px] rotate-180 backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <EquipmentStatusSection />
      <EnvironmentalMonitoringSection />
      <div className="flex flex-col w-[124px] items-start gap-4 absolute top-[105px] left-[547px]">
        {controlButtons.map((button, index) => {
          const ButtonWrapper = button.link ? Link : 'button';
          const buttonProps = button.link 
            ? { to: button.link }
            : {};
          
          return (
            <ButtonWrapper
              key={index}
              {...buttonProps}
              className="relative w-[125.72px] h-[51.37px] mr-[-1.72px] block"
              aria-label={button.label}
            >
              <img
                className="absolute top-0 left-0 w-[124px] h-[51px] aspect-[2.41]"
                alt=""
                src="https://c.animaapp.com/CVwc6w4U/img/6-1-1-2@2x.png"
              />

              <div className="top-[13px] left-[23px] w-[77px] [font-family:'Poppins',Helvetica] font-medium text-lg leading-[normal] absolute text-[#ffffffcc] tracking-[0]">
                {button.label}
              </div>
            </ButtonWrapper>
          );
        })}
      </div>

      <div className="absolute top-px left-0 w-[1924px] h-[1082px]">
        <img
          className="absolute top-px left-0 w-[1920px] h-[1079px] aspect-[1.78] object-cover"
          alt="Decorative frame"
          src="https://c.animaapp.com/CVwc6w4U/img/11-1-1.png"
        />

        <h1 className="absolute top-[5px] left-[673px] w-[531px] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl text-center tracking-[5.04px] leading-[48px] whitespace-nowrap">
          新天普智慧实验室可视化平台
        </h1>
      </div>

      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {navigationTabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(tab.route)}
            className={`flex items-center justify-center mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap relative w-fit font-normal ${
              tab.active ? "text-white opacity-[0.58]" : "text-[#ffffff94]"
            } ${tab.route ? "cursor-pointer hover:text-white transition-colors" : "cursor-default"}`}
            aria-current={tab.active ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="inline-flex items-center gap-4 absolute top-9 left-[63px]">
        <img
          className="relative w-[43px] h-8"
          alt="Weather icon"
          src="https://c.animaapp.com/CVwc6w4U/img/header-cloud@2x.png"
        />

        <div className="[font-family:'Poppins',Helvetica] text-[#95e2ff] text-base tracking-[0] leading-[normal] relative w-fit font-normal">
          晴转多云
        </div>

        <div className="[font-family:'Poppins',Helvetica] text-[#95e2ff] text-base tracking-[0] leading-[normal] relative w-fit font-normal">
          17-18℃
        </div>

        <div className="[font-family:'Poppins',Helvetica] text-[#95e2ff] text-base tracking-[0] leading-[normal] relative w-fit font-normal">
          东南风
        </div>
      </div>

      <div className="w-[243px] items-center top-[39px] left-[1601px] absolute flex">
        <time className="relative w-[172px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[10px]">
          2025年11月30日 周一
        </time>

        <time className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          21:00:03
        </time>
      </div>

      <ControlPanelSection />
    </div>
  );
};
