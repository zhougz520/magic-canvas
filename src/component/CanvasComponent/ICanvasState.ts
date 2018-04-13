
import { IAnchor } from '../util/AnchorPoint';
import { Set } from 'immutable';

/**
 * CanvasState的属性
 */
export interface ICanvasState {
    // 当前鼠标图标类型
    anchor: IAnchor | null;
    // 画布当前组件集合
    componentList: Set<object>;
    // 当前最大的组件序号
    componentIndex: number;
    // 画布初始的大小
    canvasSize: { width: number, height: number };
}
