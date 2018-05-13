import { Canvas } from '../../Canvas';

export function docMouseLeave(canvas: Canvas, e: any): void {
    canvas._drawUtil.clearChoiceBox(e);
    canvas._drawUtil.clearDragBox();
    canvas._drawUtil.drawStretchBox(e, true);
    canvas._canvasGlobalParam.canvasMouseUp(e);
}
