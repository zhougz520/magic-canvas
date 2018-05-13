import { Canvas } from '../../Canvas';

export function conMouseMove(canvas: Canvas, e: any): void {
    // 鼠标在画布上移动的时候判断：
    // 当前有没有选中组件，如果有选中组件就把焦点设置到editor
    if (canvas._canvasGlobalParam.isSelectedComponent() === true && canvas.editor) {
        canvas.editor.setFocus();
    }
}
