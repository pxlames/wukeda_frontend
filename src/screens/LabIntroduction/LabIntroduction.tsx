import { useState } from "react";

interface TabItem {
  id: string;
  label: string;
  active: boolean;
}

interface WeatherInfo {
  condition: string;
  temperature: string;
  wind: string;
}

interface IntroSection {
  title: string;
  content: string;
}

export const LabIntroduction = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>("environment");

  const tabs: TabItem[] = [
    { id: "environment", label: "环境", active: true },
    { id: "exhaust", label: "排风", active: false },
    { id: "ventilation", label: "通风", active: false },
    { id: "gas", label: "气路", active: false },
    { id: "wastewater", label: "废水", active: false },
    { id: "energy", label: "能耗", active: false },
  ];

  const weatherInfo: WeatherInfo = {
    condition: "晴转多云",
    temperature: "17-18℃",
    wind: "东南风",
  };

  const introSections: IntroSection[] = [
    {
      title: "实验室简介",
      content:
        '本数字孪生智能虚拟实验室是依托三维建模技术、实时数据引擎、云端协同架构打造的新一代沉浸式科研与教学平台，聚焦智慧工业、新能源材料、智能建造等前沿领域，打破物理实验室的空间、设备与安全限制，为科研人员、工程师、院校师生提供 "低成本、高仿真、可复用" 的实验解决方案。\n实验室以 **"虚实融合、数据驱动、开放协同"** 为核心理念，构建了三大核心能力体系：\n高保真场景仿真能力\n基于激光扫描与参数化建模技术，1:1 还原真实实验室、工业产线、新能源电站等物理场景，支持多物理场耦合模拟（力学、热学、电学、流体动力学），可精准复现材料应力测试、设备故障推演、能源系统能效优化等实验过程，误差率低于 2%。\n实时数据交互能力\n打通与物联网传感器、工业数据库的对接通道，支持物理设备数据实时接入虚拟场景，实现 "虚拟实验参数调整 - 物理设备同步响应 - 数据双向验证" 的闭环流程。同时内置海量标准化实验数据集，覆盖新能源电池充放电特性、智慧工地设备运行参数等 B 端场景核心数据。\n云端协同与共享能力\n采用 SaaS 化部署架构，支持多终端（PC 端、平板、VR 设备）无缝接入，多人可实时在线协同操作同一实验项目，实现实验方案共享、操作过程录屏、数据报告自动生成。实验室还开放标准化 API 接口，支持用户自定义拓展实验场景与功能模块。',
    },
    {
      title: "实验室设计原则",
      content:
        '虚拟实验室设计需以 B 端智慧工地、新能源等细分场景及科研、培训、教学核心需求为导向，坚守 "精准仿真" 核心底线，通过 1:1 复刻物理场景、精准构建数据模型与闭环实验逻辑确保结果可靠，同时秉持 "用户中心" 理念，按不同用户层级优化操作流程与交互体验，匹配差异化功能需求；以 "安全可靠" 为底线，实现虚拟与物理操作的安全隔离、数据加密存储与系统稳定运行，依托 "开放兼容" 特性支持多终端适配、标准化 API 接口对接与自定义模块拓展，借助 "数据驱动" 能力完成全流程数据采集、智能分析反馈与协同共享，遵循 "高效实用" 原则简化操作流程、降低使用成本、提供预制场景模板，并以 "可持续迭代" 为发展支撑，预留技术升级与场景拓展空间，通过各原则的有机融合，切实解决物理实验室的空间、成本、安全痛点，打造适配产业需求的智能化实验平台。',
    },
  ];

  const labImages: string[] = [
    "https://c.animaapp.com/mlffd3qha1Fp36/img/rectangle-2346.png",
    "https://c.animaapp.com/mlffd3qha1Fp36/img/rectangle-2347.png",
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="bg-[#375162] overflow-hidden w-full h-full min-w-[1920px] min-h-[1080px] relative">
      <img
        className="absolute top-0 left-0 w-[1920px] h-[1080px]"
        alt="Background Group"
        src="https://c.animaapp.com/mlffd3qha1Fp36/img/group-1321314752.png"
      />

      <div className="top-0 left-0 w-[1920px] h-[1080px] gap-[664px] absolute flex">
        <div className="w-[551px] h-[1080px]" />
        <div className="w-[705px] h-[1080px] rotate-180" />
      </div>

      <div className="absolute top-0 left-0 w-[543px] h-[1080px] backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-0 left-[1375px] w-[543px] h-[1080px] rotate-180 backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      <div className="absolute top-px left-0 w-[1924px] h-[1082px]">
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover"
          alt="Background Element"
          src="https://c.animaapp.com/mlffd3qha1Fp36/img/11-1-1.png"
        />

        <h1 className="top-[5px] left-[673px] w-[531px] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl tracking-[5.04px] leading-[48px] absolute text-center whitespace-nowrap">
          新天普智慧实验室可视化平台
        </h1>
      </div>

      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap ${
              activeTab === tab.id
                ? "text-white opacity-[0.58]"
                : "text-[#ffffff94]"
            }`}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div
        className="inline-flex items-center gap-4 absolute top-9 left-[63px]"
        role="complementary"
        aria-label="Weather information"
      >
        <img
          className="relative w-[43px] h-8"
          alt="Weather icon"
          src="https://c.animaapp.com/mlffd3qha1Fp36/img/header-cloud.png"
        />
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          {weatherInfo.condition}
        </div>
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          {weatherInfo.temperature}
        </div>
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          {weatherInfo.wind}
        </div>
      </div>

      <div
        className="w-[243px] items-center top-[39px] left-[1601px] absolute flex"
        role="complementary"
        aria-label="Date and time"
      >
        <time
          className="relative w-[172px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[10px]"
          dateTime="2025-11-30"
        >
          2025年11月30日 周一
        </time>
        <time className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          21:00:03
        </time>
      </div>

      <img
        className="absolute top-[97px] left-[84px] w-[1751px] h-[916px]"
        alt="Laboratory visualization"
        src="https://c.animaapp.com/mlffd3qha1Fp36/img/----3-1.png"
      />

      <span
        className="absolute top-[137px] left-[1762px] w-6 h-6"
        aria-label="返回首页"
      >
        <img
          className="w-full h-full"
          alt="Close icon"
          src="https://c.animaapp.com/mlffd3qha1Fp36/img/frame.svg"
        />
      </span>

      <h2 className="absolute top-[216px] left-[161px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-[32px] text-center tracking-[0] leading-[38.5px] whitespace-nowrap">
        实验室简介
      </h2>

      <div className="absolute top-[277px] left-[154px] w-[1646px] h-[273px] flex gap-[22.4px]">
        {labImages.map((imageSrc, index) => (
          <img
            key={index}
            className="w-[811.81px] h-[273px] object-cover"
            alt={`Laboratory image ${index + 1}`}
            src={imageSrc}
          />
        ))}
      </div>

      <article className="absolute top-[598px] left-[154px] w-[1644px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0] leading-[21px]">
        <p>
          本数字孪生智能虚拟实验室是依托三维建模技术、实时数据引擎、云端协同架构打造的新一代沉浸式科研与教学平台，聚焦智慧工业、新能源材料、智能建造等前沿领域，打破物理实验室的空间、设备与安全限制，为科研人员、工程师、院校师生提供
          &quot;低成本、高仿真、可复用&quot; 的实验解决方案。
        </p>
        <p>
          实验室以 **&quot;虚实融合、数据驱动、开放协同&quot;**
          为核心理念，构建了三大核心能力体系：
        </p>
        <p>高保真场景仿真能力</p>
        <p>
          基于激光扫描与参数化建模技术，1:1
          还原真实实验室、工业产线、新能源电站等物理场景，支持多物理场耦合模拟（力学、热学、电学、流体动力学），可精准复现材料应力测试、设备故障推演、能源系统能效优化等实验过程，误差率低于
          2%。
        </p>
        <p>实时数据交互能力</p>
        <p>
          打通与物联网传感器、工业数据库的对接通道，支持物理设备数据实时接入虚拟场景，实现
          &quot;虚拟实验参数调整 - 物理设备同步响应 - 数据双向验证&quot;
          的闭环流程。同时内置海量标准化实验数据集，覆盖新能源电池充放电特性、智慧工地设备运行参数等
          B 端场景核心数据。
        </p>
        <p>云端协同与共享能力</p>
        <p>
          采用 SaaS 化部署架构，支持多终端（PC 端、平板、VR
          设备）无缝接入，多人可实时在线协同操作同一实验项目，实现实验方案共享、操作过程录屏、数据报告自动生成。实验室还开放标准化
          API 接口，支持用户自定义拓展实验场景与功能模块。
        </p>
      </article>

      <article className="absolute top-[870px] left-[156px] w-[1642px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0] leading-[21px]">
        <p>
          虚拟实验室设计需以 B
          端智慧工地、新能源等细分场景及科研、培训、教学核心需求为导向，坚守
          &quot;精准仿真&quot; 核心底线，通过 1:1
          复刻物理场景、精准构建数据模型与闭环实验逻辑确保结果可靠，同时秉持
          &quot;用户中心&quot;
          理念，按不同用户层级优化操作流程与交互体验，匹配差异化功能需求；以
          &quot;安全可靠&quot;
          为底线，实现虚拟与物理操作的安全隔离、数据加密存储与系统稳定运行，依托
          &quot;开放兼容&quot; 特性支持多终端适配、标准化 API
          接口对接与自定义模块拓展，借助 &quot;数据驱动&quot;
          能力完成全流程数据采集、智能分析反馈与协同共享，遵循
          &quot;高效实用&quot;
          原则简化操作流程、降低使用成本、提供预制场景模板，并以
          &quot;可持续迭代&quot;
          为发展支撑，预留技术升级与场景拓展空间，通过各原则的有机融合，切实解决物理实验室的空间、成本、安全痛点，打造适配产业需求的智能化实验平台。
        </p>
      </article>

      <h3 className="absolute top-[566px] left-[154px] w-[1012px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-6">
        实验室简介
      </h3>

      <h3 className="absolute top-[827px] left-[154px] w-[1013px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-6">
        实验室设计原则
      </h3>

      <div className="flex flex-col w-[243px] items-start gap-[5px] absolute top-36 left-32">
        <div className="relative w-[245.24px] h-10 mr-[-2.24px]">
          <img
            className="absolute w-[99.18%] h-full top-0 left-0"
            alt="Dropdown background"
            src="https://c.animaapp.com/mlffd3qha1Fp36/img/vector.png"
          />
          <img
            className="absolute w-[4.78%] h-[15.35%] top-[46.98%] left-[81.09%]"
            alt="Dropdown arrow"
            src="https://c.animaapp.com/mlffd3qha1Fp36/img/vector-2.svg"
          />
          <label
            htmlFor="room-select"
            className="top-[11px] left-[90px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-[19.3px] absolute text-center whitespace-nowrap"
          >
            选择房间
          </label>
          <select
            id="room-select"
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="选择房间"
          >
            <option value="">选择房间</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col w-[243px] items-start gap-[5px] absolute top-[143px] left-96">
        <div className="relative w-[245.24px] h-10 mr-[-2.24px]">
          <img
            className="absolute w-[99.18%] h-full top-0 left-0"
            alt="Dropdown background"
            src="https://c.animaapp.com/mlffd3qha1Fp36/img/vector-1.png"
          />
          <img
            className="absolute w-[4.78%] h-[15.35%] top-[46.98%] left-[81.09%]"
            alt="Dropdown arrow"
            src="https://c.animaapp.com/mlffd3qha1Fp36/img/vector-2.svg"
          />
          <label
            htmlFor="floor-select"
            className="top-[11px] left-[90px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-[19.3px] absolute text-center whitespace-nowrap"
          >
            选择楼层
          </label>
          <select
            id="floor-select"
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="选择楼层"
          >
            <option value="">选择楼层</option>
          </select>
        </div>
      </div>
    </div>
  );
};
