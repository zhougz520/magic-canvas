import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { Input } from 'antd';
import { Map } from 'immutable';

import { TextFieldState } from './TextFieldState';
import {  PropertiesEnum } from '../../config';

const { TextArea } = Input;
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class TextField extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new TextFieldState())
        };
    }

    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '行数',
                    pKey: 'rowNum',
                    pValue: this.getCustomState().getRowNum(),
                    pType: PropertiesEnum.INPUT_NUMBER
                }, {
                    pTitle: '值',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_TEXT
                }, {
                    pTitle: '默认值',
                    pKey: 'defaultvalue',
                    pValue: this.getCustomState().getDefaultValue(),
                    pType: PropertiesEnum.INPUT_TEXT
                }, {
                    pTitle: '是否自适应行数',
                    pKey: 'autosize',
                    pValue: this.getCustomState().getAutosize(),
                    pType: PropertiesEnum.SWITCH
                }
            ];
    }

    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: TextFieldState = TextFieldState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '行数',
                    pKey: 'rowNum',
                    pValue: this.getCustomState().getRowNum(),
                    pType: PropertiesEnum.INPUT_NUMBER
                },
                // {
                //     pTitle: '默认值',
                //     pKey: 'defaultvalue',
                //     pValue: this.getCustomState().getDefaultValue(),
                //     pType: PropertiesEnum.INPUT_TEXT
                // },
                {
                    pTitle: '是否自适应行数',
                    pKey: 'autosize',
                    pValue: this.getCustomState().getAutosize(),
                    pType: PropertiesEnum.SWITCH
                }
            ];
    }

    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: TextFieldState = TextFieldState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    render() {

        return (
            <div
                onMouseDown={this.fireSelectChange}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            >
                <TextArea
                    rows={this.getCustomState().getRowNum()}
                    placeholder={this.getCustomState().getPlaceholder()}
                    onClick={this.onClick}
                    onPressEnter={this.onClick}
                    autosize={false}
                    value={this.getRichChildNode()}
                    defaultValue={this.getCustomState().getDefaultValue()}
                />
            </div>
        );
    }

    private onClick = () => {
        const newTextFieldState: TextFieldState = TextFieldState.set(
            this.getCustomState(),
            {
                placeholder: 'this is a new placeholder'
            }
        );

        this.setCustomState(newTextFieldState);
    }

}
