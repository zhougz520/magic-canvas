import { ICanvasComponent } from '../Canvas';
import { PageMode } from '../Stage';

export interface IDrawProps {
    // 页面模式
    pageMode: PageMode;
    componentPosition: any;
    // 画布的大小
    canvasSize: { width: number, height: number };
    getCanvas: () => ICanvasComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
}
