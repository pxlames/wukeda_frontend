import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import labIntroductionData from "virtual:lab-introduction-data";
import labIntroductionConfig from "../../config/labIntroduction.config";
import type { LabIntroductionFloorData, LabIntroductionRoomData } from "../../types/labIntroduction.types";

interface TabItem {
  id: string;
  label: string;
  route?: string;
}

interface TextSection {
  title: string;
  paragraphs: string[];
}

const WEATHER_INFO = {
  condition: "晴转多云",
  temperature: "17-18℃",
  wind: "东南风",
};

const WEEKDAY_LABELS = [
  "周日",
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六",
];

const TABS: TabItem[] = [
  { id: "environment", label: "环境", route: "/screen" },
  { id: "exhaust", label: "排风", route: "/paifeng" },
  { id: "ventilation", label: "通风", route: "/tongfeng" },
  { id: "gas", label: "气路" },
  { id: "wastewater", label: "废水" },
  { id: "energy", label: "能耗", route: "/nenghao" },
];

const joinBaseUrl = (assetPath: string): string => {
  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedAssetPath = assetPath.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedAssetPath}`;
};

const formatDateLabel = (currentTime: Date): string => {
  const year = currentTime.getFullYear();
  const month = String(currentTime.getMonth() + 1).padStart(2, "0");
  const day = String(currentTime.getDate()).padStart(2, "0");
  const weekday = WEEKDAY_LABELS[currentTime.getDay()] ?? "";

  return `${year}年${month}月${day}日 ${weekday}`;
};

const formatTimeLabel = (currentTime: Date): string =>
  currentTime.toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const parseTextSections = (
  textContent: string,
  fallbackTitle: string,
): TextSection[] => {
  const normalizedContent = textContent.replace(/\r\n/g, "\n").trim();
  if (!normalizedContent) {
    return [
      {
        title: fallbackTitle,
        paragraphs: ["当前房间还没有找到说明文本，请在房间目录中补充一个 .txt 文件。"],
      },
    ];
  }

  const lines = normalizedContent.split("\n");
  const sections: Array<{ title: string; bodyLines: string[] }> = [];
  let currentSection = { title: fallbackTitle, bodyLines: [] as string[] };

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (/^#{1,2}\s+/.test(trimmedLine)) {
      if (currentSection.title || currentSection.bodyLines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmedLine.replace(/^#{1,2}\s+/, "").trim(),
        bodyLines: [],
      };
      return;
    }

    currentSection.bodyLines.push(line);
  });

  if (currentSection.title || currentSection.bodyLines.length > 0) {
    sections.push(currentSection);
  }

  return sections
    .map((section) => ({
      title: section.title || fallbackTitle,
      paragraphs: section.bodyLines
        .join("\n")
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\n+/g, " ").trim())
        .filter(Boolean),
    }))
    .filter((section) => section.paragraphs.length > 0);
};

const getSelectedFloor = (
  floors: LabIntroductionFloorData[],
  selectedFloorId: string,
): LabIntroductionFloorData | null =>
  floors.find((floor) => floor.id === selectedFloorId) ?? floors[0] ?? null;

const getDefaultFloorId = (floors: LabIntroductionFloorData[]): string =>
  floors.find((floor) => floor.rooms.length > 0)?.id ?? floors[0]?.id ?? "";

const getSelectedRoom = (
  rooms: LabIntroductionRoomData[],
  selectedRoomId: string,
): LabIntroductionRoomData | null =>
  rooms.find((room) => room.roomId === selectedRoomId) ?? rooms[0] ?? null;

export const LabIntroduction = (): JSX.Element => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [selectedFloorId, setSelectedFloorId] = useState(
    () => getDefaultFloorId(labIntroductionData.floors),
  );
  const [selectedRoomId, setSelectedRoomId] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const selectedFloor = getSelectedFloor(
      labIntroductionData.floors,
      selectedFloorId,
    );
    if (selectedFloor && selectedFloor.id !== selectedFloorId) {
      setSelectedFloorId(selectedFloor.id);
    }
  }, [selectedFloorId]);

  const selectedFloor = useMemo(
    () => getSelectedFloor(labIntroductionData.floors, selectedFloorId),
    [selectedFloorId],
  );

  const roomOptions = selectedFloor?.rooms ?? [];

  useEffect(() => {
    const selectedRoom = getSelectedRoom(roomOptions, selectedRoomId);
    const nextRoomId = selectedRoom?.roomId ?? "";

    if (nextRoomId !== selectedRoomId) {
      setSelectedRoomId(nextRoomId);
    }
  }, [roomOptions, selectedRoomId]);

  const selectedRoom = useMemo(
    () => getSelectedRoom(roomOptions, selectedRoomId),
    [roomOptions, selectedRoomId],
  );

  const visibleImages = useMemo(
    () => [
      selectedRoom?.primaryImage ?? labIntroductionConfig.fallbackImageUrls[0],
      selectedRoom?.secondaryImage ?? labIntroductionConfig.fallbackImageUrls[1],
    ].slice(0, labIntroductionConfig.maxImagesPerRoom),
    [selectedRoom],
  );

  const textSections = useMemo(
    () =>
      parseTextSections(
        selectedRoom?.textContent ?? "",
        selectedRoom?.roomName ?? "实验室简介",
      ),
    [selectedRoom],
  );

  const handleTabClick = (route?: string) => {
    if (route) {
      navigate(route);
    }
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
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.route)}
            className={`relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'YouSheBiaoTiHei-Regular',Helvetica] font-normal text-[26px] tracking-[0.52px] leading-[48px] whitespace-nowrap ${
              tab.id === "environment"
                ? "text-white opacity-[0.58]"
                : "text-[#ffffff94]"
            } ${tab.route ? "cursor-pointer hover:text-white transition-colors" : "cursor-default"}`}
            aria-current={tab.id === "environment" ? "page" : undefined}
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
          {WEATHER_INFO.condition}
        </div>
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          {WEATHER_INFO.temperature}
        </div>
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[normal]">
          {WEATHER_INFO.wind}
        </div>
      </div>

      <div
        className="w-[270px] items-center top-[39px] left-[1570px] absolute flex"
        role="complementary"
        aria-label="Date and time"
      >
        <time className="relative w-[188px] [font-family:'Source_Han_Sans_CN-Regular',Helvetica] font-normal text-[#95e2ff] text-base tracking-[0] leading-[10px]">
          {formatDateLabel(currentTime)}
        </time>
        <time className="relative w-fit -ml-1.5 [font-family:'LCD2-Bold',Helvetica] font-bold text-[#95e2ff] text-base tracking-[2.00px] leading-5 whitespace-nowrap">
          {formatTimeLabel(currentTime)}
        </time>
      </div>

      <img
        className="absolute top-[97px] left-[84px] w-[1751px] h-[916px]"
        alt="Laboratory visualization"
        src="https://c.animaapp.com/mlffd3qha1Fp36/img/----3-1.png"
      />

      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-[137px] left-[1762px] w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="返回首页"
      >
        <img
          className="w-full h-full"
          alt="Close icon"
          src="https://c.animaapp.com/mlffd3qha1Fp36/img/frame.svg"
        />
      </button>

      <h2 className="absolute top-[216px] left-[161px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-[32px] text-center tracking-[0] leading-[38.5px] whitespace-nowrap">
        实验室简介
      </h2>

      <div className="absolute top-[277px] left-[154px] w-[1646px] h-[273px] flex gap-[22px]">
        {visibleImages.length > 0 ? (
          visibleImages.map((imagePath, index) => (
            <div
              key={imagePath}
              className={`rounded-[12px] overflow-hidden bg-[#0f2531] border border-[#95e2ff33] ${
                visibleImages.length === 1 ? "w-full" : "w-[812px]"
              }`}
            >
              <img
                className="w-full h-full object-cover"
                alt={`${selectedRoom?.roomName ?? "实验室"}图片 ${index + 1}`}
                src={joinBaseUrl(imagePath)}
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full rounded-[12px] border border-dashed border-[#95e2ff55] bg-[#0f2531cc] flex items-center justify-center [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-[#ffffffcc] text-base">
            当前房间还没有图片，请在房间目录中放入图片文件。
          </div>
        )}
      </div>

      <div className="absolute top-[566px] left-[154px] w-[1644px] h-[390px] overflow-y-auto pr-4">
        {selectedRoom ? (
          textSections.map((section) => (
            <section key={section.title} className="mb-7 last:mb-0">
              <h3 className="[font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-6 mb-3">
                {section.title}
              </h3>
              <article className="[font-family:'Source_Han_Sans_SC-Regular',Helvetica] font-normal text-[#ffffffcc] text-sm tracking-[0] leading-[21px] space-y-3">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{paragraph}</p>
                ))}
              </article>
            </section>
          ))
        ) : (
          <div className="h-full rounded-[12px] border border-dashed border-[#95e2ff55] bg-[#0f2531cc] px-8 py-6 [font-family:'Source_Han_Sans_SC-Regular',Helvetica] text-[#ffffffcc] text-base leading-7">
            <p>当前没有扫描到实验室简介数据。</p>
            <p>
              请在 <span className="text-white">{labIntroductionData.dataRootRelativePath}</span>{" "}
              下按“楼层/房间/两张图片+txt”的结构放入内容。
            </p>
          </div>
        )}
      </div>

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
          <span className="top-[11px] left-[80px] w-[120px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-[19.3px] absolute text-center whitespace-nowrap overflow-hidden text-ellipsis">
            {selectedRoom?.roomName ?? "选择房间"}
          </span>
          <select
            id="room-select"
            value={selectedRoom?.roomId ?? ""}
            onChange={(event) => setSelectedRoomId(event.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="选择房间"
            disabled={roomOptions.length === 0}
          >
            {roomOptions.length === 0 ? (
              <option value="">暂无房间</option>
            ) : (
              roomOptions.map((room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.roomName}
                </option>
              ))
            )}
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
          <span className="top-[11px] left-[80px] w-[120px] [font-family:'Source_Han_Sans_SC-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-[19.3px] absolute text-center whitespace-nowrap overflow-hidden text-ellipsis">
            {selectedFloor?.name ?? "选择楼层"}
          </span>
          <select
            id="floor-select"
            value={selectedFloor?.id ?? ""}
            onChange={(event) => setSelectedFloorId(event.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="选择楼层"
            disabled={labIntroductionData.floors.length === 0}
          >
            {labIntroductionData.floors.length === 0 ? (
              <option value="">暂无楼层</option>
            ) : (
              labIntroductionData.floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
};
