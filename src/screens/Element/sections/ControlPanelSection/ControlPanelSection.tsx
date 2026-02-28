import { Link } from "react-router-dom";

export const ControlPanelSection = (): JSX.Element => {
  const navigationItems = [
    {
      id: 1,
      label: "首页",
      image: "https://c.animaapp.com/CVwc6w4U/img/5-2-1@2x.png",
      topPosition: "top-[17px]",
      fontFamily: "[font-family:'Poppins',Helvetica]",
      fontWeight: "font-medium",
      lineHeight: "leading-[normal]",
      isActive: true,
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
      isActive: false,
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
      label: "实验室简介",
      image: "https://c.animaapp.com/CVwc6w4U/img/5-1-1-3@2x.png",
      topPosition: "top-3",
      fontFamily: "[font-family:'Poppins',Helvetica]",
      fontWeight: "font-medium",
      lineHeight: "leading-[16.9px]",
      isActive: false,
      route: "/lab-introduction",
    },
    {
      id: 6,
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

  const sharedButtonContent = (item: typeof navigationItems[0]) => (
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

  return (
    <nav
      className="inline-flex flex-col items-start gap-2.5 absolute top-[101px] left-[1318px]"
      role="navigation"
      aria-label="Control Panel Navigation"
    >
      {navigationItems.map((item) => {
        const className = `relative w-[59px] h-[54px] mr-[-2.00px] block ${item.route ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`;
        if (item.route) {
          return (
            <Link
              key={item.id}
              to={item.route}
              className={className}
              aria-label={item.label.replace("\n", " ")}
              aria-current={item.isActive ? "page" : undefined}
            >
              {sharedButtonContent(item)}
            </Link>
          );
        }
        return (
          <button
            key={item.id}
            className={className}
            type="button"
            aria-label={item.label.replace("\n", " ")}
            aria-current={item.isActive ? "page" : undefined}
          >
            {sharedButtonContent(item)}
          </button>
        );
      })}
    </nav>
  );
};
