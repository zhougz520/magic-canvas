import { Record } from 'immutable';

import { SizeState } from './SizeState';
import { PostionState } from './PostionState';

export interface IContentState {
    // 是否选中：是（true）|否（false）
    isSelected: boolean;
    // 组件大小：width|height
    sizeState: SizeState | null;
    // 组件位置：left|right|top|bottom
    postionState: PostionState | null;
    // 组件中带格式的富文本内容
    richChildNode: any;
}

const defaultRecord: IContentState = {
    isSelected: false,
    sizeState: null,
    postionState: null,
    richChildNode: null
};

export const ContentStateRecord: Record.Class = Record(defaultRecord);

export class ContentState extends ContentStateRecord {
    static createEmpty(): ContentState {
        return ContentState.create({
            isSelected: false,
            sizeState: SizeState.createEmpty(),
            postionState: PostionState.createEmpty(),
            richChildNode: null
        });
    }

    static create(contentState: IContentState): ContentState {
        return new ContentState(contentState);
    }

    getIsSelected(): boolean {
        return this.get('isSelected');
    }

    getSizeState(): SizeState {
        return this.get('sizeState');
    }

    getPostionState(): PostionState {
        return this.get('postionState');
    }

    getRichChildNode(): any {
        return this.get('richChildNode');
    }
}
