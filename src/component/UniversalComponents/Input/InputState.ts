import { Record } from 'immutable';
import { IFontState } from '../model/types';

export interface IInputState extends IFontState {
    placeholder: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const defaultRecord: IInputState = {
    placeholder: 'input text',
    backgroundColor: '#FFF',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    fontColor: 'rgba(0, 0, 0, 0.65)',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: 'normal',
    textValue: '',
    textDecoration: 'none',
    textAlign: 'left'
};

export const InputRecord: Record.Class = Record(defaultRecord);

export class InputState extends InputRecord {
    static create(inputState: IInputState): InputState {
        return new InputState(inputState);
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

    getBackgroundColor(): string {
        return this.get('backgroundColor');
    }

    getBorderColor(): string {
        return this.get('borderColor');
    }

    getBorderWidth(): number {
        return this.get('borderWidth');
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

    getTextAlign(): string {
        return this.get('textAlign');
    }

    getTextDecoration(): string {
        return this.get('textDecoration');
    }

    getTextValue(): string {
        return this.get('textValue');
    }
}
