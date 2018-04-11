import { Set } from 'immutable';
import { IBaseData } from './model/types';

/**
 * DrawComponent提供的方法接口
 */
export interface IDrawComponent {
    drawSelectedBox: (cids: Set<string>) => void;
    drawChoiceBox: (data: { pointX: number, pointY: number, offset: any } | null) => void;
    drawStretchBox: (data: IBaseData[]) => void;
}
