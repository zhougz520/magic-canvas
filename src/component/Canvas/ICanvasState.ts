
import { IComponentList } from './model/types';
import { IAnchor } from '../util';
import { OrderedSet } from 'immutable';

/**
 * CanvasState的属性
 */
export interface ICanvasState {
    // 当前鼠标图标类型
    anchor: IAnchor | null;
    // 画布当前组件集合
    componentList: OrderedSet<IComponentList>;
}
