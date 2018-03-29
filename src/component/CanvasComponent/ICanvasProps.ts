import { Set } from 'immutable';

import { IComponent } from '../BaseComponent';

export interface ICanvasProps {
    [key: string]: any;
    showSelected: (data: Set<string>) => void;
    componentPosition: any;

    /**
     * 通知EditComponent准备开始编辑
     */
    beforeEditCom: (com: IComponent) => void;
}
