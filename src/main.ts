import { Spectrograph } from "./Spectrograph";
import { CameraControlPlugin } from "./plugins/CameraControl_Plugin/CameraControlPlugin";
import { MoveToolPlugin } from "./plugins/MoveTool_Plugin/MoveToolPlugin";
import { RectanglePlugin } from "./plugins/Rectangle_Plugin/RectanglePlugin";

const  spectrograph = new Spectrograph()

spectrograph.pluginManager.addPlugin(MoveToolPlugin)
spectrograph.pluginManager.addPlugin(RectanglePlugin)
spectrograph.pluginManager.addPlugin(CameraControlPlugin)

spectrograph.init()