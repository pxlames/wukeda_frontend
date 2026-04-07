export interface LabIntroductionRoomConfig {
  id: string;
  name?: string;
}

export interface LabIntroductionFloorConfig {
  id: string;
  name?: string;
  rooms: LabIntroductionRoomConfig[];
}

const fallbackImageLeft =
  import.meta.env.VITE_LAB_INTRO_FALLBACK_IMAGE_LEFT?.trim() ||
  "https://c.animaapp.com/mlffd3qha1Fp36/img/rectangle-2346.png";

const fallbackImageRight =
  import.meta.env.VITE_LAB_INTRO_FALLBACK_IMAGE_RIGHT?.trim() ||
  "https://c.animaapp.com/mlffd3qha1Fp36/img/rectangle-2347.png";

export const labIntroductionConfig = {
  // 相对 Vite publicDir（当前项目为 ./static）的目录
  dataRootRelativePath: "lab-introduction-data",

  // 每个房间默认展示的图片数量上限
  maxImagesPerRoom: 2,

  // 房间目录中没有图片时，回退到实验室简介原页面的两张默认图片
  fallbackImageUrls: [
    fallbackImageLeft,
    fallbackImageRight,
  ],

  // 房间图片命名规则：1 在左边，2 在右边，扩展名可为 png/jpg/jpeg/webp/gif/svg
  roomImageBaseNames: {
    left: "1",
    right: "2",
  },

  // 缺失目录或文件时，开发/构建阶段自动初始化
  initializeMissingFiles: true,

  // 初始化骨架时使用的默认文本文件名
  defaultRoomAssets: {
    textFileName: "intro.txt",
  },

  // 楼层与房间配置
  floors: [
    {
      id: "1F",
      name: "1F",
      rooms: [],
    },
    {
      id: "2F",
      name: "2F",
      rooms: [
        { id: "2F-14-1", name: "2F-14-1" },
        { id: "2F-15-2", name: "2F-15-2" },
        { id: "2F-16-3", name: "2F-16-3" },
        { id: "2F-17-8", name: "2F-17-8" },
        { id: "2F-201室", name: "2F-201室" },
        { id: "2F-202室", name: "2F-202室" },
        { id: "2F-203室", name: "2F-203室" },
        { id: "2F-204室", name: "2F-204室" },
        { id: "2F-205室", name: "2F-205室" },
        { id: "2F-206室", name: "2F-206室" },
        { id: "2F-207室", name: "2F-207室" },
        { id: "2F-208室", name: "2F-208室" },
        { id: "2F-209室", name: "2F-209室" },
        { id: "2F-强弱电间", name: "2F-强弱电间" },
        { id: "2F-水井", name: "2F-水井" },
      ],
    },
    {
      id: "3F",
      name: "3F",
      rooms: [
        { id: "3F-03-33", name: "3F-03-33" },
        { id: "3F-05-35", name: "3F-05-35" },
        { id: "3F-07-13", name: "3F-07-13" },
        { id: "3F-08-83", name: "3F-08-83" },
        { id: "3F-301室", name: "3F-301室" },
        { id: "3F-302室", name: "3F-302室" },
        { id: "3F-303室", name: "3F-303室" },
        { id: "3F-304室", name: "3F-304室" },
        { id: "3F-305室", name: "3F-305室" },
        { id: "3F-强弱电间", name: "3F-强弱电间" },
      ],
    },
    {
      id: "4F",
      name: "4F",
      rooms: [
        { id: "4F-401室", name: "4F-401室" },
        { id: "4F-402室", name: "4F-402室" },
        { id: "4F-403室", name: "4F-403室" },
        { id: "4F-404室", name: "4F-404室" },
        { id: "4F-405室", name: "4F-405室" },
        { id: "4F-406室", name: "4F-406室" },
        { id: "4F-强弱电间", name: "4F-强弱电间" },
        { id: "4F-水井", name: "4F-水井" },
      ],
    },
    {
      id: "5F",
      name: "5F",
      rooms: [
        { id: "5F-501室", name: "5F-501室" },
        { id: "5F-502室", name: "5F-502室" },
        { id: "5F-503室", name: "5F-503室" },
        { id: "5F-504室", name: "5F-504室" },
        { id: "5F-505室", name: "5F-505室" },
        { id: "5F-506室", name: "5F-506室" },
        { id: "5F-强弱电间", name: "5F-强弱电间" },
        { id: "5F-水井", name: "5F-水井" },
      ],
    },
    {
      id: "RF",
      name: "RF",
      rooms: [],
    },
  ] satisfies LabIntroductionFloorConfig[],
} as const;

export default labIntroductionConfig;
