import { ICanvasComponent } from '../CanvasComponent/inedx';

export interface IDrawProps {
    componentPosition: any;
    // 画布的大小
    canvasSize: { width: number, height: number };
    getCanvas: () => ICanvasComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
}
