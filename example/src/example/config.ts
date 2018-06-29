import { IConfig } from '../../../src';

// config的值为不可修改值，尽量用Record
export const config: IConfig = {
    highPerformance: true,
    componentPosition: {
        stageOffset: { top: 80, left: 238, right: 250, bottom: 35 },
        canvasOffset: { top: 0, left: 0, right: 0, bottom: 0 },
        borderOffset: { border: 1 }
    }
};
