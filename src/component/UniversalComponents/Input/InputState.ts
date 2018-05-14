import { Record } from 'immutable';

export interface IInputState {
    placeholder: string;
    value: string;
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

const defaultRecord: IInputState = {
    placeholder: '这是输入框提示',
    value: '',
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

export const InputRecord: Record.Class = Record(defaultRecord);

export class InputState extends InputRecord {
    static create(inputState: IInputState): InputState {
        return new InputState(InputState);
    }

    static set(inputState: InputState, put: any): InputState {
        const map: any = inputState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new InputState(map);
    }

    getPlaceholder(): string {
        return this.get('placeholder');
    }

    getValue(): string {
        return this.get('value');
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
