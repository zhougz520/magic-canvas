import { ICompos } from './types';

export interface IStageState {
    // 高性能模式
    highPerformance: boolean;
    // 画布偏移量，bar隐藏和显示时修改
    componentPosition: ICompos;
    // 画布大小
    canvasSize: { width: number, height: number };
}
