import { IDrawComponent } from '../DrawComponent';

import { ICompos, ComponentProperty } from '../config';
import { IBoundary, IOffset } from './model/types';

export interface ICanvasProps {
    components: any[];
    componentPosition: ICompos;
    // canvas默认的宽高百分百
    canvasSize: { width: number, height: number };

    getDraw: () => IDrawComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
    setStageScroll: (offset: IOffset) => void;
    getStageBoundary: () => undefined | IBoundary;
    onCommandProperties: (currentCid: string) => ComponentProperty| undefined;
    onPropertyProperties: (currentCid: string) =>  ComponentProperty| undefined;
}
