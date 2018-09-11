import { ICanvasComponent } from '../Canvas';
import { PageMode } from '../Stage';

export interface IDrawProps {
    // 页面模式
    pageMode: PageMode;
    // 画布的大小
    canvasSize: { width: number, height: number };
    // 画布偏移量
    componentPosition: any;
    // 画布缩放比例（0-1）
    scale?: number;

    getCanvas: () => ICanvasComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
}
