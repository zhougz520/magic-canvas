import { Canvas } from '../../canvas';

import { IKeyArgs } from '../../utils/MouseAndKeyUtil';

export function conKeyUp(canvas: Canvas, e: any): void {
    const args = canvas._mouseAndKeyUtil.keyArgs(e);
    const { key, ctrl } = args as IKeyArgs;

    if (canvas._canvasGlobalParam.getIsRichEditMode() === false) {
        if (!ctrl && canvas._canvasGlobalParam.isMultiselect()) {
            canvas._canvasGlobalParam.ctrlPress = false;
        }

        switch (key) {
            case 'up':
            case 'down':
            case 'right':
            case 'left':
                canvas._canvasGlobalParam.clearTimer();
                e.preventDefault();
                break;
        }
    }
}
