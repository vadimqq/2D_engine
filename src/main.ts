import { Spectrograph } from "./Spectrograph";
import { BaseControls_Plugin } from "./plugins/BaseControls_Plugin";
import { CameraControlPlugin } from "./plugins/CameraControl_Plugin/CameraControlPlugin";
import { EllipsePlugin } from "./plugins/Ellipse_Plugin/EllipsePlugin";
import { MoveToolPlugin } from "./plugins/MoveTool_Plugin/MoveToolPlugin";
import { PixelGridPlugin } from "./plugins/PixelGrid_Plugin/PixelGridPlugin";
import { RectanglePlugin } from "./plugins/Rectangle_Plugin/RectanglePlugin";

const  spectrograph = new Spectrograph()
spectrograph.pluginManager.addPlugin(BaseControls_Plugin)
spectrograph.pluginManager.addPlugin(MoveToolPlugin)
spectrograph.pluginManager.addPlugin(RectanglePlugin)
spectrograph.pluginManager.addPlugin(EllipsePlugin)
spectrograph.pluginManager.addPlugin(CameraControlPlugin)
spectrograph.pluginManager.addPlugin(PixelGridPlugin)
spectrograph.init()