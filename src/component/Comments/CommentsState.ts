import { IComponentList } from '../Canvas';

import { Record, OrderedSet } from 'immutable';

export interface ICommentsState {
    author: string;
    authorId: string;
    userType: 'Master' | 'Guest';
    commentsRectList: OrderedSet<IComponentList>;
    maxRectId: number;
    backgroundColor: string;
}

const defaultRecord: ICommentsState = {
    author: '作者',
    authorId: '',
    userType: 'Master',
    commentsRectList: OrderedSet(),
    maxRectId: 0,
    backgroundColor: '#fffbba'
};

export const CommentsRecord: Record.Class = Record(defaultRecord);

export class CommentsState extends CommentsRecord {
    static create(commentsState: ICommentsState): CommentsState {
        return new CommentsState(commentsState);
    }

    static set(commentsState: CommentsState, put: any): CommentsState {
        const map: any = commentsState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new CommentsState(map);
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

    getCommentsRectList(): OrderedSet<IComponentList> {
        return this.get('commentsRectList');
    }

    getMaxRectId(): number {
        return this.get('maxRectId');
    }

    getBackgroundColor(): string {
        return this.get('backgroundColor');
    }
}
