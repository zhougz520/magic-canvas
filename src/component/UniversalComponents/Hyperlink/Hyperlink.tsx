import * as React from 'react';
import { BaseComponent, BaseStyle, IBaseProps, IBaseState } from '../../BaseComponent';
import { HyperlinkState } from './HyperlinkState';
import { PropertiesEnum } from '../../config';
import { Map } from 'immutable';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Hyperlink extends BaseComponent<IDemoProps, IBaseState> {
    com: any = null;

    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new HyperlinkState())
        };
    }

    render() {
        return (
            <div
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                ref={(handler) => this.com = handler}
            >
                <div
                        // tslint:disable-next-line:jsx-no-multiline-js
                    style={{
                        width: '100%', height: '100%',
                        fontStyle: this.getCustomState().getFontStyle(), fontSize: this.getCustomState().getFontSize() + 'px',
                        fontWeight: this.getCustomState().getFontWeight(), backgroundColor: this.getCustomState().getBackgroundColor(), borderStyle: 'solid',
                        borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth() + 'px'
                    }}
                >
                    <a
                        // tslint:disable-next-line:jsx-no-multiline-js
                        style={{width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                            textDecoration: this.getCustomState().getTextDecoration(), display: 'inline-block',
                            textAlign: this.getCustomState().getTextAlign()}}
                        href={this.getCustomState().getHerf()}
                    >
                        {this.getCustomState().getContent()}
                    </a>
                </div>
            </div>
        );
    }

    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '链接地址',
                    pKey: 'herf',
                    pValue: this.getCustomState().getHerf(),
                    pType: PropertiesEnum.INPUT_STRING
                }
            ];
    }

    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newHyperlinkState: HyperlinkState = HyperlinkState.set(this.getCustomState(), properties);

        this.setCustomState(newHyperlinkState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return  [
                {
                    pTitle: '链接地址',
                    pKey: 'herf',
                    pValue: this.getCustomState().getHerf(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '字体',
                    pKey: 'fontSize',
                    pValue: this.getCustomState().getFontSize(),
                    pType: PropertiesEnum.INPUT_NUMBER
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
        const newHyperlinkState: HyperlinkState = HyperlinkState.set(this.getCustomState(), properties);

        this.setCustomState(newHyperlinkState);
    }

}
