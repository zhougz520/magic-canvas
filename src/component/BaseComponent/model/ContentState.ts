import { Record } from 'immutable';

import { SizeState } from './SizeState';
import { PositionState } from './PositionState';
import { Map } from 'immutable';

export interface IContent {
    // 组件ID
    cid: string;
    // 组件层级结构
    zIndex: number;
    // 组件大小：width|height
    sizeState: SizeState | null;
    // 组件位置：left|right|top|bottom
    positionState: PositionState | null;
    // TODO 形状属性
    // TODO 组件中带格式的富文本内容
    richChildNode: any;
    // 组件个性化属性
    customState: any;
    // TODO 组件对应的批注集合
    commentsMap: Map<any, any>;
}

const defaultRecord: IContent = {
    cid: '',
    zIndex: 0,
    sizeState: null,
    positionState: null,
    richChildNode: null,
    customState: null ,
    commentsMap: Map()
};

export const ContentStateRecord: Record.Class = Record(defaultRecord);

export class ContentState extends ContentStateRecord {
    static createEmpty(): ContentState {
        return ContentState.create({
            cid: '',
            zIndex: 0,
            sizeState: SizeState.createEmpty(),
            positionState: PositionState.createEmpty(),
            richChildNode: null,
            customState: null,
            commentsMap: Map()
        });
    }

    static create(contentState: IContent): ContentState {
        return new ContentState(contentState);
    }

    getCid(): string {
        return this.get('cid');
    }

    getZIndex(): number {
        return this.get('zIndex');
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

    getCustomState(): any {
        return this.get('customState');
    }

    getCommentsMap(): Map<any, any> {
        return this.get('commentsMap');
    }
}
