import { Canvas } from '../../canvas';
import { DragType } from '../../model/types';

export function docMouseMove(canvas: Canvas, e: any): void {
    if (canvas._canvasGlobalParam.isMouseDown()) {  // 鼠标按下才开始计算
        switch (canvas._canvasGlobalParam.getDragType()) {
            case DragType.None: return;
            case DragType.Choice: return canvas._drawUtil.drawChoiceBox(e);
            case DragType.Stretch: return canvas._drawUtil.drawStretchBox(e);
            case DragType.Shift: return canvas._drawUtil.moveDragBox(e);
        }
    } else {    // 鼠标未按下时，计算鼠标位置
        const relative = canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);
        const anchor = canvas._canvasGlobalParam.anchorCalc(relative.x, relative.y);
        canvas.setState({ anchor });
    }
}
