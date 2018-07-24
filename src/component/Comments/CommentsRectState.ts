import { Record } from 'immutable';

export interface ICommentsRectState {
    cid: string | null;
    author: string;
    authorId: string;
    userType: 'Master' | 'Guest';
}

const defaultRecord: ICommentsRectState = {
    cid: null,
    author: '作者',
    authorId: '',
    userType: 'Master'
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

    getAuthor(): string {
        return this.get('author');
    }

    getAuthorId(): string {
        return this.get('authorId');
    }

    getUserType(): 'Master' | 'Guest' {
        return this.get('userType');
    }
}
