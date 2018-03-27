import { Record } from 'immutable';

import { SizeState } from './SizeState';
import { PositionState } from './PositionState';

export interface IContent {
    // 组件大小：width|height
    sizeState: SizeState | null;
    // 组件位置：left|right|top|bottom
    positionState: PositionState | null;
    // TODO 形状属性
    // 组件中带格式的富文本内容
    richChildNode: any;
    // TODO 组件个性化属性
}

const defaultRecord: IContent = {
    sizeState: null,
    positionState: null,
    richChildNode: null
};

export const ContentStateRecord: Record.Class = Record(defaultRecord);

export class ContentState extends ContentStateRecord {
    static createEmpty(): ContentState {
        return ContentState.create({
            sizeState: SizeState.createEmpty(),
            positionState: PositionState.createEmpty(),
            richChildNode: null
        });
    }

    static create(contentState: IContent): ContentState {
        return new ContentState(contentState);
    }

    getSizeState(): SizeState {
        return this.get('sizeState');
    }

    getPositionState(): PositionState {
        return this.get('positionState');
    }

    getRichChildNode(): any {
        return this.get('richChildNode');
    }
}
