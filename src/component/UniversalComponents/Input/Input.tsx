import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';
import { InputState } from './InputState';
import { Input  as AntInput } from 'antd';
import { Map } from 'immutable';
import { PropertiesEnum } from '../types';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Input extends BaseComponent<IDemoProps, IBaseState> {
    com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new InputState())
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
                    style={{width: '100%', height: '100%', borderStyle: 'solid',
                        borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth() + 'px'
                    }}
                >
                    <AntInput
                        // tslint:disable-next-line:jsx-no-multiline-js
                        style={{width: '100%', height: '100%', backgroundColor: this.getCustomState().getBackgroundColor(),
                            color: this.getCustomState().getFontColor(), fontStyle: this.getCustomState().getFontStyle(),
                            textDecoration: this.getCustomState().getTextDecoration(), fontSize: this.getCustomState().getFontSize() + 'px',
                            fontWeight: this.getCustomState().getFontWeight(),
                            textAlign: this.getCustomState().getTextAlign()
                        }}
                        placeholder={this.getCustomState().getPlaceholder()}
                        onClick={this.onClick}
                        value={this.getCustomState().getValue()}
                    />
                </div>
            </div>
        );
    }

    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '输入框提示',
                    pKey: 'placeholder',
                    pValue: this.getCustomState().getPlaceholder(),
                    pType: PropertiesEnum.INPUT_STRING
                }
            ];
    }

    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: InputState = InputState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '输入框提示',
                    pKey: 'placeholder',
                    pValue: this.getCustomState().getPlaceholder(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '输入框内容',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_STRING
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
        const newInputState: InputState = InputState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    private onClick = () => {
        const newInputState: InputState = InputState.set(
            this.getCustomState(),
            {
                placeholder: '这是一个输入框'
            }
        );

        this.setCustomState(newInputState);
    }

}
