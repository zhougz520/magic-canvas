import { ICanvasComponent } from '../Canvas';

export interface IDrawProps {
    componentPosition: any;
    // 画布的大小
    canvasSize: { width: number, height: number };
    getCanvas: () => ICanvasComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
}
