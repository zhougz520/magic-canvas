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

export interface ICanvasCommand {
    isMultiselect: () => boolean;
    isMouseDown: () => boolean;
    getPointerStart: (type: string) => IOffset;
    isDargging: () => boolean;
    darggingStart: () => void;
    getDragType: () => string;
    outsideMouseDown: (e: any) => void;
    outsizeMouseUp: (e: any) => void;
    canvasMouseDown: (e: any) => void;
    canvasMouseUp: (e: any) => void;
    componentMouseDown: (e: any) => void;
    componentMouseUp: (e: any) => void;
    setPointStart: (x: number, y: number, type: string) => void;
    setUndoStack: () => void;
    anchorCalc: (currentX: number, currentY: number) => Anchor.IAnchor | null;
    getCurrentAnchor: () => Anchor.IAnchor | null;
    anchorMouseDown: (e: any, anchor: Anchor.IAnchor) => void;
    anchorMouseUp: (e: any) => void;
    addSelectedComponent: (cid: string, com: IComponent, multiselect?: boolean) => void;
    getSelectedComponents: () => Map<string, IComponent>;
    getSelectedCids: () => Set<string>;
    clearSelectedComponent: () => void;
    moveComponent: (axis: string, distance: number) => void;
    stretchComponent: (x: number, y: number, w: number, h: number,
                       anchorKey: string, end: boolean, callBack: any) => void;
    anchorMove: (offset: IOffset, end: boolean, callBack: any) => void;
    drawDragBox: (componentPosition: any) => void;
    moveDragBox: (offset: IOffset, stageBoundary: IBoundary | undefined, setStageScroll: any) => void;
    clearDragBox: (offset: any) => void;
    startScroll: (scrollOffset: IOffset, setStageScroll: any) => void;
    stopScroll: () => void;
    getIsRichEditMode: () => boolean;
    setIsRichEditMode: (mode: boolean) => void;
    getTECellEditorActivateKeyRange: () => any;
}
