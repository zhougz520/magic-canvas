import * as React from 'react';
import { BaseComponent, BaseStyle, IBaseProps, IBaseState } from '../../BaseComponent';
import { ImageState } from './ImageState';
import { PropertiesEnum } from '../types';
import { Map } from 'immutable';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Image extends BaseComponent<IDemoProps, IBaseState> {
    static defaultProps = {
        data: {
            id: 'cs6',
            txt_v: '我是测试组件6',
            w: 300,
            h: 200,
            l: 300,
            t: 10
        }
    };

    com: HTMLElement| null = null;

    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ImageState())
        };
    }

    render() {

        // const { w, h, att_url, att_n} = this.props;

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
                    <a href="javascript:void(0)" title={'att_n'}>
                        <img
                            // tslint:disable-next-line:jsx-no-multiline-js
                            style={{width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                                textDecoration: this.getCustomState().getTextDecoration(), display: 'inline-block',
                                textAlign: this.getCustomState().getTextAlign()}}
                            src={this.getCustomState().getSrc()}
                            alt={this.getCustomState().getAlt()}
                            // width={this.getCustomState().getWidth()}
                            // height={this.getCustomState().getHeight()}
                            key={'img'}
                        />
                    </a>
                </div>
            </div>
        );
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return  [
                {
                    pTitle: '链接地址',
                    pKey: 'alt',
                    pValue: this.getCustomState().getAlt(),
                    pType: PropertiesEnum.INPUT_STRING
                // }, {
                //     pTitle: '字体',
                //     pKey: 'fontSize',
                //     pValue: this.getCustomState().get(),
                //     pType: PropertiesEnum.INPUT_NUMBER
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
        const newImageState: ImageState = ImageState.set(this.getCustomState(), properties);

        this.setCustomState(newImageState);
    }

}
