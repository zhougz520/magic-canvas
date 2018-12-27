import { Canvas } from '../../Canvas';

import { IKeyArgs } from '../../utils/MouseAndKeyUtil';

export function docKeyUp(canvas: Canvas, e: any): void {
    const args = canvas._mouseAndKeyUtil.keyArgs(e);
    const { key } = args as IKeyArgs;

    if (canvas._isRichEditMode === false) {
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
