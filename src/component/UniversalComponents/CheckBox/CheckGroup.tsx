import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { Checkbox as AntCheckbox} from 'antd';

import { CheckGroupState } from './CheckGroupState';

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
        const CheckboxList: string[] = this.getCustomState().getOptions();
        // tslint:disable-next-line:no-shadowed-variable
        const CheckboxElem = (CheckboxsList: string[]): any => {
            const res = [];
            for (let i = 0; i < CheckboxList.length; i++) {
                res.push(
                    <AntCheckbox
                        value={i}
                        key={CheckboxList[i]}
                    >
                        {CheckboxsList[i]}
                    </AntCheckbox>);
            }

            return res;
        };

        return (

            <div
                onMouseDown={this.fireSelectChange}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            >
                <AntCheckbox.Group
                    defaultValue={this.getCustomState().getDefaultValue()}
                    value={this.getCustomState().getValue()}
                    options={this.getCustomState().getOptions()}
                    onChange={this.onCheckGroupChange}
                >
                    {CheckboxElem(CheckboxList)}
                </AntCheckbox.Group>
            </div>
        );
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
