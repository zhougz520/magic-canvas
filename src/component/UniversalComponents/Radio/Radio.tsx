import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { Radio as AntRadio } from 'antd';

import { RadioState, RadioProperties } from './RadioState';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Map } from 'immutable';
import { PropertiesEnum, ComponentProperty } from '../../config';

const RadioGroup = AntRadio.Group;
const AntRadioButton = AntRadio.Button;

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Radio extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new RadioState())
        };
    }

    render() {
        const radioList: RadioProperties[] = this.getCustomState().getOptions();
        // tslint:disable-next-line:no-shadowed-variable
        const radioElem = (radiosList: RadioProperties[]): any => {
            const res = [];
            if (this.getCustomState().getIsButton()) {
                for (let i = 0; i < radioList.length; i++) {
                    res.push(
                        <AntRadioButton
                            value={radiosList[i].value}
                            disabled={radioList[i].disabled}
                            key={radiosList[i].value}
                        >
                            {radiosList[i].label}
                        </AntRadioButton>
                    );
                }
            } else {
                for (let i = 0; i < radioList.length; i++) {
                    res.push(
                        <AntRadio
                            value={radiosList[i].value}
                            disabled={radioList[i].disabled}
                            key={radiosList[i].value}
                        >
                            {radiosList[i].label}
                        </AntRadio>);
                }
            }

            return res;
        };

        return (

            <div
                onMouseDown={this.fireSelectChange}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            >
                <RadioGroup
                    value={this.getCustomState().getValue()}
                    // tslint:disable-next-line:jsx-no-lambda
                    onChange={this.onChange}
                >
                    {radioElem(radioList)}
                </RadioGroup>
            </div>
        );
    }

    public getComponentProperties = (): ComponentProperty => {
        return {
            componentCid: this.getCustomState().getSelectedCid(),
            componentProperties: [
                {
                    pName: 'name',
                    pValue: this.getCustomState().getName(),
                    pType: 'text'
                }, {
                    pName: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: 'text'
                }, {
                    pName: 'options',
                    pValue: this.getCustomState().getOptions(),
                    pType: 'text'
                }, {
                    pName: 'isButton',
                    pValue: this.getCustomState().getIsButton(),
                    pType: PropertiesEnum.SWITCH
                }]
        };
    }

    public setComponentProperties = (cid: string, pProperty: {pName: string, pValue: any, pType: string}) => {
        let propertiesMap = Map();
        propertiesMap = propertiesMap.set(pProperty.pName, pProperty.pValue);
        propertiesMap = propertiesMap.set('selectedCid', cid);

        const newRadioState: RadioState = RadioState.set(
            this.getCustomState(), propertiesMap
        );
        this.setCustomState(newRadioState);
    }

    private onChange = (event: RadioChangeEvent) => {
        const newRadioState: RadioState = RadioState.set(
            this.getCustomState(),
            {
                value: event.target.value
            }
        );
        this.setCustomState(newRadioState);
    }

}
