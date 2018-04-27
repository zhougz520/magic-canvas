import { Record, List , fromJS} from 'immutable';

export interface IRadioState {
    name: string;
    defaultValue: number;
    // defaultValue 默认选中的值
    value: number;
    // value 设置group当前选中的值
    // options: RadioProperties[];
    options: List<Map<any, any>>;
    // options 以配置的形式设置子元素
    isButton: boolean;
}

const initOptions = [{label: 'radio1', value: 1}, {label: 'radio2', value: 2}, {label: 'radio3', value: 3}];

const defaultRecord: IRadioState = {
    name: 'radioName',
    options: fromJS(initOptions),
    value: 3,
    defaultValue: 3,
    isButton: false
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

    getName(): string {
        return this.get('name');
    }

    getDefaultValue(): string {
        return this.get('defaultValue');
    }

    getValue(): string {
        return this.get('value');
    }

    getOptions(): string[] {
        return this.get('options');
    }

    getIsButton(): boolean {
        return this.get('isButton');
    }

}
