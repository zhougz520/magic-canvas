
import { IAnchor } from '../util/AnchorPoint';

/**
 * CanvasState的属性
 */
export interface ICanvasState {
    // 当前鼠标图标类型
    anchor: IAnchor | null;
    // canvas默认的宽高百分百
    canvasSize: {width: number, height: number};
}
