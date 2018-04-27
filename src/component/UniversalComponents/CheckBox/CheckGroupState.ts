import { Record, List, fromJS } from 'immutable';

export interface ICheckGroupState {
    defaultValue: List<string>;
    // defaultValue 默认选中的值
    value: List<string>;
    // value 设置group当前选中的值
    options: List<string>;
    // CheckGroupList: string[];
    selectedCid: string;

}

const initOptions = ['option1', 'option2', 'option3'];
const initvalue = ['option1', 'option2'];

const defaultRecord: ICheckGroupState = {
    options: fromJS(initOptions),
    value:  fromJS(initvalue),
    defaultValue: fromJS(initvalue),
    selectedCid: ''

};

export const CheckGroupRecord: Record.Class = Record(defaultRecord);

// tslint:disable-next-line:max-classes-per-file
export class CheckGroupState extends CheckGroupRecord {
    static create(checkGroupState: ICheckGroupState): CheckGroupState {
        return new CheckGroupState(checkGroupState);
    }

    static set(checkGroupState: CheckGroupState, put: any): CheckGroupState {
        const map: any = checkGroupState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new CheckGroupState(map);
    }

    getDefaultValue(): List<string> {
        return this.get('defaultValue');
    }

    getValue(): List<string> {
        return this.get('value');
    }

    getOptions(): List<string> {
        return this.get('options');
    }

    getSelectedCid(): string {
        return this.get('selectedCid');
    }

}
