// 画布的偏移量
export interface ICompos {
    stageOffset: { top: number, left: number, right: number, bottom: number };  // stage相对body的偏移量
    canvasOffset: { top: number, left: number, right: number, bottom: number };  // canvas相对stage的偏移量
    borderOffset: { border: number };   // antd全局样式box-sizing导致的组件实际width和height会缩小2*border
}

export interface IConfig {
    componentPosition: ICompos; // 画布的初始偏移量
}

// config的值为不可修改值，尽量用Record
export const config: IConfig = {
    componentPosition: {
        stageOffset: { top: 80, left: 184, right: 250, bottom: 35 },
        canvasOffset: { top: 32, left: 32, right: 32, bottom: 32 },
        borderOffset: { border: 1 }
    }
};
