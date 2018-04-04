import { IDrawComponent } from '../DrawComponent';

import { IComponent } from '../BaseComponent';

export interface ICanvasProps {
    components: object;
    componentPosition: any;

    /**
     * 通知EditComponent准备开始编辑
     */
    beforeEditCom: (com: IComponent) => void;
    getDraw: () => IDrawComponent | null;
    getStageScroll: () => { scrollLeft: number, scrollTop: number };
}
