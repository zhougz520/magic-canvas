import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { Checkbox as AntCheckbox} from 'antd';

import { CheckBoxState } from './CheckBoxState';
import { PropertiesEnum } from '../../config';
import { Map } from 'immutable';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class CheckBox extends BaseComponent<IDemoProps, IBaseState> {
    com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new CheckBoxState())
        };
    }

    render() {

        return (

            <div
                onMouseDown={this.fireSelectChange}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            >
                <div
                    // tslint:disable-next-line:jsx-no-multiline-js
                    style={{width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                        fontStyle: this.getCustomState().getFontStyle(), textDecoration: this.getCustomState().getTextDecoration(), fontSize: this.getCustomState().getFontSize() + 'px',
                        fontWeight: this.getCustomState().getFontWeight(), backgroundColor: this.getCustomState().getBackgroundColor(), borderStyle: 'solid',
                        borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth() + 'px'
                    }}
                >
                    <AntCheckbox
                        checked={this.getCustomState().getIsCheck()}
                        onChange={this.onCheckGroupChange}
                        disabled={this.getCustomState().getDisabled()}
                    />
                    <span
                        style={{display: 'inline-block', width: '85%', textAlign: this.getCustomState().getTextAlign()}}
                    >
                        {this.getCustomState().getOption()}
                    </span>
                </div>
            </div>
        );
    }

    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '是否选中',
                    pKey: 'isCheck',
                    pValue: this.getCustomState().getIsCheck(),
                    pType: PropertiesEnum.SWITCH
                }, {
                    pTitle: '文本内容',
                    pKey: 'option',
                    pValue: this.getCustomState().getOption(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '是否禁用',
                    pKey: 'disabled',
                    pValue: this.getCustomState().getDisabled(),
                    pType: PropertiesEnum.SWITCH
                }
            ];
    }

    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newCheckBoxState: CheckBoxState = CheckBoxState.set(this.getCustomState(), properties);

        this.setCustomState(newCheckBoxState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '是否选中',
                    pKey: 'isCheck',
                    pValue: this.getCustomState().getIsCheck(),
                    pType: PropertiesEnum.SWITCH
                }, {
                    pTitle: '文字内容',
                    pKey: 'option',
                    pValue: this.getCustomState().getOption(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '字体大小',
                    pKey: 'fontSize',
                    pValue: this.getCustomState().getFontSize(),
                    pType: PropertiesEnum.INPUT_NUMBER
                }, {
                    pTitle: '是否禁用',
                    pKey: 'disabled',
                    pValue: this.getCustomState().getDisabled(),
                    pType: PropertiesEnum.SWITCH
                }, {
                    pTitle: '背景颜色',
                    pKey: 'backgroundColor',
                    pValue: this.getCustomState().getBackgroundColor(),
                    pType: PropertiesEnum.COLOR_PICKER
                }, {
                    pTitle: '边框颜色',
                    pKey: 'borderColor',
                    pValue: this.getCustomState().getBorderColor(),
                    pType: PropertiesEnum.COLOR_PICKER
                }, {
                    pTitle: '边框宽度',
                    pKey: 'borderWidth',
                    pValue: this.getCustomState().getBorderWidth(),
                    pType: PropertiesEnum.SLIDER
                }
            ];
    }

    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newCheckBoxState: CheckBoxState = CheckBoxState.set(this.getCustomState(), properties);

        this.setCustomState(newCheckBoxState);
    }

    private onCheckGroupChange = (e: any) => {

        const newCheckGroupState: CheckBoxState = CheckBoxState.set(
            this.getCustomState(),
            {
                value: true
            }
        );
        this.setCustomState(newCheckGroupState);
    }
}
