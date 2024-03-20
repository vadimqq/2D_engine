import { Spectrograph } from "./Spectrograph";
import { CameraControlPlugin } from "./plugins/CameraControl_Plugin/CameraControlPlugin";
import { MoveToolPlugin } from "./plugins/MoveTool_Plugin/MoveToolPlugin";
import { RectanglePlugin } from "./plugins/Rectangle_Plugin/RectanglePlugin";
import {EllipsePlugin} from "./plugins/Ellipse_Plugin/EllipsePlugin";
import {EllipseShader_Plugin} from "./plugins/EllipseShader_Plugin/EllipseShader_Plugin";

const  spectrograph = new Spectrograph()

spectrograph.pluginManager.addPlugin(MoveToolPlugin)
spectrograph.pluginManager.addPlugin(RectanglePlugin)
spectrograph.pluginManager.addPlugin(EllipsePlugin)
// spectrograph.pluginManager.addPlugin(EllipseShader_Plugin)
spectrograph.pluginManager.addPlugin(CameraControlPlugin)

spectrograph.init()