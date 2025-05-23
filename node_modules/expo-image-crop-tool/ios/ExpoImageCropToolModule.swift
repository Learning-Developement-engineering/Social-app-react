import ExpoModulesCore

public class ExpoImageCropToolModule: Module {
  var ic: Cropper?

  public func definition() -> ModuleDefinition {
    Name("ExpoImageCropTool")

    AsyncFunction("openCropperAsync") { (options: OpenCropperOptions, promise: Promise) throws in
      DispatchQueue.main.async {
        do {
          self.ic = try Cropper(
            options: options,
            onCrop: { res in
              promise.resolve(res)
            },
            onError: { error in
              promise.reject(error)
            }
          )
          try self.ic?.open()
        } catch {
          promise.reject(error)
        }
      }
    }
  }
}
