import { Canvas } from '../../Canvas';

export function docMouseUp(canvas: Canvas, e: any): void {
    // 清除选择框
    canvas._drawUtil.clearChoiceBox(e);
    // 清楚移动框
    canvas._drawUtil.clearDragBox();
    // 清楚拉伸框
    canvas._drawUtil.drawStretchBox(e, true);
    // 保持僚机的焦点
    canvas._richEditUtil.keepWingmanFocus();

    switch (canvas._mouseAndKeyUtil.onMouseEventType(e)) {
        case 'component':
            canvas._canvasGlobalParam.componentMouseUp(e);
            break;
        case 'canvas':
            if (canvas._isAddCommentsMode === true) {
                // 添加批注模式
                canvas._canvasGlobalParam.canvasMouseUpAddCommentsMode(e);
            } else if (canvas._isAddImageMagnifierMode === true) {
                // 添加图片放大镜模式
                canvas._canvasGlobalParam.canvasMouseUpAddImageMagnifierMode(e);
            } else {
                canvas._canvasGlobalParam.canvasMouseUp(e);
            }
            break;
        case 'outside':
            canvas._canvasGlobalParam.outsizeMouseUp(e);
            break;
    }
}
