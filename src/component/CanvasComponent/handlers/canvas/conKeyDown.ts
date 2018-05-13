import { Canvas } from '../../canvas';
import { IKeyArgs } from '../../utils/MouseAndKeyUtil';

export function conKeyDown(canvas: Canvas, e: any): void {
    const args = canvas._mouseAndKeyUtil.keyArgs(e);
    const { key, ctrl, alt, keyCode } = args as IKeyArgs;

    // 非编辑模式：执行组件删除、组件移动等操作
    if (canvas._canvasGlobalParam.getIsRichEditMode() === false) {
        if (ctrl) {
            canvas._canvasGlobalParam.ctrlPress = true;
        }

        switch (key) {
            case 'up':
                canvas._canvasGlobalParam.clearTimer();
                canvas._canvasGlobalParam.moveComponent('y', -1);
                canvas._canvasGlobalParam.timer = setInterval(() => { canvas._canvasGlobalParam.moveComponent('y', -1); }, 100);
                e.preventDefault();
                break;
            case 'down':
                canvas._canvasGlobalParam.clearTimer();
                canvas._canvasGlobalParam.moveComponent('y', 1);
                canvas._canvasGlobalParam.timer = setInterval(() => { canvas._canvasGlobalParam.moveComponent('y', 1); }, 100);
                e.preventDefault();
                break;
            case 'right':
                canvas._canvasGlobalParam.clearTimer();
                canvas._canvasGlobalParam.moveComponent('x', 1);
                canvas._canvasGlobalParam.timer = setInterval(() => { canvas._canvasGlobalParam.moveComponent('x', 1); }, 100);
                e.preventDefault();
                break;
            case 'left':
                canvas._canvasGlobalParam.clearTimer();
                canvas._canvasGlobalParam.moveComponent('x', -1);
                canvas._canvasGlobalParam.timer = setInterval(() => { canvas._canvasGlobalParam.moveComponent('x', -1); }, 100);
                e.preventDefault();
                break;
            case 'delete':
                canvas._componentsUtil.deleteCanvasComponent(canvas._canvasGlobalParam.getSelectedCids());
                e.preventDefault();
                break;
        }
    }

    // 如果是输入操作，进入输入状态
    if (!ctrl && !alt) {
        const TECellEditorActivateKeyRange: any = canvas._canvasGlobalParam.getTECellEditorActivateKeyRange();
        for (let i = 0; i < TECellEditorActivateKeyRange.length; i++) {
            const { min, max } = TECellEditorActivateKeyRange[i];
            if (keyCode >= min && keyCode <= max) {
                // 非编辑模式且有选中组件，进入编辑状态
                if (canvas._canvasGlobalParam.getIsRichEditMode() === false && canvas._canvasGlobalParam.isSelectedComponent() === true) {
                    canvas._canvasGlobalParam.setIsRichEditMode(true);
                    canvas._richEditUtil.beginEdit();
                }
            }
        }
    }
}
