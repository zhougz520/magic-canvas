import { Canvas } from '../../canvas';

export function docMouseUp(canvas: Canvas, e: any): void {
    // 清除选择框
    canvas._drawUtil.clearChoiceBox(e);
    // 清楚移动框
    canvas._drawUtil.clearDragBox();
    // 清楚拉伸框
    canvas._drawUtil.drawStretchBox(e, true);

    switch (canvas._mouseAndKeyUtil.onMouseEventType(e)) {
        case 'component':
            canvas._canvasGlobalParam.componentMouseUp(e);
            break;
        case 'canvas':
            canvas._canvasGlobalParam.canvasMouseUp(e);
            break;
        case 'outside':
            canvas._canvasGlobalParam.outsizeMouseUp(e);
            break;
    }
}
