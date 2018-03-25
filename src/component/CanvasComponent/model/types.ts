import { IComponent } from '../../BaseComponent';
import { Map, Set } from 'immutable';
import * as Anchor from '../../util/AnchorPoint';

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

export interface IKeyArgs {
    key: string;
    keyCode: number;
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    target: object;
    targetName: string;
}

export interface IKeyFun {
    [key: string]: any;
    addKeyEvent: () => void;
    handleKeyDown: (e: any) => void;
    handleKeyUp: (e: any) => void;
    ctrl: any;
}

export interface IPointerArgs {
    pageX: number;
    pageY: number;
    keyArgs: IKeyArgs | undefined;
}

export interface ICanvasCommand {
    initCanvas: () => void;
    // bind: (ins: any) => void;
    isMultiselect: () => boolean;
    isMouseDown: () => boolean;
    getPointerStart: () => { x: number, y: number };
    isDargging: () => boolean;
    getDragType: () => string;
    canvasMouseDown: (e: any) => void;
    canvasMouseUp: (e: any) => void;
    componentMouseDown: (e: any) => void;
    componentMouseUp: (e: any) => void;
    anchorCalc: (currentX: number, currentY: number) => Anchor.IAnchor | null;
    anchorMouseDown: (e: any, anchor: Anchor.IAnchor) => void;
    anchorMouseUp: (e: any) => void;
    addSelectedComponent: (cid: string, com: IComponent) => void;
    getSelectedComponents: () => Map<string, IComponent>;
    getSelectedCids: () => Set<string>;
    clearSelectedComponent: () => void;
    moveComponent: (axis: string, distance: number) => void;
    stretchComponent: (left: number, top: number, width: number, height: number) => void;
    anchorMove: (offset: { x: number, y: number }) => void;
    drawDragBox: (componentPosition: any) => void;
    moveDragBox: (offset: { x: number, y: number }) => void;
    clearDragBox: () => void;
}
