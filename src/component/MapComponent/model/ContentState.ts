import { Record } from 'immutable';

export interface IContent {
    // 组件ID
    cid: string;
    // 组件中带格式的富文本内容
    richChildNode: any;
    // TODO 组件个性化属性
}

const defaultRecord: IContent = {
    cid: '',
    richChildNode: null
};

export const ContentStateRecord: Record.Class = Record(defaultRecord);

export class ContentState extends ContentStateRecord {
    static createEmpty(): ContentState {
        return ContentState.create({
            cid: '',
            richChildNode: null
        });
    }

    static create(contentState: IContent): ContentState {
        return new ContentState(contentState);
    }

    getCid(): string {
        return this.get('cid');
    }

    getRichChildNode(): any {
        return this.get('richChildNode');
    }
}
