import { Record } from 'immutable';

export interface ITextFieldState {
    placeholder: string;
    rowNum: number;
}

const defaultRecord: ITextFieldState = {
    placeholder: 'init value',
    rowNum: 3
};

export const TextFieldRecord: Record.Class = Record(defaultRecord);

export class TextFieldState extends TextFieldRecord {
    static create(textFieldState: ITextFieldState): TextFieldState {
        return new TextFieldState(textFieldState);
    }

    static set(textFieldState: TextFieldState, put: any): TextFieldState {
        const map: any = textFieldState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new TextFieldState(map);
    }

    getPlaceholder(): string {
        return this.get('placeholder');
    }

    getRowNum(): number {
        return this.get('rowNum');
    }
}
