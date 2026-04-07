declare module "virtual:lab-introduction-data" {
  import type { LabIntroductionManifest } from "./labIntroduction.types";

  const labIntroductionData: LabIntroductionManifest;

  export { labIntroductionData };
  export default labIntroductionData;
}
