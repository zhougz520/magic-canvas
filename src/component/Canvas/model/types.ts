import { BaseState, IComponent } from '../../BaseComponent';

export interface IComponentList {
    cid: string;
    comPath: string;
    baseState: BaseState;
    childData?: any;
}

// 鼠标拖拽类型
export enum DragType {
    None = 'none',
    Choice = 'choice',  // 鼠标拉选框
    Shift = 'shift',    //  组件位移框
    Stretch = 'stretch' // 组件缩放框
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
