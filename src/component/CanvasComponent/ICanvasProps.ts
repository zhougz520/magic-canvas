import { IDrawComponent } from '../DrawComponent';

import { IComponent } from '../BaseComponent';
import { ICompos } from '../config';
import { IBoundary, IOffset } from './model/types';

export interface ICanvasProps {
    components: any[];
    componentPosition: ICompos;
    // canvas默认的宽高百分百
    canvasSize: { width: number, height: number };

    /**
     * 通知EditComponent准备开始编辑
     */
    beforeEditCom: (com: IComponent) => void;
    getDraw: () => IDrawComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
    setStageScroll: (offset: IOffset) => void;
    getStageBoundary: () => undefined | IBoundary;
}
