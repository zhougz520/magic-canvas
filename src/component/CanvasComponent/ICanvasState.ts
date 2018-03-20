
import { Set } from 'immutable';

/**
 * CanvasState的属性
 */
export interface ICanvasState {
    // 已选中的组件名称集合
    selectedCids: Set<string>;
}
