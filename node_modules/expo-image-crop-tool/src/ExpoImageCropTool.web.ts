import { registerWebModule, NativeModule } from "expo";

import {
  OpenCropperOptions,
  OpenCropperResult,
} from "./ExpoImageCropTool.types";

class ExpoImageCropToolModule extends NativeModule {
  async openCropperAsync(_: OpenCropperOptions): Promise<OpenCropperResult> {
    throw new Error("expo-image-crop-tool is not available on web");
  }
}

export default registerWebModule(
  ExpoImageCropToolModule,
  "ExpoImageCropperModule",
);
