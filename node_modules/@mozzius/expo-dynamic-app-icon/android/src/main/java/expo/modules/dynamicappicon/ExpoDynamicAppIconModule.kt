package expo.modules.dynamicappicon

import android.app.Activity
import android.app.Application
import android.content.Context
import android.content.pm.PackageManager
import android.content.ComponentName
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoDynamicAppIconModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoDynamicAppIcon")

    Function("setAppIcon") { name: String? ->
      try {
        if (name == null) {
          // Reset to default icon
          var currentIcon = if (!SharedObject.icon.isEmpty()) SharedObject.icon else context.packageName + ".MainActivity"

          // Disable the current icon alias if it's set
          pm.setComponentEnabledSetting(
            ComponentName(context.packageName, currentIcon),
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP
          )

          // Enable the default icon alias (MainActivity)
          pm.setComponentEnabledSetting(
            ComponentName(context.packageName, context.packageName + ".MainActivity"),
            PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
            PackageManager.DONT_KILL_APP
          )

          // Reset SharedObject icon to default
          SharedObject.icon = ""

          return@Function "DEFAULT" // Return a string indicating default icon
        } else {
          // Set the new app icon
          var newIcon: String = context.packageName + ".MainActivity" + name
          var currentIcon: String = if (!SharedObject.icon.isEmpty()) SharedObject.icon else context.packageName + ".MainActivity"

          SharedObject.packageName = context.packageName
          SharedObject.pm = pm

          // Enable the new icon alias
          pm.setComponentEnabledSetting(
            ComponentName(context.packageName, newIcon),
            PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
            PackageManager.DONT_KILL_APP
          )

          // Disable the current icon alias
          pm.setComponentEnabledSetting(
            ComponentName(context.packageName, currentIcon),
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP
          )

          // Update the icon in SharedObject
          SharedObject.classesToKill.add(currentIcon)
          SharedObject.icon = newIcon

          return@Function name
        }
      } catch (e: Exception) {
        return@Function false
      }
    }

    Function("getAppIcon") {
      var componentClass: String = currentActivity.componentName.className
      var currentIcon: String = if (!SharedObject.icon.isEmpty()) SharedObject.icon else componentClass
      var currentIconName: String = currentIcon.split("MainActivity")[1]

      return@Function if (currentIconName.isEmpty()) "DEFAULT" else currentIconName
    }
  }

  private val context: Context
    get() = requireNotNull(appContext.reactContext) { "React Application Context is null" }

  private val currentActivity
    get() = requireNotNull(appContext.activityProvider?.currentActivity)

  private val pm
    get() = requireNotNull(currentActivity.packageManager)
}
