import { Record } from 'immutable';

export interface ICheckGroupState {
    defaultValue: string[];
    // defaultValue 默认选中的值
    value: string[];
    // value 设置group当前选中的值
    options: string[];
    // CheckGroupList: string[];
}

const defaultRecord: ICheckGroupState = {
    options: [ 'Checkbox1', 'Checkbox2', 'Checkbox3'],
    value:  ['Checkbox2'],
    defaultValue: ['Checkbox3']
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

    getDefaultValue(): string[] {
        return this.get('defaultValue');
    }

    getValue(): string[] {
        return this.get('value');
    }

    getOptions(): string[] {
        return this.get('options');
    }

}
