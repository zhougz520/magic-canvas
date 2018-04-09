import { IDrawComponent } from '../DrawComponent';

export interface ICanvasProps {
    components: object;
    componentPosition: any;

    getDraw: () => IDrawComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
}
