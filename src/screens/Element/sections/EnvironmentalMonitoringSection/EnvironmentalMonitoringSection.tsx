export const EnvironmentalMonitoringSection = (): JSX.Element => {
  const exhaustFanData = [
    {
      id: 1,
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

  const waterMeterMetrics = [
    { label: "用水量", value: "120.35", unit: "XXXXXX" },
    { label: "瞬时流量", value: "120.35", unit: "XXXXXX" },
    { label: "阀门状态", value: "120.35", unit: "XXXXXX" },
  ];

  const waterDetectorMetrics = [
    { label: "浸水情况", value: "120.35", unit: "XXXXXX" },
    { label: "报警状态", value: "120.35", unit: "XXXXXX" },
  ];

  return (
    <section className="absolute top-[85px] left-[1390px] w-[507px] h-[939px] flex flex-col gap-[10.9px]">
      {/* 排风机系统 */}
      <article className="h-[478.09px] relative -mt-1">
        <div className="h-[91.20%] top-[8.78%] bg-[linear-gradient(0deg,rgba(10,47,71,0.54)_0%,rgba(10,47,71,0.54)_100%)] absolute w-[99.21%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#61afc2]" />

        <img
          className="w-full h-[8.78%] absolute top-0 left-0"
          alt=""
          src="https://c.animaapp.com/CVwc6w4U/img/1-3-1-3.png"
        />

        <h2 className="absolute w-[29.23%] h-[6.54%] top-[2.30%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
          排风机系统
        </h2>

        {/* 排风机容器 */}
        <div className="flex w-full items-start justify-center gap-[40px] px-6 py-0 absolute top-[50px] left-0">
          {exhaustFanData.map((fan) => (
            <div
              key={fan.id}
              className="flex flex-col items-center justify-start gap-2 relative w-[200px]"
            >
              {/* 排风机图片 */}
              <div className="flex flex-col items-center justify-center relative">
                <img
                  className="relative w-[140px] h-[160px] object-contain"
                  alt="排风机设备"
                  src="https://c.animaapp.com/CVwc6w4U/img/238790e6-27be-44d4-b1bb-a85a0149aa2c-1-1@2x.png"
                />

                {/* 状态指示 */}
                <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] mt-1">
                  <div
                    className="relative w-1.5 h-1.5 rounded-[3px]"
                    style={{ backgroundColor: fan.statusColor }}
                    aria-hidden="true"
                  />
                  <div
                    className="relative w-fit [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-xs tracking-[0] leading-[19px] whitespace-nowrap"
                    style={{ color: fan.statusColor }}
                  >
                    {fan.status}
                  </div>
                </div>
              </div>

              {/* 数据卡片背景 */}
              <div className="relative w-[160px] h-[200px] mt-2">
                {/* 背景框 - 渐变半透明 */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a2f4780] to-[#0a2f47cc] border border-[#3a7a8a50] rounded-sm" />
                
                {/* 顶部装饰线 */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#58cbc4] to-transparent" />
                
                {/* 数据内容 */}
                <div className="relative flex flex-col items-center gap-1 px-2 py-3">
                  {fan.metrics.map((metric, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                      <div className="[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#ffffff8f] text-xs text-center tracking-[0] leading-[19px] whitespace-nowrap">
                        {metric.label}
                      </div>
                      <div className="[font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#58cbc4] text-base text-center tracking-[0] leading-[24px] whitespace-nowrap">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* 1楼用水监测 */}
      <article className="h-[452px] relative">
        <div className="h-[92.02%] top-[8.51%] bg-[linear-gradient(0deg,rgba(10,47,71,0.54)_0%,rgba(10,47,71,0.54)_100%)] absolute w-[99.21%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#61afc2]" />

        <img
          className="w-full h-[9.44%] absolute top-0 left-0"
          alt=""
          src="https://c.animaapp.com/CVwc6w4U/img/1-3-1-4.png"
        />

        <div className="absolute w-full h-[88.20%] top-[8.38%] left-0 flex gap-[3px]">
          <div className="mt-[83.0px] w-[247px] h-[295.21px] relative ml-[7px]">
            <div className="flex flex-col w-[241px] items-start gap-[18px] absolute top-[175px] left-1.5 overflow-hidden">
              {waterMeterMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="relative w-[243px] h-7 mr-[-2.00px]"
                >
                  <div className="left-0 w-[245px] absolute top-0 h-7">
                    <img
                      className="absolute top-0 left-0 w-[241px] h-7"
                      alt=""
                      src="https://c.animaapp.com/CVwc6w4U/img/10-1-1-16@2x.png"
                    />

                    <div className="absolute top-1.5 left-48 w-[45px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#ffffff66] text-xs text-right tracking-[0] leading-[normal]">
                      {metric.unit}
                    </div>

                    <div className="absolute top-1.5 left-[104px] w-[45px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-xs text-right tracking-[0] leading-[normal]">
                      {metric.value}
                    </div>
                  </div>

                  <div
                    className={`absolute ${index === 0 ? "top-1.5 left-1.5 [font-family:'Open_Sans',Helvetica]" : "top-[5px] left-1.5 [font-family:'Source_Han_Sans_CN-Regular',Helvetica]"} font-normal text-white text-xs text-center tracking-[0.97px] leading-[normal]`}
                  >
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            <img
              className="absolute top-0 left-[46px] w-[157px] h-[83px]"
              alt="智能水表图标"
              src="https://c.animaapp.com/CVwc6w4U/img/4.svg"
            />

            <div className="absolute w-full h-[17.93%] top-[31.89%] left-0">
              <img
                className="absolute w-full h-[82.60%] top-0 left-0 bg-blend-overlay"
                alt=""
                src="https://c.animaapp.com/CVwc6w4U/img/vector.svg"
              />

              <img
                className="absolute top-[49px] left-0 w-[247px] h-px"
                alt=""
                src="https://c.animaapp.com/CVwc6w4U/img/---copy-5.svg"
              />

              <div className="absolute w-[99.72%] top-px left-0 h-[52px]">
                <img
                  className="absolute w-[99.19%] top-0 left-0 h-[52px] aspect-[4.69]"
                  alt=""
                  src="https://c.animaapp.com/CVwc6w4U/img/1-1-1-2@2x.png"
                />

                <div className="absolute top-2.5 left-[85px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                  智能水表
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[83.0px] w-[247px] h-[249.21px] relative">
            <div className="flex flex-col w-[241px] items-start gap-[18px] absolute top-[175px] left-1.5 overflow-hidden">
              {waterDetectorMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="relative w-[243px] h-7 mr-[-2.00px]"
                >
                  <div className="left-0 w-[245px] absolute top-0 h-7">
                    <img
                      className="absolute top-0 left-0 w-[241px] h-7"
                      alt=""
                      src="https://c.animaapp.com/CVwc6w4U/img/10-1-1-16@2x.png"
                    />

                    <div className="absolute top-1.5 left-48 w-[45px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#ffffff66] text-xs text-right tracking-[0] leading-[normal]">
                      {metric.unit}
                    </div>

                    <div className="absolute top-1.5 left-[104px] w-[45px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-xs text-right tracking-[0] leading-[normal]">
                      {metric.value}
                    </div>
                  </div>

                  <div
                    className={`absolute ${index === 0 ? "top-1.5 left-1.5 [font-family:'Open_Sans',Helvetica]" : "top-[5px] left-1.5 [font-family:'Source_Han_Sans_CN-Regular',Helvetica]"} font-normal text-white text-xs text-center tracking-[0.97px] leading-[normal]`}
                  >
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            <img
              className="absolute top-0 left-[46px] w-[157px] h-[83px]"
              alt="浸水检测器图标"
              src="https://c.animaapp.com/CVwc6w4U/img/5.svg"
            />

            <div className="absolute w-full h-[21.24%] top-[37.78%] left-0">
              <img
                className="absolute w-full h-[82.60%] top-0 left-0 bg-blend-overlay"
                alt=""
                src="https://c.animaapp.com/CVwc6w4U/img/vector-1.svg"
              />

              <img
                className="absolute top-[49px] left-0 w-[247px] h-px"
                alt=""
                src="https://c.animaapp.com/CVwc6w4U/img/---copy-5-1.svg"
              />

              <div className="absolute w-[99.72%] top-px left-0 h-[52px]">
                <img
                  className="absolute w-[99.19%] top-0 left-0 h-[52px] aspect-[4.69]"
                  alt=""
                  src="https://c.animaapp.com/CVwc6w4U/img/1-1-1-2@2x.png"
                />

                <div className="absolute top-2.5 left-[77px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-[normal]">
                  浸水检测器
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="absolute w-[29.23%] h-[6.71%] top-[2.36%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
          1楼用水监测
        </h2>
      </article>
    </section>
  );
};
