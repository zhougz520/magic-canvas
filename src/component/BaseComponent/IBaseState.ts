import { BaseState } from './model/BaseState';

/**
 * 构建BaseComponent的state
 */
export interface IBaseState {
    baseState: BaseState;
    selectedId?: string;
}
