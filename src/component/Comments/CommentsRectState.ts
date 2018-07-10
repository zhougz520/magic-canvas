import { Record } from 'immutable';

export interface ICommentsRectState {
    cid: string | null;
}

const defaultRecord: ICommentsRectState = {
    cid: null
};

export const CommentsRectRecord: Record.Class = Record(defaultRecord);

export class CommentsRectState extends CommentsRectRecord {
    static create(commentsRectState: ICommentsRectState): CommentsRectState {
        return new CommentsRectState(commentsRectState);
    }

    static set(commentsRectState: CommentsRectState, put: any): CommentsRectState {
        const map: any = commentsRectState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new CommentsRectState(map);
    }

    getCid(): string | null {
        return this.get('cid');
    }
}
