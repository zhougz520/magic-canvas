import {
    ISize,
    IPostion
} from './types';

/**
 * TODO：注释
 */
export interface IComponent {
    getSize: () => ISize;
    getPostion: () => IPostion;
}
