import { BaseState, IComponent } from '../../BaseComponent';
import { List } from 'immutable';

export type InitType = 'Init' | 'Add' | 'Stack' | 'Paste';

export interface IComponentList {
    cid: string;
    comPath: string;
    baseState: BaseState;
    childData?: any;
    initType: InitType;
}

export type OperationType = 'create' | 'modify' | 'remove';

export interface IOperation {
    operationType: OperationType;
    componentList: List<IComponentList>;
}

export interface IStack {
    timeStamp: number;                          // 时间戳，同一时间记录一个栈
    operationList: List<IOperation>;                                          // 操作：操作类型+组件列表
}

// 鼠标拖拽类型
export enum DragType {
    None = 'none',
    Choice = 'choice',      // 鼠标拉选框
    Shift = 'shift',        // 组件位移框
    Stretch = 'stretch',    // 组件缩放框
    Comments = 'comments',  // 添加批注
    Magnifier = 'magnifier' // 图片放大镜
}

export interface IDragDiv {
    component: IComponent;
    documentDiv: HTMLDivElement;
    hasChange: boolean;
}

export interface IKeyFun {
    [key: string]: any;
    ctrl: any;
}

export interface IBoundary {
    startPoint: IOffset;
    endPoint: IOffset;
}

export interface IOffset {
    x: number;
    y: number;
}

export interface IPointpos {
    pointX: number;
    pointY: number;
}

export interface IPagePos {
    pageX: number;
    pageY: number;
}

export interface IRange {
    top: number;
    left: number;
    width: number;
    height: number;
    comNum: number;
    sumComWidth: number;
    sumComHeight: number;
}

export type AlignType = 'Left' | 'Center' | 'Right' | 'Top' | 'Middle' | 'Bottom' | 'Horizontal' | 'Vertical';

export interface IAddCommentsParam {
    component: IComponent | null;
    startPoint: IOffset | null;
    endPoint: IOffset | null;
}

export interface IAddImageMagnifierParam {
    startPoint: IOffset | null;
    endPoint: IOffset | null;
}
