import { ICanvasCommand } from './model/types';
import { IComponent } from '../..';

/**
 * CanvasComponent提供的方法接口
 */
export interface ICanvasComponent {
    command: ICanvasCommand;
    container: HTMLDivElement | null;
    canvas: HTMLDivElement | null;
    getComponent: (cid: string) => IComponent | null;
    findComponent: (cid: string[]) => IComponent | null;
}
