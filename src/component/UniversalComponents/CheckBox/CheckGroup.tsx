import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { Checkbox as AntCheckbox} from 'antd';

import { CheckGroupState } from './CheckGroupState';
import { PropertiesEnum } from '../../config';
import { Map } from 'immutable';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class CheckGoup extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new CheckGroupState())
        };
    }

    render() {
        // const CheckboxList: List<string> = this.getCustomState().getOptions();
        // tslint:disable-next-line:no-shadowed-variable
        // const CheckboxElem = (CheckboxsList: List<string>): any => {
        //     const res = [];
        //     for (let i = 0; i < CheckboxList.size; i++) {
        //         res.push(
        //             <AntCheckbox
        //                 value={this.getCustomState().getValue()}
        //                 key={CheckboxList.toArray()[i]}
        //             >
        //                 {CheckboxList.toArray()[i]}
        //             </AntCheckbox>);
        //     }

        //     return res;
        // };

        return (

            <div
                onMouseDown={this.fireSelectChange}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            >
                <AntCheckbox.Group
                    defaultValue={this.getCustomState().getDefaultValue().toArray()}
                    value={this.getCustomState().getValue().toArray()}
                    options={this.getCustomState().getOptions().toArray()}
                    onChange={this.onCheckGroupChange}
                    // {CheckboxElem(CheckboxList)}
                />
            </div>
        );
    }

    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '默认选中项',
                    pKey: 'defaultValue',
                    pValue: this.getCustomState().getDefaultValue(),
                    pType: PropertiesEnum.INPUT_LIST
                }, {
                    pTitle: '选中项',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_LIST
                }, {
                    pTitle: '选项',
                    pKey: 'options',
                    pValue: this.getCustomState().getOptions(),
                    pType: PropertiesEnum.INPUT_LIST
                }
            ];
    }

    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: CheckGroupState = CheckGroupState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '默认选中项',
                    pKey: 'defaultValue',
                    pValue: this.getCustomState().getDefaultValue(),
                    pType: PropertiesEnum.INPUT_LIST
                }, {
                    pTitle: '选中项',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_LIST
                }, {
                    pTitle: '选项',
                    pKey: 'options',
                    pValue: this.getCustomState().getOptions(),
                    pType: PropertiesEnum.INPUT_LIST
                }
            ];
    }

    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: CheckGroupState = CheckGroupState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    private onCheckGroupChange = (checkedValue: any[]) => {

        const newCheckGroupState: CheckGroupState = CheckGroupState.set(
            this.getCustomState(),
            {
                value: checkedValue
            }
        );
        this.setCustomState(newCheckGroupState);
    }
}
