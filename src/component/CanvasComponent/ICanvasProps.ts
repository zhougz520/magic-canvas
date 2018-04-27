import { IDrawComponent } from '../DrawComponent';

import { ICompos } from '../config';
import { IBoundary, IOffset } from './model/types';
import { Map } from 'immutable';

export interface ICanvasProps {
    components: any[];
    componentPosition: ICompos;
    // canvas默认的宽高百分百
    canvasSize: { width: number, height: number };

    getDraw: () => IDrawComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
    setStageScroll: (offset: IOffset) => void;
    getStageBoundary: () => undefined | IBoundary;
    getStageSize: () => undefined | { width: number, height: number };
    onCommandProperties: (selectedComs: Map<string, any>) => void;
    onPropertyProperties: (
        compProperty: Array<{pTitle: string, pKey: string, pValue: any, pType: string}>| undefined
    ) => void;
    updateCanvasSize: (width: number, height: number) => void;
}
