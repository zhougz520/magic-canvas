// 画布的偏移量
export interface ICompos {
    stageOffset: { top: number, left: number, right: number, bottom: number };  // stage相对body的偏移量
    canvasOffset: { top: number, left: number, right: number, bottom: number };  // canvas相对stage的偏移量
    borderOffset: { border: number };   // antd全局样式box-sizing导致的组件实际width和height会缩小2*border
}

// config格式
export interface IConfig {
    highPerformance: boolean;   // 高性能模式
    componentPosition: ICompos; // 画布的初始偏移量
    canvasSize: { width: number, height: number };  // 画布初始的宽高
}

// 数据库存储的数据结构
export type ComponentsType = Array<{
    t: string;
    p: {
        id: string;
        txt_v: string;
        w: number;
        h: number;
        l: number;
        t: number;
        zIndex: number;
        p: any;
    };
}>;
