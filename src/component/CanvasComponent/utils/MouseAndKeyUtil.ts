import { Canvas } from '../canvas';
import * as keycode from 'keycode';

export interface IKeyArgs {
    key: string;
    keyCode: number;
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    target: object;
    targetName: string;
}

export interface IPointerArgs {
    pageX: number;
    pageY: number;
    keyArgs: IKeyArgs | undefined;
}

export class MouseAndKeyUtil {
    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 判断鼠标事件作用的范围，component： 组件， canvas： 画布， outside： 外框
     */
    onMouseEventType = (e: any): string => {
        if (e.target) {
            if (e.target.className.startsWith('canvas') || e.target.className.startsWith('container')) return 'canvas';
            if (this._canvas._canvasUtil.containClassName(e.target, 'canvas')) return 'component';
        }

        return 'outside';
    }

    keyArgs = (evt: any): undefined | IKeyArgs => {
        return evt === undefined ? undefined : {
            key: keycode(evt),
            keyCode: evt.keyCode,
            ctrl: /mac os x/i.test(navigator.userAgent) ? evt.metaKey : evt.ctrlKey,
            shift: evt.shiftKey,
            alt: evt.altKey,
            target: evt.target,
            targetName: (evt.target === undefined || evt.target.tagName === undefined) ?
                undefined : evt.target.tagName.toLowerCase()
        };
    }

    pointerArgs = (e: any): undefined | IPointerArgs => {
        return e === undefined ? undefined : {
            pageX: e.pageX as number,
            pageY: e.pageY as number,
            keyArgs: this.keyArgs(e)
        };
    }

    /**
     * 记录鼠标按下时的坐标
     */
    recordPointStart = (e: any) => {
        const stagePos = this._canvas._positionUtil.getPositionRelativeStage(e.pageX, e.pageY);
        this._canvas._canvasGlobalParam.setPointStart(stagePos.pointX, stagePos.pointY, 'stage');
        const canvasPos = this._canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);
        this._canvas._canvasGlobalParam.setPointStart(canvasPos.x, canvasPos.y, 'canvas');
        this._canvas._canvasGlobalParam.setPointStart(e.pageX, e.pageY, 'dom');
    }
}
