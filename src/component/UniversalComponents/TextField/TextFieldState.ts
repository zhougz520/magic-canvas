import { Record } from 'immutable';

export interface ITextFieldState {
    placeholder: string;
    textValue: string;
    textAlign: string;
    fontColor: string;
    fontStyle: string;
    textDecoration: string;
    fontSize: number;
    fontWeight: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const defaultRecord: ITextFieldState = {
    placeholder: '这是文本框',
    textValue: '',
    fontColor: '#000',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderWidth: 0

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

    getTextValue(): string {
        return this.get('textValue');
    }

    getAutosize(): boolean {
        return this.get('autosize');
    }

    getFontColor(): string {
        return this.get('fontColor');
    }

    getFontStyle(): string {
        return this.get('fontStyle');
    }

    getFontSize(): string {
        return this.get('fontSize');
    }

    getFontWeight(): string {
        return this.get('fontWeight');
    }

    getTextDecoration(): string {
        return this.get('textDecoration');
    }

    getTextAlign(): string {
        return this.get('textAlign');
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
