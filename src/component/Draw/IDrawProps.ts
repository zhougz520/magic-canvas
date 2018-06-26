import { ICanvasComponent } from '../Canvas';
import { PageMode } from '../Stage';

export interface IDrawProps {
    // 页面模式
    pageMode: PageMode;
    // 画布的大小
    canvasSize: { width: number, height: number };
    // 画布偏移量
    componentPosition: any;

    getCanvas: () => ICanvasComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
}
