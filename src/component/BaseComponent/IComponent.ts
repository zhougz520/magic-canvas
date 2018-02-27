import { BaseState } from './model/BaseState';
import { SizeState } from './model/SizeState';
import { PostionState } from './model/PostionState';

/**
 * TODO：注释
 */
export interface IComponent {
    getBaseState: () => BaseState;
    setBaseState: (baseState: BaseState) => void;

    getSizeState: () => SizeState;
    setSizeState: (sizeState: SizeState) => void;

    getPostionState: () => PostionState;
    setPostionState: (postionState: PostionState) => void;
}
