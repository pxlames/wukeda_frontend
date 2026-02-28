export const DataStatisticsSection = (): JSX.Element => {
  const exhaustFanData = [
    {
      id: 1,
      image:
        "https://c.animaapp.com/mlfetkekTcDg2Q/img/238790e6-27be-44d4-b1bb-a85a0149aa2c-1.png",
      status: "正常运行",
      statusColor: "#53ce88",
      metrics: [
        { label: "管道压力设定", value: "500Pa" },
        { label: "排风频率", value: "0 Hz" },
        { label: "排风转速", value: "0 r/min" },
        { label: "管道压力", value: "16704 Pa" },
      ],
    },
    {
      id: 2,
      image:
        "https://c.animaapp.com/mlfetkekTcDg2Q/img/238790e6-27be-44d4-b1bb-a85a0149aa2c-1-1.png",
      status: "正常运行",
      statusColor: "#53ce88",
      metrics: [
        { label: "管道压力设定", value: "500Pa" },
        { label: "排风频率", value: "0 Hz" },
        { label: "排风转速", value: "0 r/min" },
        { label: "管道压力", value: "16704 Pa" },
      ],
    },
  ];

  const waterMonitoringDevices = [
    {
      id: 1,
      icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/4.svg",
      title: "智能水表",
      titleImage: "https://c.animaapp.com/mlfetkekTcDg2Q/img/1-1-1-1.png",
      metrics: [
        { label: "用水量", value: "120.35", placeholder: "XXXXXX" },
        { label: "瞬时流量", value: "120.35", placeholder: "XXXXXX" },
        { label: "阀门状态", value: "120.35", placeholder: "XXXXXX" },
      ],
    },
    {
      id: 2,
      icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/5.svg",
      title: "浸水检测器",
      titleImage: "https://c.animaapp.com/mlfetkekTcDg2Q/img/1-1-1-2.png",
      metrics: [
        { label: "浸水情况", value: "120.35", placeholder: "XXXXXX" },
        { label: "报警状态", value: "120.35", placeholder: "XXXXXX" },
      ],
    },
  ];

  return (
    <section className="absolute top-[85px] left-[1390px] w-[507px] h-[939px] flex flex-col gap-[10.9px]">
      <article className="h-[478.09px] relative -mt-1">
        <div className="h-[91.20%] top-[8.78%] bg-[linear-gradient(0deg,rgba(10,47,71,0.54)_0%,rgba(10,47,71,0.54)_100%)] absolute w-[99.21%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#61afc2]" />

        <img
          className="w-full h-[8.78%] absolute top-0 left-0"
          alt=""
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/1-3-1-3.png"
        />

        <div className="flex w-full h-[97.70%] items-center gap-[81px] px-12 py-0 absolute top-[2.30%] left-0">
          {exhaustFanData.map((fan) => (
            <div
              key={fan.id}
              className="inline-flex flex-col items-start justify-center gap-2 relative flex-[0_0_auto]"
            >
              <div className="flex flex-col w-[162px] items-center justify-center relative flex-[0_0_auto]">
                <img
                  className="relative w-[120px] h-40"
                  alt={`排风机 ${fan.id}`}
                  src={fan.image}
                />

                <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] -mt-2.5">
                  <div
                    className="relative w-1.5 h-1.5 rounded-[3px]"
                    style={{ backgroundColor: fan.statusColor }}
                  />

                  <div
                    className="relative w-fit mt-[-1.00px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-xs tracking-[0] leading-[19px] whitespace-nowrap"
                    style={{ color: fan.statusColor }}
                  >
                    {fan.status}
                  </div>
                </div>
              </div>

              <div className="relative w-[162px] h-[200px] overflow-hidden">
                <div className="flex flex-col w-[135px] items-start gap-0.5 px-0 py-2 relative top-1 left-[15px] [background:url(https://c.animaapp.com/mlfetkekTcDg2Q/img/frame-191-1.png)_50%_50%_/_cover]">
                  {fan.metrics.map((metric, index) => (
                    <div key={index}>
                      <div
                        className="relative self-stretch h-[21px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#ffffff8f] text-xs text-center tracking-[0] leading-[19px] whitespace-nowrap"
                        style={{ marginTop: index === 0 ? "-1px" : "0" }}
                      >
                        {metric.label}
                      </div>

                      <div className="relative w-[135px] h-[21px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#58cbc4] text-base text-center tracking-[0] leading-[19px] whitespace-nowrap">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="absolute w-[29.23%] h-[6.54%] top-[2.30%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
          排风机系统
        </h2>
      </article>

      <article className="h-[452px] relative">
        <div className="h-[92.02%] top-[8.51%] bg-[linear-gradient(0deg,rgba(10,47,71,0.54)_0%,rgba(10,47,71,0.54)_100%)] absolute w-[99.21%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#61afc2]" />

        <img
          className="w-full h-[9.44%] absolute top-0 left-0"
          alt=""
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/1-3-1-4.png"
        />

        <div className="absolute w-full h-[88.20%] top-[8.38%] left-0 flex gap-[3px]">
          {waterMonitoringDevices.map((device) => (
            <div
              key={device.id}
              className="mt-[83.0px] w-[247px] flex flex-col"
              style={{
                height: device.metrics.length === 3 ? "295.21px" : "249.21px",
              }}
            >
              <img
                className="ml-[46px] w-[157.2px] h-[83.24px] relative"
                alt={device.title}
                src={device.icon}
              />

              <div className="h-[52.93px] relative mt-[10.9px]">
                <img
                  className="absolute w-full h-[82.60%] top-0 left-0 bg-blend-overlay"
                  alt=""
                  src="https://c.animaapp.com/mlfetkekTcDg2Q/img/vector.svg"
                />

                <img
                  className="absolute top-[49px] left-0 w-[247px] h-px"
                  alt=""
                  src="https://c.animaapp.com/mlfetkekTcDg2Q/img/---copy-5.svg"
                />

                <div className="absolute top-px left-0.5 w-[246px] h-[52px]">
                  <img
                    className="absolute w-[99.19%] top-0 left-0 h-[52px]"
                    alt=""
                    src={device.titleImage}
                  />

                  <div
                    className="absolute top-2.5 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]"
                    style={{
                      left: device.id === 1 ? "85px" : "77px",
                      textAlign: device.id === 1 ? "left" : "center",
                    }}
                  >
                    {device.title}
                  </div>
                </div>
              </div>

              <div
                className="flex ml-[5.6px] w-[241px] relative mt-[28.1px] flex-col items-start gap-[18px] overflow-hidden"
                style={{
                  height: device.metrics.length === 3 ? "120px" : "74px",
                }}
              >
                {device.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="relative w-[243px] h-7 mr-[-2.00px]"
                  >
                    <div className="left-0 w-[245px] absolute top-0 h-7">
                      <img
                        className="absolute top-0 left-0 w-[241px] h-7"
                        alt=""
                        src={`https://c.animaapp.com/mlfetkekTcDg2Q/img/10-1-1-${device.id === 1 ? 12 + index : 15 + index}.png`}
                      />

                      <div className="absolute top-1.5 left-48 w-[45px] text-[#ffffff66] text-right leading-[normal] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-xs tracking-[0]">
                        {metric.placeholder}
                      </div>

                      <div className="absolute top-1.5 left-[104px] w-[45px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-xs text-right tracking-[0] leading-[normal]">
                        {metric.value}
                      </div>
                    </div>

                    <div
                      className="absolute left-1.5 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] text-xs text-center leading-[normal] font-normal text-white"
                      style={{
                        top:
                          index === 0 && metric.label === "用水量"
                            ? "6px"
                            : "5px",
                        fontFamily:
                          metric.label === "用水量"
                            ? "'Open_Sans',Helvetica"
                            : "'Source_Han_Sans_CN-Regular',Helvetica",
                        letterSpacing:
                          metric.label === "用水量" ? "0.97px" : "0.97px",
                      }}
                    >
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="absolute w-[29.23%] h-[6.71%] top-[2.36%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
          1楼用水监测
        </h2>
      </article>
    </section>
  );
};
