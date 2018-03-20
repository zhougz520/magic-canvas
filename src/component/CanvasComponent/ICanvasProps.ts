import { Set } from 'immutable';

// import Draw from '../DrawComponent/draw';

export interface ICanvasProps {
    [key: string]: any;
    showSelected: (data: Set<string>) => void;
    componentPosition: any;
}
