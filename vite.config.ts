import { promises as fs } from "node:fs";
import path from "node:path";
import { screenGraphPlugin } from "@animaapp/vite-plugin-screen-graph";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig, loadEnv, normalizePath } from "vite";
import labIntroductionConfig from "./src/config/labIntroduction.config";

const LAB_INTRODUCTION_VIRTUAL_MODULE_ID = "virtual:lab-introduction-data";
const LAB_INTRODUCTION_VIRTUAL_MODULE_RESOLVED_ID = `\0${LAB_INTRODUCTION_VIRTUAL_MODULE_ID}`;
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const TEXT_EXTENSIONS = new Set([".txt"]);

const normalizeRelativePath = (value: string): string =>
  value.replace(/\\/g, "/").replace(/^\.?\/*/, "").replace(/\/+$/, "");

const compareByName = (left: { name: string }, right: { name: string }): number =>
  left.name.localeCompare(right.name, "zh-Hans-CN", {
    numeric: true,
    sensitivity: "base",
  });

const isDirectory = async (targetPath: string): Promise<boolean> => {
  try {
    return (await fs.stat(targetPath)).isDirectory();
  } catch {
    return false;
  }
};

const fileExists = async (targetPath: string): Promise<boolean> => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const readDirectorySafely = async (
  directoryPath: string,
): Promise<import("node:fs").Dirent[]> => {
  try {
    return await fs.readdir(directoryPath, { withFileTypes: true });
  } catch {
    return [];
  }
};

const toPublicAssetPath = (
  dataRootRelativePath: string,
  relativeFilePath: string,
): string =>
  normalizeRelativePath(path.posix.join(dataRootRelativePath, relativeFilePath));

const getImageBaseName = (fileName: string): string =>
  path.parse(fileName).name.trim().toLowerCase();

const resolvePublicDirectory = (root: string, publicDir: string): string =>
  path.isAbsolute(publicDir) ? publicDir : path.resolve(root, publicDir);

const resolveLabIntroductionDataDirectory = (
  root: string,
  publicDir: string,
): string =>
  path.resolve(
    resolvePublicDirectory(root, publicDir),
    normalizeRelativePath(labIntroductionConfig.dataRootRelativePath),
  );

const createPlaceholderText = (
  floorName: string,
  roomName: string,
): string => `# ${roomName} 实验室简介

这是根据配置自动初始化的说明文件。

当前楼层：${floorName}
当前房间：${roomName}

## 使用方式

1. 可以在本房间目录中放入两张真实图片，页面会优先显示房间内图片。
   图片文件名请使用 1 和 2，例如 1.png、2.jpg。
2. 直接编辑这个 txt 文件，填入实验室简介内容。
3. 如果房间目录里没有图片，页面会自动使用实验室简介原页面的默认两张图片。
4. 如需新增房间，请修改 labIntroductionConfig 中的楼层和房间配置，系统会自动补齐目录结构。
`;

const ensureRoomAssets = async (
  roomDirectory: string,
  floorName: string,
  roomName: string,
): Promise<void> => {
  await fs.mkdir(roomDirectory, { recursive: true });

  const textFileName = labIntroductionConfig.defaultRoomAssets.textFileName;
  const textFilePath = path.join(roomDirectory, textFileName);

  if (!(await fileExists(textFilePath))) {
    await fs.writeFile(textFilePath, createPlaceholderText(floorName, roomName), "utf-8");
  }
};

const initializeLabIntroductionDataDirectory = async (
  root: string,
  publicDir: string,
): Promise<void> => {
  if (!labIntroductionConfig.initializeMissingFiles) {
    return;
  }

  const dataRootAbsolutePath = resolveLabIntroductionDataDirectory(root, publicDir);
  await fs.mkdir(dataRootAbsolutePath, { recursive: true });

  await Promise.all(
    labIntroductionConfig.floors.map(async (floor) => {
      const floorDirectory = path.join(dataRootAbsolutePath, floor.id);
      await fs.mkdir(floorDirectory, { recursive: true });

      await Promise.all(
        floor.rooms.map((room) =>
          ensureRoomAssets(
            path.join(floorDirectory, room.id),
            floor.name ?? floor.id,
            room.name ?? room.id,
          ),
        ),
      );
    }),
  );
};

const buildLabIntroductionManifest = async (
  root: string,
  publicDir: string,
) => {
  await initializeLabIntroductionDataDirectory(root, publicDir);

  const dataRootRelativePath = normalizeRelativePath(
    labIntroductionConfig.dataRootRelativePath,
  );
  const dataRootAbsolutePath = resolveLabIntroductionDataDirectory(root, publicDir);
  const floors = await Promise.all(
    labIntroductionConfig.floors.map(async (floor) => {
      const floorPath = path.join(dataRootAbsolutePath, floor.id);

      const rooms = await Promise.all(
        floor.rooms.map(async (room) => {
          const roomPath = path.join(floorPath, room.id);
          const fileEntries = (await readDirectorySafely(roomPath))
            .filter((entry) => entry.isFile())
            .sort(compareByName);

          const imageFiles = fileEntries.filter((fileEntry) =>
            IMAGE_EXTENSIONS.has(path.extname(fileEntry.name).toLowerCase()),
          );
          const leftImageFile = imageFiles.find(
            (fileEntry) =>
              getImageBaseName(fileEntry.name) ===
              labIntroductionConfig.roomImageBaseNames.left,
          );
          const rightImageFile = imageFiles.find(
            (fileEntry) =>
              getImageBaseName(fileEntry.name) ===
              labIntroductionConfig.roomImageBaseNames.right,
          );
          const textFile = fileEntries.find((fileEntry) =>
            TEXT_EXTENSIONS.has(path.extname(fileEntry.name).toLowerCase()),
          );

          const textContent = textFile
            ? await fs.readFile(path.join(roomPath, textFile.name), "utf-8")
            : "";
          const relativeRoomPath = normalizePath(path.relative(dataRootAbsolutePath, roomPath));

          return {
            floorId: floor.id,
            floorName: floor.name ?? floor.id,
            roomId: room.id,
            roomName: room.name ?? room.id,
            relativePath: relativeRoomPath,
            primaryImage: leftImageFile
              ? toPublicAssetPath(
                  dataRootRelativePath,
                  normalizePath(path.join(relativeRoomPath, leftImageFile.name)),
                )
              : null,
            secondaryImage: rightImageFile
              ? toPublicAssetPath(
                  dataRootRelativePath,
                  normalizePath(path.join(relativeRoomPath, rightImageFile.name)),
                )
              : null,
            textContent,
            textFileName: textFile?.name ?? null,
          };
        }),
      );

      return {
        id: floor.id,
        name: floor.name ?? floor.id,
        rooms,
      };
    }),
  );

  return {
    dataRootRelativePath,
    floors,
  };
};

const labIntroductionDataPlugin = () => {
  let rootDirectory = process.cwd();
  let publicDirectory = "public";

  return {
    name: "lab-introduction-data-plugin",
    configResolved(config) {
      rootDirectory = config.root;
      publicDirectory = config.publicDir;
    },
    async resolveId(id) {
      if (id === LAB_INTRODUCTION_VIRTUAL_MODULE_ID) {
        return LAB_INTRODUCTION_VIRTUAL_MODULE_RESOLVED_ID;
      }
      return null;
    },
    async load(id) {
      if (id !== LAB_INTRODUCTION_VIRTUAL_MODULE_RESOLVED_ID) {
        return null;
      }

      const manifest = await buildLabIntroductionManifest(rootDirectory, publicDirectory);

      return [
        `const labIntroductionData = ${JSON.stringify(manifest, null, 2)};`,
        "export { labIntroductionData };",
        "export default labIntroductionData;",
      ].join("\n");
    },
    async configureServer(server) {
      const dataDirectory = resolveLabIntroductionDataDirectory(
        rootDirectory,
        publicDirectory,
      );

      if (await isDirectory(dataDirectory)) {
        server.watcher.add(dataDirectory);
      }
    },
    async handleHotUpdate(context) {
      const dataDirectory = resolveLabIntroductionDataDirectory(
        rootDirectory,
        publicDirectory,
      );
      const normalizedFilePath = normalizePath(context.file);
      const normalizedDataDirectory = normalizePath(dataDirectory);

      if (
        normalizedFilePath === normalizedDataDirectory ||
        normalizedFilePath.startsWith(`${normalizedDataDirectory}/`)
      ) {
        const module = context.server.moduleGraph.getModuleById(
          LAB_INTRODUCTION_VIRTUAL_MODULE_RESOLVED_ID,
        );

        if (module) {
          context.server.moduleGraph.invalidateModule(module);
          return [module];
        }
      }

      return undefined;
    },
  };
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_PROXY_TARGET?.trim() || "http://127.0.0.1:8080";

  return {
    plugins: [react(), labIntroductionDataPlugin(), isDev && screenGraphPlugin()],
    publicDir: "./static",
    base: "./",
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
    server: {
      // 仅开发时启用代理；目标由 VITE_PROXY_TARGET 控制（.env.development / .env.production）
      ...(isDev && {
        proxy: {
          "/api": {
            target: proxyTarget,
            changeOrigin: true,
            secure: false,
            timeout: 30000,
            configure: (proxy) => {
              proxy.on("error", (err, _req, res) => {
                console.warn("[vite proxy] 后端未启动或连接被重置，请先运行后端: cd wukeda-backend && make run");
              });
            },
          },
        },
      }),
    },
  };
});
