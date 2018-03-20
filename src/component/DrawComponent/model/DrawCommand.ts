import { IDrawCommand } from './types';

export const DrawCommand: IDrawCommand = {
    initDraw() {
        // tslint:disable-next-line:no-console
        console.log('init draw');
    },
    bind(ins: any) {
        for (const key in this) {
            if (key !== 'bind') {
                ins[key] = this[key].bind(ins);
            }
        }
    }
};
