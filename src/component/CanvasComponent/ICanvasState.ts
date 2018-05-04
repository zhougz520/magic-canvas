
import { IAnchor } from '../util/AnchorPoint';
import { OrderedSet, List, Stack } from 'immutable';

export type OperationType = 'create' | 'modify' | 'remove';

export interface IComponentList {
    cid: string;
    comData: any;
}

export interface IStack {
    operationType: OperationType;
    componentList: List<IComponentList>;
}

/**
 * CanvasState的属性
 */
export interface ICanvasState {
    // 当前鼠标图标类型
    anchor: IAnchor | null;
    // 画布当前组件集合
    componentList: OrderedSet<any>;
    // 当前最大的组件序号
    componentIndex: number;
    // 画布撤销栈
    undoStack: Stack<IStack>;
    // 画布重做栈
    redoStack: Stack<IStack>;
}
