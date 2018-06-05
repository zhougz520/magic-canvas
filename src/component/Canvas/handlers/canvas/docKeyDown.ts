import { Canvas } from '../../Canvas';
import { IKeyArgs } from '../../utils/MouseAndKeyUtil';

export function docKeyDown(canvas: Canvas, e: any): void {
    const args = canvas._mouseAndKeyUtil.keyArgs(e);
    const { key, ctrl, alt, keyCode, target, targetName } = args as IKeyArgs;

    // 非编辑模式：执行组件删除、组件移动等操作
    if (canvas._isRichEditMode === false) {
        // 如果是常规输入框或文本框，则跳出键盘事件，执行默认事件
        if (
            (targetName === 'textarea' && (target as any).className !== 'wingman') ||
            targetName === 'input'
        ) {
            return;
        }

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

        // 如果是输入操作，进入输入状态
        if (!ctrl && !alt) {
            const TECellEditorActivateKeyRange: any = canvas._canvasGlobalParam.getTECellEditorActivateKeyRange();
            for (let i = 0; i < TECellEditorActivateKeyRange.length; i++) {
                const { min, max } = TECellEditorActivateKeyRange[i];
                if (keyCode >= min && keyCode <= max) {
                    // 非编辑模式且有选中组件且焦点在僚机上，进入编辑状态
                    if (canvas._canvasGlobalParam.isSelectedComponent() === true && canvas._isWingmanFocus === true) {
                        canvas._richEditUtil.beginEdit();
                    }
                }
            }
        }
    }
}
