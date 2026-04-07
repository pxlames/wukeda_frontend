export interface LabIntroductionRoomData {
  floorId: string;
  floorName: string;
  roomId: string;
  roomName: string;
  relativePath: string;
  primaryImage: string | null;
  secondaryImage: string | null;
  textContent: string;
  textFileName: string | null;
}

export interface LabIntroductionFloorData {
  id: string;
  name: string;
  rooms: LabIntroductionRoomData[];
}

export interface LabIntroductionManifest {
  dataRootRelativePath: string;
  floors: LabIntroductionFloorData[];
}
