import { IComponent } from '../../BaseComponent';
import { Map, Set } from 'immutable';
import * as Anchor from '../../util/AnchorPoint';

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
    isDargingStart: () => boolean;
    dragingStart: () => void;
    dragingEnd: () => void;
    getDragType: () => string;
    canvasMouseDown: (e: any) => void;
    canvasMouseUp: (e: any) => void;
    componentMouseDown: (e: any) => void;
    componentMouseUp: (e: any) => void;
    componentAnchorDown: (component: IComponent, anchorPoint: Anchor.IAnchor) => void;
    addSelectedComponent: (cid: string, com: IComponent) => void;
    getSelectedComponents: () => Map<string, IComponent>;
    getSelectedCids: () => Set<string>;
    clearSelectedComponent: () => void;
    moveComponent: (axis: string, distance: number) => void;
    stretchComponent: (left: number, top: number, width: number, height: number) => void;
    componentAnchorMove: (offset: { x: number, y: number }) => void;
    drawDragBox: (componentPosition: any) => void;
    moveDragBox: (offset: { x: number, y: number }) => void;
    clearDragBox: () => void;
}
