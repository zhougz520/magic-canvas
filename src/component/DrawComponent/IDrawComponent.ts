import { Set } from 'immutable';

/**
 * DrawComponent提供的方法接口
 */
export interface IDrawComponent {
    // [key: string]: any;
    showFrame: (cids: Set<string>) => void;
}
