import { Record} from 'immutable';

export class RadioProperties {
    [index: string]: any
    label: string = '';
    value: number = 1;
    // disabled?: boolean = false;
}

export interface IRadioState {
    value: string;
    isButton: boolean;
    disabled: boolean;
    checked: boolean;
    textAlign: string;
    fontColor: string;
    fontStyle: string;
    textDecoration: string;
    fontSize: number;
    fontWeight: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
}

const defaultRecord: IRadioState = {
    value: 'radio',
    isButton: false,
    disabled: false,
    checked: false,
    fontColor: '#000',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderWidth: '0'
};

export const RadioRecord: Record.Class = Record(defaultRecord);

// tslint:disable-next-line:max-classes-per-file
export class RadioState extends RadioRecord {
    static create(radioState: IRadioState): RadioState {
        return new RadioState(radioState);
    }

    static set(radioState: RadioState, put: any): RadioState {
        const map: any = radioState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new RadioState(map);
    }

    getValue(): string {
        return this.get('value');
    }

    getDisabled(): boolean {
        return this.get('disabled');
    }

    getChecked(): boolean {
        return this.get('checked');
    }

    getIsButton(): boolean {
        return this.get('isButton');
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

    getBorderWidth(): string {
        return this.get('borderWidth');
    }

}
