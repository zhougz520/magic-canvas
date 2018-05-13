import { Canvas } from '../Canvas';
import { IOffset, IPointpos, IPagePos } from '../model/types';

export class PositionUtil {
    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 将document的坐标转换为相对Canvas的坐标
     */
    getPositionRelativeCanvas = (pageX: number, pageY: number): IOffset => {
        const pos = this._canvas.props.componentPosition;
        const scroll = this._canvas.props.getStageScroll();

        return {
            x: pageX - pos.stageOffset.left - pos.canvasOffset.left + scroll.scrollLeft,
            y: pageY - pos.stageOffset.top - pos.canvasOffset.top + scroll.scrollTop
        };
    }

    /**
     * 将document的坐标转换为相对Stage的坐标
     */
    getPositionRelativeStage = (pageX: number, pageY: number): IPointpos => {
        const pos = this._canvas.props.componentPosition;
        const scroll = this._canvas.props.getStageScroll();

        return {
            pointX: pageX - pos.stageOffset.left + scroll.scrollLeft,
            pointY: pageY - pos.stageOffset.top + scroll.scrollTop
        };
    }

    /**
     * 将canvas的坐标转换为相对document的坐标
     */
    getPositionRelativeDocument = (pointX: number, pointY: number): IPagePos => {
        const pos = this._canvas.props.componentPosition;
        const scroll = this._canvas.props.getStageScroll();

        return {
            pageX: pointX + pos.stageOffset.left + pos.canvasOffset.left - scroll.scrollLeft,
            pageY: pointY + pos.stageOffset.top + pos.canvasOffset.top - scroll.scrollTop
        };
    }
}
