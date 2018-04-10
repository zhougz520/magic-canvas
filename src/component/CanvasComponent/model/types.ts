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

export interface ICanvasCommand {
    isMultiselect: () => boolean;
    isMouseDown: () => boolean;
    getPointerStart: () => IOffset;
    isDargging: () => boolean;
    darggingStart: () => void;
    getDragType: () => string;
    canvasMouseDown: (e: any) => void;
    canvasMouseUp: (e: any) => void;
    componentMouseDown: (e: any) => void;
    componentMouseUp: (e: any) => void;
    anchorCalc: (currentX: number, currentY: number) => Anchor.IAnchor | null;
    anchorMouseDown: (e: any, anchor: Anchor.IAnchor) => void;
    anchorMouseUp: (e: any) => void;
    addSelectedComponent: (cid: string, com: IComponent, multiselect?: boolean) => void;
    getSelectedComponents: () => Map<string, IComponent>;
    getSelectedCids: () => Set<string>;
    clearSelectedComponent: () => void;
    moveComponent: (axis: string, distance: number) => void;
    stretchComponent: (left: number, top: number, width: number, height: number) => void;
    anchorMove: (offset: IOffset) => void;
    drawDragBox: (componentPosition: any) => void;
    moveDragBox: (offset: IOffset, stageBoundary: IBoundary | undefined, setStageScroll: any) => void;
    clearDragBox: (offset: any) => void;
    startScroll: (scrollOffset: IOffset, setStageScroll: any) => void;
    stopScroll: () => void;
    getIsEditMode: () => boolean;
    setIsEditMode: (isEditMode: boolean) => void;
    getTECellEditorActivateKeyRange: () => any;
}
