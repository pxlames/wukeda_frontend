export const DataVisualizationSection = (): JSX.Element => {
  const ventilationCabinetData = {
    title: "1号通风柜",
    model: "型号-xtp1500",
    status: "正常",
    productionDate: "2025.02.05",
    serialNumber: "18892891829897",
    manufacturer: "武汉新天普",
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
  };

  const roomData = {
    title: "1号房间",
    metrics: [
      { label: "运行", value: "ON", unit: "", highlight: true },
      { label: "湿度", value: "22", unit: "%" },
      { label: "温度", value: "22", unit: "℃" },
      { label: "CO₂", value: "22", unit: "ppm" },
      { label: "CO", value: "22", unit: "ppm" },
      { label: "TVOC", value: "22", unit: "mg/m³" },
    ],
  };

  const powerMonitoringData = {
    title: "1号电力监测",
    subtitle: "智能电表",
    leftColumn: [
      { label: "A相电压", value: "120.30", unit: "v" },
      { label: "B相电压", value: "120.30", unit: "v" },
      { label: "C相电压", value: "120.30", unit: "v" },
      { label: "电流", value: "120.30", unit: "XXX" },
      { label: "功率", value: "120.30", unit: "XXX" },
      { label: "频率", value: "120.30", unit: "XXX" },
    ],
    rightColumn: [
      { label: "功率因素", value: "120.30", unit: "v" },
      { label: "双向电能", value: "120.30", unit: "v" },
      { label: "四象限电能", value: "120.30", unit: "v" },
      { label: "复费率电能", value: "120.30", unit: "XXX" },
      { label: "积累电能", value: "120.30", unit: "XXX" },
      { label: "其他参数", value: "120.30", unit: "XXX" },
    ],
  };

  return (
    <div className="absolute top-[81px] left-[25px] w-[507px] h-[943px] flex flex-col">
      <section className="w-[504px] h-[423px] relative">
        <div className="absolute w-[99.21%] h-[90.12%] top-[9.88%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#61afc2] bg-[linear-gradient(0deg,rgba(10,47,71,0.44)_0%,rgba(10,47,71,0.44)_100%)]" />

        <img
          className="w-[99.41%] h-[8.89%] absolute top-0 left-0"
          alt="Header decoration"
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/1-3-1.png"
        />

        <h2 className="absolute w-[29.23%] h-[6.71%] top-[2.11%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] text-white text-xl leading-[normal] font-normal tracking-[0]">
          {ventilationCabinetData.title}
        </h2>

        <div className="flex w-[99.21%] h-[50.83%] items-center gap-[51px] px-4 py-0 absolute top-[9.69%] left-0">
          <img
            className="relative w-[205px] h-[205px] ml-[-4.00px] object-cover"
            alt="Ventilation cabinet equipment"
            src="https://c.animaapp.com/mlfetkekTcDg2Q/img/jimeng-2025-11-12-7622------------------------------------------.png"
          />

          <div className="relative w-[232px] h-[134px] mr-[-12.00px] overflow-hidden">
            <img
              className="absolute w-full h-full top-[-4809.33%] left-[24361.64%]"
              alt=""
            />

            <img
              className="absolute w-[98.99%] h-[73.88%] top-[-4809.33%] left-[24361.64%]"
              alt=""
            />

            <div className="flex flex-col w-[168px] items-start gap-1 absolute top-1 left-[15px]">
              <div className="relative self-stretch h-[21px] mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-[#00d8ff] text-xl tracking-[0] leading-[19px] whitespace-nowrap">
                {ventilationCabinetData.model}
              </div>

              <div className="relative w-[166.9px] h-[21px]">
                <div className="absolute top-[7px] left-0 w-1.5 h-1.5 bg-[#53ce88] rounded-[3px]" />

                <p className="absolute w-[91.27%] h-full top-0 left-[7.54%] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-transparent text-[13px] tracking-[0] leading-[19px] whitespace-nowrap">
                  <span className="text-white">运行状态&nbsp;&nbsp;</span>
                  <span className="text-[#53ce88]">
                    {ventilationCabinetData.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="absolute top-[58px] left-7 w-[147px] [font-family:'Poppins',Helvetica] font-normal text-[#ffffff8f] text-[13px] tracking-[0] leading-[19px] whitespace-nowrap">
              生成日期&nbsp;&nbsp;{ventilationCabinetData.productionDate}
            </div>

            <div className="absolute top-[84px] left-7 w-[168px] [font-family:'Poppins',Helvetica] font-normal text-[#ffffff8f] text-[13px] tracking-[0] leading-[19px] whitespace-nowrap">
              序列号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {ventilationCabinetData.serialNumber}
            </div>

            <div className="absolute top-[108px] left-7 w-[147px] [font-family:'Poppins',Helvetica] font-normal text-[#ffffff8f] text-[13px] tracking-[0] leading-[19px] whitespace-nowrap">
              制造商&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {ventilationCabinetData.manufacturer}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full items-start justify-center gap-2.5 px-6 py-0 absolute top-[calc(50.00%_+_57px)] left-0">
          <div className="inline-flex items-center gap-[22px] relative flex-[0_0_auto] mr-[-10.00px]">
            {ventilationCabinetData.metrics.slice(0, 4).map((metric, index) => (
              <div
                key={index}
                className="flex flex-col w-[100px] items-center justify-center gap-1 relative"
              >
                <div className="relative w-[100px] mt-[-1.00px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#9ba3aa] text-sm text-center tracking-[0] leading-[normal]">
                  {metric.label}
                </div>

                <div
                  className={`bg-[url(https://c.animaapp.com/mlfetkekTcDg2Q/img/7-1-1${index > 0 ? `-${index}` : ""}.png)] relative w-[100px] h-[39px] bg-[100%_100%]`}
                >
                  <div className="flex w-[100px] items-center justify-center gap-0.5 relative top-2">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Open_Sans',Helvetica] text-lg tracking-[0] font-normal text-white leading-[normal]">
                      {metric.value}
                    </div>
                    {metric.unit && (
                      <div className="relative w-fit [font-family:'Microsoft_YaHei-Regular',Helvetica] font-normal text-[#ffffff80] text-sm tracking-[1.40px] leading-[normal]">
                        {metric.unit}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-[22px] relative flex-[0_0_auto] mr-[-10.00px]">
            {ventilationCabinetData.metrics.slice(4, 8).map((metric, index) => (
              <div
                key={index}
                className="flex flex-col w-[100px] items-center justify-center gap-1 relative"
              >
                <div className="relative w-[100px] mt-[-1.00px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#9ba3aa] text-sm text-center tracking-[0] leading-[normal]">
                  {metric.label}
                </div>

                <div
                  className={`bg-[url(https://c.animaapp.com/mlfetkekTcDg2Q/img/7-1-1-${index + 4}.png)] relative w-[100px] h-[39px] bg-[100%_100%]`}
                >
                  <div className="flex w-[100px] items-center justify-center gap-0.5 relative top-2">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal]">
                      {metric.value}
                    </div>
                    {metric.unit && (
                      <div className="relative w-fit [font-family:'Microsoft_YaHei-Regular',Helvetica] font-normal text-[#ffffff80] text-sm tracking-[1.40px] leading-[normal]">
                        {metric.unit}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <img
          className="absolute top-[145px] left-[283px] w-[5px] h-[52px]"
          alt="Divider"
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/8-1-1.png"
        />
      </section>

      <section className="w-[504px] h-[218px] relative mt-1">
        <img
          className="absolute w-full h-[15.35%] top-0 left-0"
          alt="Header decoration"
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/1-3-1-1.png"
        />

        <div className="h-[84.65%] top-[15.55%] bg-[linear-gradient(0deg,rgba(10,47,71,0.7)_0%,rgba(10,47,71,0.7)_100%)] absolute w-[99.21%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#61afc2]" />

        <h2 className="absolute w-[29.23%] h-[10.70%] top-[3.37%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
          {roomData.title}
        </h2>

        <div className="flex flex-col w-[100.60%] items-start gap-2 px-6 py-[15px] absolute top-[calc(50.00%_-_82px)] left-0">
          <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
            {roomData.metrics.slice(0, 3).map((metric, index) => (
              <div key={index} className="relative w-[146.3px] h-[77px]">
                <img
                  className="absolute w-full h-[96.10%] top-[2.60%] left-0"
                  alt={`${metric.label} background`}
                  src={`https://c.animaapp.com/mlfetkekTcDg2Q/img/9-2-1${index > 0 ? `-${index}` : ""}.png`}
                />

                <div className="absolute top-7 left-[13px] [font-family:'Open_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                  {metric.label}
                </div>

                {metric.highlight ? (
                  <div className="absolute top-7 left-[109px] [font-family:'Open_Sans',Helvetica] font-semibold text-[#00d8ff] text-base tracking-[0] leading-[normal]">
                    {metric.value}
                  </div>
                ) : (
                  <p className="absolute top-7 left-[105px] [font-family:'Open_Sans',Helvetica] font-normal text-transparent text-base tracking-[0] leading-[normal]">
                    <span className="font-semibold text-[#00d8ff]">
                      {metric.value}
                    </span>
                    <span className="text-white">&nbsp;</span>
                    <span className="text-[#ffffff63]">{metric.unit}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
            {roomData.metrics.slice(3, 6).map((metric, index) => (
              <div key={index} className="relative w-[146.3px] h-[77px]">
                <img
                  className="absolute w-full h-[96.10%] top-[2.60%] left-0"
                  alt={`${metric.label} background`}
                  src={`https://c.animaapp.com/mlfetkekTcDg2Q/img/9-2-1-${index + 3}.png`}
                />

                <div className="absolute top-7 left-[13px] [font-family:'Open_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                  {metric.label}
                </div>

                <p
                  className={`absolute top-7 ${index === 2 ? "left-[70px]" : "left-[84px]"} [font-family:'Open_Sans',Helvetica] text-transparent leading-[normal] font-normal text-base tracking-[0]`}
                >
                  <span className="font-semibold text-[#00d8ff]">
                    {metric.value}
                  </span>
                  <span className="text-white">&nbsp;</span>
                  <span className="text-[#ffffff63]">{metric.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-[504px] h-[293px] relative mt-[5px]">
        <div className="h-[85.43%] top-[14.57%] bg-[linear-gradient(0deg,rgba(10,47,71,0.54)_0%,rgba(10,47,71,0.54)_100%)] absolute w-[99.21%] left-0 border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-l [border-left-style:solid] border-[#61afc2]" />

        <img
          className="absolute w-full h-[15.35%] top-0 left-0"
          alt="Header decoration"
          src="https://c.animaapp.com/mlfetkekTcDg2Q/img/1-3-1-2.png"
        />

        <h2 className="absolute w-[29.23%] h-[10.70%] top-[3.37%] left-[5.33%] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
          {powerMonitoringData.title}
        </h2>

        <div className="absolute w-[48.58%] h-[17.69%] top-[18.09%] left-[26.19%]">
          <img
            className="absolute w-[99.18%] top-0 left-0 h-[52px]"
            alt="Smart meter label background"
            src="https://c.animaapp.com/mlfetkekTcDg2Q/img/1-1-1.png"
          />

          <div className="absolute w-[31.86%] h-[53.42%] top-[19.30%] left-[34.61%] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
            {powerMonitoringData.subtitle}
          </div>
        </div>

        <div className="flex w-[98.41%] h-[58.70%] items-start gap-[5px] px-1 py-0 absolute top-[38.57%] left-0 overflow-hidden">
          <div className="relative w-[241px] h-[250px] mb-[-78.00px]">
            {powerMonitoringData.leftColumn.map((item, index) => (
              <div
                key={index}
                className="absolute left-0 w-[241px] h-[30px] overflow-hidden"
                style={{ top: `${index * 44}px` }}
              >
                <div className="absolute top-0 -left-2 w-[253px] h-7">
                  <img
                    className="absolute top-0 left-2 w-[241px] h-7"
                    alt={`${item.label} background`}
                    src={`https://c.animaapp.com/mlfetkekTcDg2Q/img/10-1-1${index > 0 ? `-${index}` : ""}.png`}
                  />

                  <div className="absolute top-1.5 left-[119px] [font-family:'Open_Sans',Helvetica] font-normal text-white text-xs text-right tracking-[0] leading-[normal]">
                    {item.value}
                  </div>

                  <div
                    className={`${index === 3 ? "left-[216px]" : "left-[231px]"} [font-family:'Open_Sans',Helvetica] absolute top-1.5 font-normal text-[#ffffff66] text-xs text-right tracking-[0] leading-[normal]`}
                  >
                    {item.unit}
                  </div>
                </div>

                <div className="absolute top-[5px] left-1 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#58cbc4] text-xs tracking-[0] leading-[normal]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="relative w-[241px] h-[250px] mb-[-78.00px]">
            {powerMonitoringData.rightColumn.map((item, index) => (
              <div
                key={index}
                className="absolute left-0 w-[241px] h-[30px] overflow-hidden"
                style={{ top: `${index * 44}px` }}
              >
                <div className="absolute top-0 -left-2 w-[253px] h-7">
                  <img
                    className="absolute top-0 left-2 w-[241px] h-7"
                    alt={`${item.label} background`}
                    src={`https://c.animaapp.com/mlfetkekTcDg2Q/img/10-1-1-${index + 6}.png`}
                  />

                  <div className="absolute top-1.5 left-[119px] [font-family:'Open_Sans',Helvetica] font-normal text-white text-xs text-right tracking-[0] leading-[normal]">
                    {item.value}
                  </div>

                  <div
                    className={`${index === 3 ? "left-[216px]" : "left-[231px]"} [font-family:'Open_Sans',Helvetica] absolute top-1.5 font-normal text-[#ffffff66] text-xs text-right tracking-[0] leading-[normal]`}
                  >
                    {item.unit}
                  </div>
                </div>

                <div
                  className={`absolute top-[${index === 2 ? "7px" : "5px"}] left-1 [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#58cbc4] text-${index === 2 || index === 3 ? "[10px]" : "xs"} tracking-[0] leading-[normal]`}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
