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
    com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new TextFieldState())
        };
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '文字内容',
                    pKey: 'textValue',
                    pValue: this.getCustomState().getTextValue(),
                    pType: PropertiesEnum.INPUT_TEXT
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
        const newTextFieldState: TextFieldState = TextFieldState.set(this.getCustomState(), properties);

        this.setCustomState(newTextFieldState);
    }

    public getComponentSettableCommands = (): string[] => {
        return ['Color', 'fontStyle', 'textDecoration', 'fontSize', 'fontWeight', 'textAlign'];
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
                    <TextArea
                        // tslint:disable-next-line:jsx-no-multiline-js
                        style={{width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                            fontStyle: this.getCustomState().getFontStyle(), textDecoration: this.getCustomState().getTextDecoration(), fontSize: this.getCustomState().getFontSize() + 'px',
                            fontWeight: this.getCustomState().getFontWeight(), textAlign: this.getCustomState().getTextAlign(), backgroundColor: this.getCustomState().getBackgroundColor()
                        }}
                        placeholder={this.getCustomState().getPlaceholder()}
                        onClick={this.onClick}
                        onPressEnter={this.onClick}
                        value={this.getCustomState().getTextValue()}
                    />
                </div>
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
