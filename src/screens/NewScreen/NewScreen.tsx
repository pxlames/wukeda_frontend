import { Link } from "react-router-dom";

export const NewScreen = (): JSX.Element => {
  const equipmentCards = [
    {
      id: 1,
      title: "1号通风柜",
      status: "正常运行",
      statusColor: "#53ce88",
      model: "型号-xtp1500",
      date: "2025.02.05",
      serial: "18892891829897",
      manufacturer: "武汉新天普",
      image: "https://c.animaapp.com/CVwc6w4U/img/jimeng-2025-11-12-7622------------------------------------------@2x.png",
      metrics: [
        { label: "视窗高度", value: "37.2", unit: "cm" },
        { label: "排风速度", value: "14.2", unit: "m/s" },
        { label: "排风量", value: "800", unit: "h" },
        { label: "阀门开度", value: "52", unit: "%" },
        { label: "强排开关", value: "关闭", unit: "" },
        { label: "报警信息", value: "无", unit: "" },
        { label: "实时功率", value: "523", unit: "w" },
        { label: "面风速", value: "0.5", unit: "m/s" },
      ],
    },
    {
      id: 2,
      title: "2号通风柜",
      status: "正常运行",
      statusColor: "#53ce88",
      model: "型号-xtp1500",
      date: "2025.02.05",
      serial: "18892891829897",
      manufacturer: "武汉新天普",
      image: "https://c.animaapp.com/CVwc6w4U/img/jimeng-2025-11-12-7622------------------------------------------@2x.png",
      metrics: [
        { label: "视窗高度", value: "37.2", unit: "cm" },
        { label: "排风速度", value: "14.2", unit: "m/s" },
        { label: "排风量", value: "800", unit: "h" },
        { label: "阀门开度", value: "52", unit: "%" },
        { label: "强排开关", value: "关闭", unit: "" },
        { label: "报警信息", value: "无", unit: "" },
        { label: "实时功率", value: "523", unit: "w" },
        { label: "面风速", value: "0.5", unit: "m/s" },
      ],
    },
    {
      id: 3,
      title: "3号通风柜",
      status: "正常运行",
      statusColor: "#53ce88",
      model: "型号-xtp1500",
      date: "2025.02.05",
      serial: "18892891829897",
      manufacturer: "武汉新天普",
      image: "https://c.animaapp.com/CVwc6w4U/img/jimeng-2025-11-12-7622------------------------------------------@2x.png",
      metrics: [
        { label: "视窗高度", value: "37.2", unit: "cm" },
        { label: "排风速度", value: "14.2", unit: "m/s" },
        { label: "排风量", value: "800", unit: "h" },
        { label: "阀门开度", value: "52", unit: "%" },
        { label: "强排开关", value: "关闭", unit: "" },
        { label: "报警信息", value: "无", unit: "" },
        { label: "实时功率", value: "523", unit: "w" },
        { label: "面风速", value: "0.5", unit: "m/s" },
      ],
    },
    {
      id: 4,
      title: "4号通风柜",
      status: "正常运行",
      statusColor: "#53ce88",
      model: "型号-xtp1500",
      date: "2025.02.05",
      serial: "18892891829897",
      manufacturer: "武汉新天普",
      image: "https://c.animaapp.com/CVwc6w4U/img/jimeng-2025-11-12-7622------------------------------------------@2x.png",
      metrics: [
        { label: "视窗高度", value: "37.2", unit: "cm" },
        { label: "排风速度", value: "14.2", unit: "m/s" },
        { label: "排风量", value: "800", unit: "h" },
        { label: "阀门开度", value: "52", unit: "%" },
        { label: "强排开关", value: "关闭", unit: "" },
        { label: "报警信息", value: "无", unit: "" },
        { label: "实时功率", value: "523", unit: "w" },
        { label: "面风速", value: "0.5", unit: "m/s" },
      ],
    },
    {
      id: 5,
      title: "5号通风柜",
      status: "正常运行",
      statusColor: "#53ce88",
      model: "型号-xtp1500",
      date: "2025.02.05",
      serial: "18892891829897",
      manufacturer: "武汉新天普",
      image: "https://c.animaapp.com/CVwc6w4U/img/jimeng-2025-11-12-7622------------------------------------------@2x.png",
      metrics: [
        { label: "视窗高度", value: "37.2", unit: "cm" },
        { label: "排风速度", value: "14.2", unit: "m/s" },
        { label: "排风量", value: "800", unit: "h" },
        { label: "阀门开度", value: "52", unit: "%" },
        { label: "强排开关", value: "关闭", unit: "" },
        { label: "报警信息", value: "无", unit: "" },
        { label: "实时功率", value: "523", unit: "w" },
        { label: "面风速", value: "0.5", unit: "m/s" },
      ],
    },
    {
      id: 6,
      title: "6号通风柜",
      status: "正常运行",
      statusColor: "#53ce88",
      model: "型号-xtp1500",
      date: "2025.02.05",
      serial: "18892891829897",
      manufacturer: "武汉新天普",
      image: "https://c.animaapp.com/CVwc6w4U/img/jimeng-2025-11-12-7622------------------------------------------@2x.png",
      metrics: [
        { label: "视窗高度", value: "37.2", unit: "cm" },
        { label: "排风速度", value: "14.2", unit: "m/s" },
        { label: "排风量", value: "800", unit: "h" },
        { label: "阀门开度", value: "52", unit: "%" },
        { label: "强排开关", value: "关闭", unit: "" },
        { label: "报警信息", value: "无", unit: "" },
        { label: "实时功率", value: "523", unit: "w" },
        { label: "面风速", value: "0.5", unit: "m/s" },
      ],
    },
  ];

  const navigationTabs = [
    { label: "环境", active: false },
    { label: "排风", active: false },
    { label: "通风", active: true },
    { label: "气路", active: false },
    { label: "废水", active: false },
    { label: "能耗", active: false },
  ];

  const navigationItems = [
    {
      id: 1,
      label: "首页",
      image: "https://c.animaapp.com/CVwc6w4U/img/5-2-1@2x.png",
      topPosition: "top-[17px]",
      fontFamily: "[font-family:'Poppins',Helvetica]",
      fontWeight: "font-medium",
      lineHeight: "leading-[normal]",
      isActive: false,
      route: null,
    },
    {
      id: 2,
      label: "设备\n检测",
      image: "https://c.animaapp.com/CVwc6w4U/img/5-1-1-3@2x.png",
      topPosition: "top-[11px]",
      fontFamily: "[font-family:'Poppins',Helvetica]",
      fontWeight: "font-medium",
      lineHeight: "leading-[16.9px]",
      isActive: true,
      route: "/device-dashboard",
    },
    {
      id: 3,
      label: "历史\n数据",
      image: "https://c.animaapp.com/CVwc6w4U/img/5-1-1-3@2x.png",
      topPosition: "top-[11px]",
      fontFamily: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica]",
      fontWeight: "font-normal",
      lineHeight: "leading-[16.9px]",
      isActive: false,
      route: "/historical-data",
    },
    {
      id: 4,
      label: "报警",
      image: "https://c.animaapp.com/CVwc6w4U/img/5-1-1-3@2x.png",
      topPosition: "top-5",
      fontFamily: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica]",
      fontWeight: "font-normal",
      lineHeight: "leading-[16.9px]",
      whitespace: "whitespace-nowrap",
      isActive: false,
      route: null,
    },
    {
      id: 5,
      label: "切换",
      image: "https://c.animaapp.com/CVwc6w4U/img/5-1-1-4@2x.png",
      topPosition: "top-[19px]",
      fontFamily: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica]",
      fontWeight: "font-normal",
      lineHeight: "leading-[16.9px]",
      whitespace: "whitespace-nowrap",
      opacity: "opacity-50",
      isActive: false,
      route: null,
    },
  ];

  return (
    <div className="bg-[#375162] overflow-hidden w-full h-full min-w-[1920px] min-h-[1080px] relative">
      {/* Background */}
      <div className="absolute top-[-5px] left-[-3px] w-[1926px] h-[1087px]">
        <img
          className="absolute top-[5px] left-[3px] w-[1920px] h-[1080px] object-cover"
          alt="Background"
          src="https://c.animaapp.com/CVwc6w4U/img/image-6.png"
        />
        <div className="absolute top-0 left-0 w-[1926px] h-[1087px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0)_0%,rgba(0,31,47,0.57)_100%)]" />
      </div>

      {/* Side panels blur effect */}
      <div className="absolute top-0 left-0 w-[543px] h-[1080px] backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />
      <div className="absolute top-0 left-[1375px] w-[543px] h-[1080px] rotate-180 backdrop-blur-[8.25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(8.25px)_brightness(100%)]" />

      {/* Main content grid - 2x3 layout */}
      <div className="absolute top-[85px] left-[25px] w-[1870px] h-[930px] grid grid-cols-3 grid-rows-2 gap-x-[10px] gap-y-[10px]">
        {equipmentCards.map((card) => (
          <article
            key={card.id}
            className="w-[617px] h-[460px] relative bg-[linear-gradient(0deg,rgba(10,47,71,0.44)_0%,rgba(10,47,71,0.44)_100%)] border-r border-b border-l border-[#61afc2]"
          >
            {/* Card header */}
            <div className="absolute top-0 left-0 w-full h-[42px]">
              <img
                className="w-full h-full"
                alt=""
                src="https://c.animaapp.com/CVwc6w4U/img/1-3-1.png"
              />
              <h2 className="absolute top-[9px] left-[33px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
                {card.title}
              </h2>
            </div>

            {/* Equipment image and info */}
            <div className="absolute top-[52px] left-[16px] flex items-center gap-[51px]">
              <img
                className="w-[205px] h-[205px] object-cover"
                alt={card.title}
                src={card.image}
              />

              <div className="w-[232px] h-[134px] relative">
                <div className="flex flex-col w-[168px] gap-1 absolute top-1 left-[15px]">
                  <div className="[font-family:'Poppins',Helvetica] font-semibold text-[#00d8ff] text-xl tracking-[0] leading-[19px] whitespace-nowrap">
                    {card.model}
                  </div>

                  <div className="relative w-[166.9px] h-[21px]">
                    <div
                      className="absolute top-[7px] left-0 w-1.5 h-1.5 rounded-[3px]"
                      style={{ backgroundColor: card.statusColor }}
                    />
                    <p className="absolute w-[91.27%] h-full top-0 left-[7.54%] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[13px] tracking-[0] leading-[19px] whitespace-nowrap">
                      <span className="text-white">运行状态&nbsp;&nbsp;</span>
                      <span style={{ color: card.statusColor }}>
                        {card.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="absolute top-[58px] left-7 [font-family:'Poppins',Helvetica] font-normal text-[#ffffff8f] text-[13px] tracking-[0] leading-[19px] whitespace-nowrap">
                  生成日期&nbsp;&nbsp;{card.date}
                </div>

                <div className="absolute top-[84px] left-7 [font-family:'Poppins',Helvetica] font-normal text-[#ffffff8f] text-[13px] tracking-[0] leading-[19px] whitespace-nowrap">
                  序列号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{card.serial}
                </div>

                <div className="absolute top-[108px] left-7 [font-family:'Poppins',Helvetica] font-normal text-[#ffffff8f] text-[13px] tracking-[0] leading-[19px] whitespace-nowrap">
                  制造商&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{card.manufacturer}
                </div>
              </div>

              <img
                className="absolute top-[93px] left-[283px] w-[5px] h-[52px]"
                alt=""
                src="https://c.animaapp.com/CVwc6w4U/img/8-1-1@2x.png"
              />
            </div>

            {/* Metrics grid */}
            <div className="absolute top-[267px] left-[24px] flex flex-col gap-2.5">
              <div className="flex items-center gap-[22px]">
                {card.metrics.slice(0, 4).map((metric, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-[125px] items-center justify-center gap-1"
                  >
                    <div className="w-[125px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#9ba3aa] text-sm text-center tracking-[0] leading-[normal]">
                      {metric.label}
                    </div>
                    <div className="relative w-[125px] h-[39px] bg-[url(https://c.animaapp.com/CVwc6w4U/img/7-1-1-7@2x.png)] bg-[100%_100%]">
                      <div className="flex w-[125px] items-center justify-center gap-0.5 relative top-2">
                        <div className="[font-family:'Open_Sans',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal]">
                          {metric.value}
                        </div>
                        {metric.unit && (
                          <div className="[font-family:'Microsoft_YaHei-Regular',Helvetica] font-normal text-[#ffffff80] text-sm tracking-[1.40px] leading-[normal]">
                            {metric.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-[22px]">
                {card.metrics.slice(4, 8).map((metric, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-[125px] items-center justify-center gap-1"
                  >
                    <div className="w-[125px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#9ba3aa] text-sm text-center tracking-[0] leading-[normal]">
                      {metric.label}
                    </div>
                    <div className="relative w-[125px] h-[39px] bg-[url(https://c.animaapp.com/CVwc6w4U/img/7-1-1-7@2x.png)] bg-[100%_100%]">
                      <div className="flex w-[125px] items-center justify-center gap-0.5 relative top-2">
                        <div className="[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal]">
                          {metric.value}
                        </div>
                        {metric.unit && (
                          <div className="[font-family:'Microsoft_YaHei-Regular',Helvetica] font-normal text-[#ffffff80] text-sm tracking-[1.40px] leading-[normal]">
                            {metric.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Top frame decoration */}
      <div className="absolute top-px left-0 w-[1924px] h-[1082px] pointer-events-none">
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover"
          alt=""
          src="https://c.animaapp.com/CVwc6w4U/img/11-1-1.png"
        />

        <h1 className="absolute top-[5px] left-[673px] w-[531px] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl text-center tracking-[5.04px] leading-[48px] whitespace-nowrap">
          新天普智慧实验室可视化平台
        </h1>
      </div>

      {/* Bottom navigation tabs */}
      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {navigationTabs.map((tab, index) => (
          <button
            key={index}
            className={`flex items-center justify-center mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap relative w-fit font-normal ${
              tab.active ? "text-white opacity-[0.58]" : "text-[#ffffff94]"
            }`}
            aria-current={tab.active ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Weather info */}
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

      {/* Date and time */}
      <div className="w-[243px] items-center top-[39px] left-[1601px] absolute flex">
        <time className="relative w-[172px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[10px]">
          2025年11月30日 周一
        </time>
        <time className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          21:00:03
        </time>
      </div>

      {/* Right side navigation panel */}
      <nav
        className="inline-flex flex-col items-start gap-2.5 absolute top-[101px] left-[1318px]"
        role="navigation"
        aria-label="Control Panel Navigation"
      >
        {navigationItems.map((item) => {
          const buttonContent = (
            <>
              <img
                className={`absolute top-0 left-0 w-[57px] h-[54px] ${item.id === 1 ? "aspect-[1.06]" : "aspect-[1.05]"}`}
                alt=""
                src={item.image}
                aria-hidden="true"
              />

              <div
                className={`${item.topPosition} left-[3px] w-[52px] ${item.fontFamily} ${item.fontWeight} text-sm text-center ${item.lineHeight} ${item.whitespace || ""} ${item.opacity || ""} absolute text-[#ffffffcc] tracking-[0]`}
              >
                {item.label.split("\n").map((line, index, array) => (
                  <span key={index}>
                    {line}
                    {index < array.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </>
          );

          if (item.route) {
            return (
              <Link
                key={item.id}
                to={item.route}
                className="relative w-[59px] h-[54px] mr-[-2.00px] cursor-pointer hover:opacity-80 transition-opacity"
                aria-label={item.label.replace("\n", " ")}
                aria-current={item.isActive ? "page" : undefined}
              >
                {buttonContent}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              className="relative w-[59px] h-[54px] mr-[-2.00px]"
              type="button"
              aria-label={item.label.replace("\n", " ")}
              aria-current={item.isActive ? "page" : undefined}
            >
              {buttonContent}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
