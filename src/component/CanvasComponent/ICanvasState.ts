
import { IAnchor } from '../util/AnchorPoint';
import { OrderedSet } from 'immutable';

/**
 * CanvasState的属性
 */
export interface ICanvasState {
    // 当前鼠标图标类型
    anchor: IAnchor | null;
    // 画布当前组件集合
    componentList: OrderedSet<object>;
    // 当前最大的组件序号
    componentIndex: number;
}
