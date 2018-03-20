import { ISize } from './SizeState';
import { IPosition } from './PositionState';

export interface IBaseData {
    cid: string;
    size: ISize;
    position: IPosition;
}
