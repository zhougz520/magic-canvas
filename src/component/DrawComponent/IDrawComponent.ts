import { Set } from 'immutable';

/**
 * DrawComponent提供的方法接口
 */
export interface IDrawComponent {
    setSelectedCids: (cids: Set<string>) => void;
    drawChoiceBox: (data: { pointX: number, pointY: number, offset: any } | null) => void;
}
