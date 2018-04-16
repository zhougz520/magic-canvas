// 画布的偏移量
export interface ICompos {
    stageOffset: { top: number, left: number, right: number, bottom: number };  // stage相对body的偏移量
    canvasOffset: { top: number, left: number, right: number, bottom: number };  // canvas相对stage的偏移量
    borderOffset: { border: number };   // antd全局样式box-sizing导致的组件实际width和height会缩小2*border
}

export interface IConfig {
    highPerformance: boolean;
    componentPosition: ICompos; // 画布的初始偏移量
    canvasSize: { width: number, height: number };  // 画布初始的宽高百分比
}

// config的值为不可修改值，尽量用Record
export const config: IConfig = {
    highPerformance: true,
    componentPosition: {
        stageOffset: { top: 80, left: 184, right: 250, bottom: 35 },
        canvasOffset: { top: 0, left: 0, right: 0, bottom: 0 },
        borderOffset: { border: 1 }
    },
    canvasSize: { width: 2560, height: 1440 }
};
