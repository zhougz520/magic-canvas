import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { Radio as AntRadio } from 'antd';

import { RadioState } from './RadioState';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Map, List } from 'immutable';
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
        const radioList: List<Map<any, any>> = this.getCustomState().getOptions();
        // tslint:disable-next-line:no-shadowed-variable
        const radioElem = (radiosList: List<Map<any, any>>): any => {
            const res = [];
            if (this.getCustomState().getIsButton()) {
                for (let i = 0; i < radioList.size; i++) {
                    res.push(
                        <AntRadioButton
                            value={radiosList.toArray()[i].get('value')}
                            // disabled={radioList[i].disabled}
                            key={radiosList.toArray()[i].get('value')}
                        >
                            {radiosList.toArray()[i].get('label')}
                        </AntRadioButton>
                    );
                }
            } else {
                for (let i = 0; i < radioList.size; i++) {
                    res.push(
                        <AntRadio
                            value={radiosList.toArray()[i].get('value')}
                            // disabled={radioList[i].disabled}
                            key={radiosList.toArray()[i].get('value')}
                        >
                            {radiosList.toArray()[i].get('label')}
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

    public getPropertiesToProperty = (): ComponentProperty => {
        return {
            componentCid: this.getCustomState().getSelectedCid(),
            componentProperties: [
               {
                    pTitle: '选中值',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '选项',
                    pKey: 'options',
                    pValue: this.getCustomState().getOptions(),
                    pType: PropertiesEnum.INPUT_OBJECT_LIST
                }, {
                    pTitle: '是否为方形按钮',
                    pKey: 'isButton',
                    pValue: this.getCustomState().getIsButton(),
                    pType: PropertiesEnum.SWITCH
                }
            ]
        };
    }

    public setPropertiesFromProperty = (cid: string, pProperty: {pKey: string, pValue: any}) => {
        let propertiesMap = Map();
        propertiesMap = propertiesMap.set(pProperty.pKey, pProperty.pValue);
        propertiesMap = propertiesMap.set('selectedCid', cid);

        const newRadioState: RadioState = RadioState.set(
            this.getCustomState(), propertiesMap
        );
        this.setCustomState(newRadioState);
    }

    public getPropertiesToCommand = (): ComponentProperty => {
        return {
            componentCid: this.getCustomState().getSelectedCid(),
            componentProperties: [
                {
                    pTitle: '选中值',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '选项',
                    pKey: 'options',
                    pValue: this.getCustomState().getOptions(),
                    pType: PropertiesEnum.INPUT_OBJECT_LIST
                }, {
                    pTitle: '是否为方形按钮',
                    pKey: 'isButton',
                    pValue: this.getCustomState().getIsButton(),
                    pType: PropertiesEnum.SWITCH
                }
            ]
        };
    }

    public setPropertiesFromCommand = (cid: string, pProperty: {pKey: string, pValue: any}) => {
        let propertiesMap = Map();
        propertiesMap = propertiesMap.set(pProperty.pKey, pProperty.pValue);
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
