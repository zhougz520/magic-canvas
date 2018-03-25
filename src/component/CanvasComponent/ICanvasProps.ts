import { IDrawComponent } from '../DrawComponent';

// import Draw from '../DrawComponent/draw';

export interface ICanvasProps {
    components: object;
    componentPosition: any;
    getDraw: () => IDrawComponent | null;
}
