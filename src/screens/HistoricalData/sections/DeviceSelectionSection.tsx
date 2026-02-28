import { Link } from "react-router-dom";

interface NavigationItem {
  id: string;
  label: string;
  imageUrl: string;
  fontFamily: string;
  fontWeight: string;
  topPosition: string;
  lineHeight: string;
  opacity?: string;
  ariaLabel: string;
  route?: string | null;
}

export const DeviceSelectionSection = (): JSX.Element => {
  const navigationItems: NavigationItem[] = [
    {
      id: "home",
      label: "首页",
      route: "/",
      imageUrl: "https://c.animaapp.com/mlfetkekTcDg2Q/img/5-2-1.png",
      fontFamily: "[font-family:'Poppins',Helvetica]",
      fontWeight: "font-medium",
      topPosition: "top-[17px]",
      lineHeight: "leading-[normal]",
      ariaLabel: "首页 - 主页导航",
    },
    {
      id: "device-detection",
      label: "设备\n检测",
      route: "/device-dashboard",
      imageUrl: "https://c.animaapp.com/mlfetkekTcDg2Q/img/5-1-1.png",
      fontFamily: "[font-family:'Poppins',Helvetica]",
      fontWeight: "font-medium",
      topPosition: "top-[11px]",
      lineHeight: "leading-[16.9px]",
      ariaLabel: "设备检测 - 设备检测页面",
    },
    {
      id: "historical-data",
      label: "历史\n数据",
      route: "/historical-data",
      imageUrl: "https://c.animaapp.com/mlfetkekTcDg2Q/img/5-1-1-1.png",
      fontFamily: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica]",
      fontWeight: "font-normal",
      topPosition: "top-[11px]",
      lineHeight: "leading-[16.9px]",
      ariaLabel: "历史数据 - 历史数据页面",
    },
    {
      id: "alarm",
      label: "报警",
      route: null,
      imageUrl: "https://c.animaapp.com/mlfetkekTcDg2Q/img/5-1-1-2.png",
      fontFamily: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica]",
      fontWeight: "font-normal",
      topPosition: "top-5",
      lineHeight: "leading-[16.9px]",
      ariaLabel: "报警 - 报警页面",
    },
    {
      id: "lab-intro",
      label: "实验室简介",
      imageUrl: "https://c.animaapp.com/mlfetkekTcDg2Q/img/5-1-1-3.png",
      fontFamily: "[font-family:'Poppins',Helvetica]",
      fontWeight: "font-medium",
      topPosition: "top-3",
      lineHeight: "leading-[16.9px]",
      ariaLabel: "实验室简介 - 实验室简介页面",
    },
    {
      id: "switch",
      label: "切换",
      route: null,
      imageUrl: "https://c.animaapp.com/mlfetkekTcDg2Q/img/5-1-1-4.png",
      fontFamily: "[font-family:'Source_Han_Sans_CN-Regular',Helvetica]",
      fontWeight: "font-normal",
      topPosition: "top-[19px]",
      lineHeight: "leading-[16.9px]",
      opacity: "opacity-50",
      ariaLabel: "切换 - 切换功能",
    },
  ];

  const sharedContent = (item: NavigationItem) => (
    <>
      <img
        className="absolute top-0 left-0 w-[57px] h-[54px] pointer-events-none"
        alt=""
        src={item.imageUrl}
        loading="lazy"
      />
      <div
        className={`absolute ${item.topPosition} left-[3px] w-[52px] ${item.fontFamily} ${item.fontWeight} text-[#ffffffcc] text-sm text-center tracking-[0] ${item.lineHeight} ${item.label.includes("\n") ? "" : "whitespace-nowrap"} ${item.opacity || ""}`}
      >
        {item.label.split("\n").map((line, index, arr) => (
          <span key={index}>
            {line}
            {index < arr.length - 1 && <br />}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <nav
      className="flex flex-col w-[57px] items-start gap-2.5 absolute top-[101px] left-[1318px]"
      role="navigation"
      aria-label="主导航菜单"
    >
      {navigationItems.map((item) => {
        const className = "relative w-[59px] h-[54px] mr-[-2.00px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded transition-transform hover:scale-105 active:scale-95 block";
        if (item.route) {
          return (
            <Link
              key={item.id}
              to={item.route}
              className={className}
              aria-label={item.ariaLabel}
              aria-current={item.id === "historical-data" ? "page" : undefined}
            >
              {sharedContent(item)}
            </Link>
          );
        }
        return (
          <button
            key={item.id}
            type="button"
            className={className}
            aria-label={item.ariaLabel}
          >
            {sharedContent(item)}
          </button>
        );
      })}
    </nav>
  );
};
