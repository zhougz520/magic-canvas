
import { IComponentList } from './model/types';
import { OrderedSet } from 'immutable';

/**
 * CanvasState的属性
 */
export interface ICanvasState {
    // 鼠标样式
    cursor: string;
    // 画布当前组件集合
    componentList: OrderedSet<IComponentList>;
}
