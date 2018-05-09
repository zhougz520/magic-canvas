import { Record, List, fromJS} from 'immutable';

export interface ISelectorState {
    disabled: boolean;
    options: List<Map<any, any>>;
    value: string;
    // textAlign: string;
    fontColor: string;
    fontStyle: string;
    // textDecoration: string;
    fontSize: number;
    fontWeight: string;
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
    value: 'option1',
    fontColor: '#000',
    fontStyle: 'normal',
    fontSize: 16,
    fontWeight: 'normal',
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderWidth: 0
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

    getValue(): string {
        return this.get('value');
    }

    getDisabled(): string {
        return this.get('disabled');
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
