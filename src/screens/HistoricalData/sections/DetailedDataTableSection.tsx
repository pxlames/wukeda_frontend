export const DetailedDataTableSection = (): JSX.Element => {
  const alertData = [
    { id: 1, type: "错误告警", icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/2-3.png", message: "空气质量监测器#25 CO2浓度严重超标" },
    { id: 2, type: "主要告警", icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/2-4-1.png", message: "空气质量监测器#25 数据异常" },
    { id: 3, type: "主要告警", icon: "https://c.animaapp.com/mlfetkekTcDg2Q/img/2-4-1.png", message: "" },
  ];

  return (
    <section className="absolute top-[64px] left-[1306px] w-[413px] h-[349px]" aria-label="历史告警信息">
      <div className="absolute top-0 left-0 w-[413px] h-[349px] overflow-y-auto overflow-x-hidden">
        <div className="absolute top-0 left-0 w-[413px] h-[418px] bg-[#0000004a]" />

        {alertData.map((alert, index) => {
          const topPositions = [49, 172, 290];
          const messageTopPositions = [103, 229, 0];
          
          return (
            <div key={alert.id}>
              <img
                className="absolute left-11 w-[103px] object-cover"
                style={{ top: `${topPositions[index]}px`, height: index === 0 ? '36px' : '37px' }}
                alt={`${alert.type}图标`}
                src={alert.icon}
              />

              <div
                className="absolute left-16 w-16 h-8 flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-[48px] whitespace-nowrap"
                style={{ top: `${topPositions[index] + (index === 0 ? 2 : 3)}px` }}
              >
                {alert.type}
              </div>

              {alert.message && (
                <div className="absolute left-11 w-[361px] h-11" style={{ top: `${messageTopPositions[index]}px` }}>
                  <p className="absolute top-2 left-5 w-[270px] h-7 flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-[48px] whitespace-nowrap">
                    {alert.message}
                  </p>
                  <img className="absolute top-0 left-0 w-[359px] h-11 object-cover" alt="消息背景" src="https://c.animaapp.com/mlfetkekTcDg2Q/img/2-6-1.png" />
                </div>
              )}
            </div>
          );
        })}

        <header className="absolute top-0 left-0 w-[415px] h-[39px]">
          <img className="h-[38px] absolute top-0 left-0 w-[413px]" alt="标题背景" src="https://c.animaapp.com/mlfetkekTcDg2Q/img/----3-1-3.png" />
          <h2 className="absolute top-0.5 left-[42px] w-[105px] h-[37px] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-[#0db8db] text-base tracking-[0] leading-[48px] whitespace-nowrap">
            历史告警信息
          </h2>
        </header>
      </div>
    </section>
  );
};
