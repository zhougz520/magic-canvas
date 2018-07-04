import { Record } from 'immutable';

export interface IRichTextState {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const defaultRecord: IRichTextState = {
    backgroundColor: '#FFF',
    borderColor: '#d9d9d9',
    borderWidth: 1
};

export const RichTextStateRecord: Record.Class = Record(defaultRecord);

export class RichTextState extends RichTextStateRecord {
    static create(richTextState: IRichTextState): RichTextState {
        return new RichTextState(richTextState);
    }

    static set(richTextState: RichTextState, put: any): RichTextState {
        const map: any = richTextState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new RichTextState(map);
    }

    getBackgroundColor(): string {
        return this.get('backgroundColor');
    }

    getBorderColor(): string {
        return this.get('borderColor');
    }

    getBorderWidth(): number {
        return this.get('borderWidth');
    }
}
