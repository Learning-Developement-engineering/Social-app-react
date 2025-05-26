import { NativeModule, requireNativeModule } from "expo";
import {
  OpenCropperOptions,
  OpenCropperResult,
} from "./ExpoImageCropTool.types";

declare class ExpoImageCropToolModule extends NativeModule {
  openCropperAsync(options: OpenCropperOptions): Promise<OpenCropperResult>;
}

export default requireNativeModule<ExpoImageCropToolModule>(
  "ExpoImageCropTool",
);
