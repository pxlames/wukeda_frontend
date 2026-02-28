import { useState } from "react";

const Screen = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("环境");
  const [activeFloor, setActiveFloor] = useState("2F");

  const weatherData = [
    { label: "晴转多云" },
    { label: "17-18℃" },
    { label: "东南风" },
  ];

  const navigationTabs = [
    { id: "environment", label: "环境", active: true },
    { id: "exhaust", label: "排风", active: false },
    { id: "ventilation", label: "通风", active: false },
    { id: "gas", label: "气路", active: false },
    { id: "wastewater", label: "废水", active: false },
    { id: "energy", label: "能耗", active: false },
  ];

  const floorNavigation = [
    {
      id: "home",
      label: "首页",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/5-1-1.png",
    },
    {
      id: "overall",
      label: "总体",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/5-1-1-1.png",
    },
    {
      id: "roof",
      label: "楼顶",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/5-1-1-2.png",
    },
    {
      id: "5F",
      label: "5F",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/5-2-1.png",
    },
    {
      id: "4F",
      label: "4F",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/5-1-1-3.png",
    },
    {
      id: "3F",
      label: "3F",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/5-1-1-4.png",
    },
    {
      id: "2F",
      label: "2F",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/5-1-1-5.png",
    },
  ];

  const environmentMetrics = [
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-3.svg",
      value: "22",
      label: "温度(℃)",
    },
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-8.svg",
      value: "54.66",
      label: "湿度(%)",
    },
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-1.svg",
      value: "52",
      label: "CO₂(ppm)",
    },
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-5.svg",
      value: "34",
      label: "CO(ppm)",
    },
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-4.svg",
      value: "18",
      label: "TVOC(mg/m³)",
    },
  ];

  const deviceList = [
    {
      id: "43",
      room: "01",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314912.png",
      online: true,
    },
    {
      id: "44",
      room: "02",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314912-1.png",
      online: true,
    },
    {
      id: "45",
      room: "03",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314912-2.png",
      online: true,
    },
    {
      id: "46",
      room: "04",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314912-3.png",
      online: true,
    },
    {
      id: "47",
      room: "05",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314912-4.png",
      online: true,
    },
    {
      id: "48",
      room: "06",
      image: "https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314912-5.png",
      online: true,
    },
  ];

  const roomDetailMetrics = [
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-3.svg",
      value: "22",
      label: "温度(℃)",
    },
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-8.svg",
      value: "54.66",
      label: "湿度(%)",
    },
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-1.svg",
      value: "52",
      label: "CO₂(ppm)",
    },
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-5.svg",
      value: "34",
      label: "CO(ppm)",
    },
    {
      icon: "https://c.animaapp.com/mlfe6thi2HE6bz/img/frame-4.svg",
      value: "18",
      label: "TVOC(mg/m³)",
    },
  ];

  return (
    <div className="bg-[#375162] overflow-hidden w-full h-full min-w-[1920px] min-h-[1080px] relative">
      <img
        className="absolute top-0 left-0 w-[1920px] h-[1080px]"
        alt="Group"
        src="https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314752.png"
      />

      <img
        className="absolute top-[100px] left-[296px] w-[1542px] h-[980px] object-cover"
        alt="Element"
        src="https://c.animaapp.com/mlfe6thi2HE6bz/img/-----2025-12-15-092857-170.png"
      />

      <div className="absolute top-0 left-0 w-[1920px] h-[1080px] flex gap-[664px]">
        <div className="w-[551px] h-[1080px]" />
        <div className="w-[705px] h-[1080px] rotate-180" />
      </div>

      <header className="absolute top-px left-0 w-[1924px] h-[1082px]">
        <img
          className="absolute top-0 left-0 w-[1920px] h-[1079px] object-cover"
          alt="Element"
          src="https://c.animaapp.com/mlfe6thi2HE6bz/img/11-1-1.png"
        />

        <h1 className="absolute top-[5px] left-[673px] w-[531px] [text-shadow:0px_4px_4px_#00000040] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[#f4f8ff] text-4xl text-center tracking-[5.04px] leading-[48px] whitespace-nowrap">
          新天普智慧实验室可视化平台
        </h1>
      </header>

      <nav
        className="inline-flex items-start gap-[26px] absolute top-[1032px] left-[748px]"
        role="navigation"
        aria-label="主导航"
      >
        {navigationTabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.label)}
            className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap ${
              index === 0 ? "text-white" : "text-[#ffffff94]"
            }`}
            aria-current={index === 0 ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <aside
        className="inline-flex items-center gap-4 absolute top-9 left-[63px]"
        aria-label="天气信息"
      >
        <img
          className="relative w-[43px] h-8"
          alt="Header cloud"
          src="https://c.animaapp.com/mlfe6thi2HE6bz/img/header-cloud.png"
        />
        {weatherData.map((item, index) => (
          <div
            key={index}
            className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]"
          >
            {item.label}
          </div>
        ))}
      </aside>

      <time
        className="flex w-[243px] items-center absolute top-[39px] left-[1601px]"
        dateTime="2025-11-30T21:00:03"
      >
        <div className="relative w-[172px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[10px]">
          2025年11月30日 周一
        </div>
        <div className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          21:00:03
        </div>
      </time>

      <nav
        className="flex flex-col w-[57px] items-start gap-[26px] absolute top-[86px] left-[1817px]"
        role="navigation"
        aria-label="楼层导航"
      >
        {floorNavigation.map((floor, index) => (
          <button
            key={floor.id}
            onClick={() => setActiveFloor(floor.label)}
            className="relative w-[59px] h-[54px] mr-[-2.00px]"
            aria-current={floor.label === "2F" ? "page" : undefined}
          >
            <img
              className="absolute top-0 left-0 w-[57px] h-[54px]"
              alt={`${floor.label}楼层`}
              src={floor.image}
            />
            <div
              className={`absolute left-[3px] w-[52px] text-sm text-center tracking-[0] [font-family:'Poppins',Helvetica] font-medium leading-[normal] ${
                floor.label === "2F"
                  ? "top-[19px] text-white leading-[16.9px] whitespace-nowrap [font-family:'Source_Han_Sans_CN-Regular',Helvetica]"
                  : floor.id === "home" || floor.id === "overall"
                    ? "top-[17px] text-[#ffffffcc]"
                    : "top-[18px] text-[#ffffffcc] leading-[16.9px] whitespace-nowrap [font-family:'Source_Han_Sans_CN-Regular',Helvetica]"
              }`}
            >
              {floor.label}
            </div>
          </button>
        ))}
      </nav>

      <section
        className="absolute w-[25.99%] h-[35.28%] top-[11.02%] left-0"
        aria-labelledby="environment-monitoring-title"
      >
        <div className="absolute w-[99.20%] h-[98.43%] top-[9.97%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#5194a4] bg-[linear-gradient(0deg,rgba(0,0,0,0.44)_0%,rgba(0,0,0,0.44)_100%)]" />

        <img
          className="absolute w-[99.41%] h-[8.89%] top-0 left-0"
          alt="Element"
          src="https://c.animaapp.com/mlfe6thi2HE6bz/img/1-3-1.png"
        />

        <h2
          id="environment-monitoring-title"
          className="absolute w-[29.23%] h-[6.71%] top-[2.11%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]"
        >
          环境监测
        </h2>

        <div className="flex w-[461px] h-[89px] items-start gap-[51px] pt-2.5 pb-0 px-2.5 absolute top-[calc(50.00%_-_140px)] left-[calc(50.00%_-_230px)]">
          {environmentMetrics.map((metric, index) => (
            <div
              key={index}
              className="inline-flex flex-col items-center justify-center gap-2 relative flex-[0_0_auto]"
            >
              <img
                className="relative w-4 h-4"
                alt={metric.label}
                src={metric.icon}
              />
              <div className="relative w-fit [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-base font-normal text-white tracking-[0] leading-[normal]">
                {metric.value}
              </div>
              <div className="relative w-fit [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-[10px] text-center tracking-[0] leading-[normal]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute top-[153px] left-[19px] w-[470px] h-[249px] flex bg-[url(https://c.animaapp.com/mlfe6thi2HE6bz/img/union.svg)] bg-[100%_100%]">
          <div className="mt-[17.8px] w-[460px] h-[219.78px] relative">
            <div className="absolute top-[35px] left-0 w-[458px] h-[185px]">
              <img
                className="absolute top-9 left-[38px] w-[420px] h-[121px]"
                alt="Element"
                src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---57.png"
              />

              <img
                className="absolute top-[25px] left-[261px] w-px h-px"
                alt="Element"
              />

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_-_183px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                00:00
              </div>

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_-_150px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                02:00
              </div>

              <div className="absolute top-[calc(50.00%_+_75px)] left-[calc(50.00%_-_117px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                04:00
              </div>

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_-_84px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                06:00
              </div>

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_-_51px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                08:00
              </div>

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_-_18px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                10:00
              </div>

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_+_14px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                12:00
              </div>

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_+_46px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                14:00
              </div>

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_+_78px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                16:00
              </div>

              <div className="absolute top-[calc(50.00%_+_74px)] left-[calc(50.00%_+_110px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                18:00
              </div>

              <div className="absolute top-[calc(50.00%_+_75px)] left-[calc(50.00%_+_142px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                20:00
              </div>

              <div className="absolute top-[calc(50.00%_+_75px)] left-[calc(50.00%_+_176px)] opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal]">
                22:00
              </div>

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[12.81%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[27.03%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[41.26%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[55.48%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[69.70%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[19.92%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[34.15%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[48.37%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[62.59%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[76.82%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[91.04%] bg-white opacity-50" />

              <div className="absolute w-0 h-[2.16%] top-[83.56%] left-[83.93%] bg-white opacity-50" />

              <div className="absolute w-[6.56%] top-[calc(50.00%_-_70px)] left-0 opacity-60 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-xs text-right tracking-[0] leading-6">
                50
                <br />
                40
                <br />
                30
                <br />
                20
                <br />
                10
                <br />0
              </div>

              <div className="absolute w-[78.81%] h-[83.88%] top-0 left-[13.29%]">
                <img
                  className="absolute top-[76px] left-0 w-[361px] h-20"
                  alt="Element"
                  src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---15.png"
                />

                <img
                  className="absolute w-0 h-[99.92%] top-0 left-[26.71%]"
                  alt="Element"
                  src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---3-1.svg"
                />

                <div className="absolute w-[2.31%] h-[5.16%] top-[64.18%] left-[26.02%] rounded-[4.17px/4px] border border-solid border-white shadow-[0px_0px_10px_1px_#ffffff] [background:radial-gradient(50%_50%_at_50%_65%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,rgba(0,139,255,1)_0%,rgba(0,139,255,1)_100%)]" />

                <div className="absolute w-[10.40%] top-[calc(50.00%_-_7px)] left-[26.71%] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] text-xl text-center font-normal text-white tracking-[0] leading-[normal]">
                  23
                </div>
              </div>
            </div>

            <h3 className="absolute top-0 left-5 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
              今日温度(℃)
            </h3>

            <button className="absolute top-0 left-[413px] w-[45px] h-[23px] bg-[#18fefe3d] rounded overflow-hidden">
              <div className="absolute top-[3px] left-[5px] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                今日
              </div>

              <img
                className="absolute w-[12.50%] h-[17.39%] top-[47.83%] left-[75.56%]"
                alt="Vector"
                src="https://c.animaapp.com/mlfe6thi2HE6bz/img/vector.svg"
              />
            </button>
          </div>
        </div>
      </section>

      <section
        className="absolute w-[25.99%] h-[43.89%] top-[50.37%] left-0"
        aria-labelledby="device-list-title"
      >
        <div className="absolute w-[99.20%] h-[91.14%] top-[8.86%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#5194a4] bg-[linear-gradient(0deg,rgba(0,0,0,0.44)_0%,rgba(0,0,0,0.44)_100%)]" />

        <img
          className="absolute w-[99.41%] h-[7.93%] top-0 left-0"
          alt="Element"
          src="https://c.animaapp.com/mlfe6thi2HE6bz/img/1-3-1-1.png"
        />

        <h2
          id="device-list-title"
          className="absolute w-[29.23%] h-[5.99%] top-0 left-[5.13%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]"
        >
          设备列表
        </h2>

        <div className="absolute w-[92.79%] h-[85.23%] top-[12.24%] left-[3.61%] bg-[#ffffff14] rounded-xl overflow-hidden border border-solid border-white">
          <h3 className="absolute top-2.5 left-4 h-4 flex items-center justify-center [font-family:'ABeeZee',Helvetica] font-normal text-white text-base tracking-[0] leading-4 whitespace-nowrap">
            5F设备(6台)
          </h3>

          <div className="flex flex-col w-full h-[350px] items-start justify-center gap-3 px-2.5 py-0 absolute top-[calc(50.00%_-_160px)] left-0">
            {[0, 1, 2].map((rowIndex) => (
              <div
                key={rowIndex}
                className="flex w-[443px] items-start gap-[53px] px-2.5 py-0 relative flex-[0_0_auto]"
              >
                {deviceList
                  .slice(rowIndex * 2, rowIndex * 2 + 2)
                  .map((device) => (
                    <article
                      key={device.id}
                      className={`relative w-[186px] h-[106px] ${rowIndex === 2 && device.room === "06" ? "mr-[-2.00px]" : ""} bg-[#18fefe1a] rounded-lg overflow-hidden border-[none] before:content-[''] before:absolute before:inset-0 before:p-px before:rounded-lg before:[background:linear-gradient(163deg,rgba(24,254,254,1)_0%,rgba(24,254,254,0)_100%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none`}
                    >
                      <img
                        className="absolute top-2.5 left-1.5 w-4 h-4"
                        alt="Frame"
                        src="https://c.animaapp.com/mlfe6thi2HE6bz/img/frame.svg"
                      />

                      <h4 className="absolute top-2 left-[26px] h-5 flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
                        {device.room}房间空气监测设备-{device.id}
                      </h4>

                      <img
                        className="absolute top-[77px] left-[155px] w-[19px] h-[19px]"
                        alt="Group"
                        src={device.image}
                      />

                      <div className="absolute top-[77px] left-[75px] w-[68px] h-[18px] flex gap-1">
                        <div className="w-[33px] h-[18px] relative">
                          <div className="absolute top-0 left-0 w-[31px] h-[18px] bg-[#18fefe21] rounded border border-solid border-[#18fefe]" />

                          <div className="absolute top-1 left-[5px] h-2.5 flex items-center justify-center [font-family:'ABeeZee',Helvetica] font-normal text-[#18fefe] text-[10px] tracking-[0] leading-[10px] whitespace-nowrap">
                            在线
                          </div>
                        </div>

                        <div className="w-[33px] h-[18px] relative">
                          <div className="absolute top-0 left-0 w-[31px] h-[18px] bg-[#ffffff21] rounded border border-solid border-[#ffffff3d]" />

                          <div className="absolute top-1 left-[5px] h-2.5 flex items-center justify-center [font-family:'ABeeZee',Helvetica] font-normal text-[#979797] text-[10px] tracking-[0] leading-[10px] whitespace-nowrap">
                            停止
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="absolute top-[165px] left-[1139px] w-[540px] h-[223px]"
        aria-label="房间详情"
      >
        <img
          className="absolute top-[175px] left-0 w-12 h-12"
          alt="Group"
          src="https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314894.png"
        />

        <div className="absolute top-0 left-[38px] w-[504px] h-[188px]">
          <img
            className="absolute top-0 left-[98px] w-[404px] h-[35px]"
            alt="Image"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---4.svg"
          />

          <img
            className="absolute top-0 left-[98px] w-[289px] h-[35px]"
            alt="Image"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---3.svg"
          />

          <img
            className="absolute top-0 left-[98px] w-44 h-[35px]"
            alt="Image"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---6.svg"
          />

          <img
            className="absolute top-0.5 left-[98px] w-[404px] h-[162px]"
            alt="Image"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---1.svg"
          />

          <img
            className="absolute w-[2.98%] h-[8.00%] top-[5.87%] left-[22.62%]"
            alt="Group"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314749.svg"
          />

          <h3 className="absolute w-[38.10%] h-[10.13%] top-[4.27%] left-[27.18%] [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
            5F 02房间空气监测设备-002
          </h3>

          <img
            className="absolute top-[154px] left-[103px] w-[113px] h-2.5"
            alt="Image"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/--.svg"
          />

          <img
            className="absolute top-[154px] left-[385px] w-[113px] h-2.5"
            alt="Image"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---5.svg"
          />

          <img
            className="absolute top-[35px] left-[492px] w-2.5 h-[113px]"
            alt="Image"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---2.svg"
          />

          <img
            className="absolute top-[35px] left-[98px] w-2.5 h-[113px]"
            alt="Image"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/---7.svg"
          />

          <img
            className="absolute top-28 left-0 w-[98px] h-[76px]"
            alt="Group"
            src="https://c.animaapp.com/mlfe6thi2HE6bz/img/group-1321314916.png"
          />

          <div className="flex w-[76.19%] h-[54.93%] items-start gap-9 pt-2.5 pb-0 px-2.5 absolute top-[27.73%] left-[21.43%]">
            {roomDetailMetrics.map((metric, index) => (
              <div
                key={index}
                className={`inline-flex flex-col items-center justify-center gap-1 relative flex-[0_0_auto] ${index === 4 ? "mr-[-10.00px]" : ""}`}
              >
                <img
                  className="relative w-4 h-4"
                  alt={metric.label}
                  src={metric.icon}
                />

                <div className="relative w-fit [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-base font-normal text-white tracking-[0] leading-[normal]">
                  {metric.value}
                </div>

                <div className="relative w-fit [font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-white text-[10px] text-center tracking-[0] leading-[normal]">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { Screen };
