import { useNavigate } from "react-router-dom";

interface NavigationSidebarSectionProps {
  selectedFloor?: string;
  onFloorChange: (floor: string | undefined) => void;
}

export const NavigationSidebarSection = ({
  selectedFloor,
  onFloorChange,
}: NavigationSidebarSectionProps): JSX.Element => {
  const navigate = useNavigate();
  
  const navigationItems = [
    {
      id: 1,
      label: "全部",
      floor: undefined,
      image: "https://c.animaapp.com/mlf6o2v3f0K6fB/img/5-2-1.png",
      alt: "全部楼层",
      topPosition: "top-[17px]",
      lineHeight: "leading-[normal]",
      whitespace: "",
    },
    {
      id: 2,
      label: "楼顶",
      floor: "RF",
      image: "https://c.animaapp.com/mlf6o2v3f0K6fB/img/5-1-1.png",
      alt: "楼顶",
      topPosition: "top-[19px]",
      lineHeight: "leading-[16.9px]",
      whitespace: "whitespace-nowrap",
    },
    {
      id: 3,
      label: "5F",
      floor: "5F",
      image: "https://c.animaapp.com/mlf6o2v3f0K6fB/img/5-1-1-1.png",
      alt: "5F",
      topPosition: "top-[18px]",
      lineHeight: "leading-[16.9px]",
      whitespace: "whitespace-nowrap",
    },
    {
      id: 4,
      label: "4F",
      floor: "4F",
      image: "https://c.animaapp.com/mlf6o2v3f0K6fB/img/5-1-1-2.png",
      alt: "4F",
      topPosition: "top-[18px]",
      lineHeight: "leading-[16.9px]",
      whitespace: "whitespace-nowrap",
    },
    {
      id: 5,
      label: "3F",
      floor: "3F",
      image: "https://c.animaapp.com/mlf6o2v3f0K6fB/img/5-1-1-3.png",
      alt: "3F",
      topPosition: "top-[18px]",
      lineHeight: "leading-[16.9px]",
      whitespace: "whitespace-nowrap",
    },
    {
      id: 6,
      label: "2F",
      floor: "2F",
      image: "https://c.animaapp.com/mlf6o2v3f0K6fB/img/5-1-1-4.png",
      alt: "2F",
      topPosition: "top-[19px]",
      lineHeight: "leading-[16.9px]",
      whitespace: "whitespace-nowrap",
    },
  ];

  const handleClick = (item: typeof navigationItems[0]) => {
    if (item.route) {
      navigate(item.route);
    } else {
      console.log('切换楼层:', item.floor, '当前选中:', selectedFloor);
      onFloorChange(item.floor);
    }
  };

  return (
    <nav
      className="flex flex-col w-[57px] items-start gap-[26px] absolute top-[86px] left-11"
      role="navigation"
      aria-label="楼层导航"
    >
      {navigationItems.map((item) => {
        // 修复：正确处理 undefined 的比较
        const isActive = (item.floor === undefined && selectedFloor === undefined) || 
                        (item.floor !== undefined && item.floor === selectedFloor);
        
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className="relative w-[59px] h-[54px] mr-[-2.00px] cursor-pointer"
            aria-label={item.label}
            type="button"
          >
            <img
              className="absolute top-0 left-0 w-[57px] h-[54px]"
              alt={item.alt}
              src={item.image}
            />

            <div
              className={`${item.topPosition} ${item.lineHeight} ${item.whitespace} absolute left-[3px] w-[52px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-sm text-center tracking-[0] ${
                isActive ? 'text-white' : 'text-[#ffffffcc]'
              }`}
            >
              {item.label}
            </div>
          </button>
        );
      })}
    </nav>
  );
};
