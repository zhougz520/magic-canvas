import { Record, List, fromJS} from 'immutable';
import { IFontState } from '../model/types';

export interface ISelectorState extends IFontState {
    disabled: boolean;
    options: List<Map<any, any>>;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

const initOptions = [
    {label: 'option1', value: 'option1'},
    {label: 'option2', value: 'option2'},
    {label: 'option3', value: 'option3'}
];

const defaultRecord: ISelectorState = {
    disabled: false,
    options: fromJS(initOptions),
    backgroundColor: '#FFF',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    fontColor: '#000',
    fontStyle: 'normal',
    fontSize: 14,
    fontWeight: 'normal',
    textValue: 'option1',
    textDecoration: 'none',
    textAlign: 'left'
};

export const SelectorRecord: Record.Class = Record(defaultRecord);

export class SelectorState extends SelectorRecord {
    static create(selectorState: ISelectorState): SelectorState {
        return new SelectorState(selectorState);
    }

    static set(selectorState: SelectorState, put: any): SelectorState {
        const map: any = selectorState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new SelectorState(map);
    }

    getOptions(): List<Map<any, any>> {
        return this.get('options');
    }

    getDisabled(): string {
        return this.get('disabled');
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
