import { ICanvasComponent } from '../inedx';

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
    [key: string]: any;
    canvas: ICanvasComponent | null;
    initCanvas: () => void;
    bind: (ins: any) => void;
    isMultiselect: () => boolean;
}
