import { IPosition } from './PositionState';
import { ISize } from './SizeState';

export type EditType = 'RichEdit' | 'Text' | 'TextArea' | 'none';

export interface IRichEditOption {
    position: IPosition;
    size: ISize;
}
