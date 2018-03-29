// 画布的偏移量
export interface ICompos {
    stageOffset: { top: number, left: number, right: number, bottom: number };  // stage相对body的偏移量
    canvasOffset: { top: number, left: number, right: number, bottom: number };  // canvas相对stage的偏移量
}

export interface IConfig {
    componentPosition: ICompos; // 画布的初始偏移量
}

// config的值为不可修改值，尽量用Record
export const config: IConfig = {
    componentPosition: {
        stageOffset: { top: 80, left: 184, right: 250, bottom: 35 },
        canvasOffset: { top: 48, left: 48, right: 48, bottom: 32 }
    }
};
