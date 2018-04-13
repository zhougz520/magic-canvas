import { Record } from 'immutable';

export interface ISelectorState {
    disable: boolean;
    data: string[];
    placeholder: string;
}

const defaultRecord: ISelectorState = {
    disable: false,
    data: ['option1', 'option2', 'option3'],
    placeholder: 'this is a placeholer'
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

    getData(): string[] {
        return this.get('data');
    }

    getDisable(): boolean {
        return this.get('disable');
    }

    getPlaceholder(): boolean {
        return this.get('placeholder');
    }
}
