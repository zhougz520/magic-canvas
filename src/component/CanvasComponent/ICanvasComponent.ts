import { ICanvasCommand } from './model/types';
import { IComponent } from '../..';
import { ComponentProperty } from '../config';

/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    command: ICanvasCommand;
    container: HTMLDivElement | null;
    canvas: HTMLDivElement | null;
    getComponent: (cid: string) => IComponent | null;
    findComponent: (cid: string) => IComponent | null;
    executorCommand: (cid: string, cProperty: {pName: string, pValue: any, pType: string}) => void;
    executorProperties: (cid: string, cProperty: {pName: string, pValue: any, pType: string}) => void;
    // getSelectedProperties: (currentCid: string) => {}|undefined;
    getSelectedProperties: (currentCid: string) => ComponentProperty|undefined;
}
