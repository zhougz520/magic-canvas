import { IBaseState } from '../../IBaseState';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IFieldState extends IBaseState {
    currX: number;
    resizing: boolean;
    value?: string;
}
