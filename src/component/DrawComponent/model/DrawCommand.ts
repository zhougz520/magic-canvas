import { IDrawCommand } from './types';

export const DrawCommand: IDrawCommand = {
    initDraw() {
        // TODO 无用代码？
    },
    bind(ins: any) {
        for (const key in this) {
            if (key !== 'bind') {
                ins[key] = this[key].bind(ins);
            }
        }
    }
};
