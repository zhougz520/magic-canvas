import { Record } from 'immutable';

import { SizeState } from './SizeState';
import { PositionState } from './PositionState';

export interface IContentState {
    // 组件ID
    cid: string;
    // 组件层级结构
    zIndex: number;
    // 是否选中：是（true）|否（false）
    isSelected: boolean;
    // 组件大小：width|height
    sizeState: SizeState | null;
    // 组件位置：left|right|top|bottom
    positionState: PositionState | null;
    // TODO 形状属性
    // 组件中带格式的富文本内容
    richChildNode: any;
    // TODO 组件个性化属性
}

const defaultRecord: IContentState = {
    cid: '',
    zIndex: 0,
    isSelected: false,
    sizeState: null,
    positionState: null,
    richChildNode: null
};

export const ContentStateRecord: Record.Class = Record(defaultRecord);

export class ContentState extends ContentStateRecord {
    static createEmpty(): ContentState {
        return ContentState.create({
            cid: '',
            zIndex: 0,
            isSelected: false,
            sizeState: SizeState.createEmpty(),
            positionState: PositionState.createEmpty(),
            richChildNode: null
        });
    }

    static create(contentState: IContentState): ContentState {
        return new ContentState(contentState);
    }

    getCid(): string {
        return this.get('cid');
    }

    getZIndex(): number {
        return this.get('zIndex');
    }

    getIsSelected(): boolean {
        return this.get('isSelected');
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
