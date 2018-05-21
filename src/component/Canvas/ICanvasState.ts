
import { IComponentList } from './model/types';
import { IAnchor } from '../util';
import { OrderedSet, List, Stack } from 'immutable';

export type OperationType = 'create' | 'modify' | 'remove';

// TODO 后面删除
export interface ISComponentList {
    cid: string;
    comData: any;
}

export interface IStack {
    operationType: OperationType;
    componentList: List<ISComponentList>;
}

/**
 * CanvasState的属性
 */
export interface ICanvasState {
    // 当前鼠标图标类型
    anchor: IAnchor | null;
    // 画布当前组件集合
    componentList: OrderedSet<IComponentList>;
    // 画布撤销栈
    undoStack: Stack<IStack>;
    // 画布重做栈
    redoStack: Stack<IStack>;
}
