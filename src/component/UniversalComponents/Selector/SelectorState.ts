import { Record, List, fromJS} from 'immutable';

export interface ISelectorState {
    disable: boolean;
    options: List<Map<any, any>>;
    placeholder: string;
    value: string;
    defaultValue: string;
}

const initOptions = [{label: 'option1', value: 1}, {label: 'option2', value: 2}, {label: 'option3', value: 3}];

const defaultRecord: ISelectorState = {
    disable: false,
    options: fromJS(initOptions),
    placeholder: 'this is a placeholer',
    value: 'option1',
    defaultValue: 'option2'
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

    getDisable(): boolean {
        return this.get('disable');
    }

    getPlaceholder(): boolean {
        return this.get('placeholder');
    }

    getValue(): string {
        return this.get('value');
    }

    getDefaultValue(): string {
        return this.get('defaultValue');
    }
}
