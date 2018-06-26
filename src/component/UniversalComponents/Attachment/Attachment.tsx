import * as React from 'react';
import {
    BaseComponent, BaseStyle, IBaseProps, IBaseState
} from '../../BaseComponent';

import { AttachmentState } from './AttachmentState';
// import { PropertiesEnum } from '../model/types';
// import { IProperty } from '../model/types';
import { Map } from 'immutable';
import '../../UniversalComponents/sass/UComponents.scss';

export default class Attachment extends BaseComponent<IBaseProps, IBaseState> {
    com: any = null;
    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new AttachmentState())
        };
    }

    render() {
        const {w, h, att_ext, att_url, att_n, att_t} = {w: 80, h: 100, att_ext: 'image', att_url: 'sdf', att_n: 'test', att_t: 'testtitle'};
        let type = att_ext;
        // tslint:disable-next-line:no-console
        console.log(att_url);
        // tslint:disable-next-line:curly
        if (att_t.indexOf('image') > -1)
            type = 'image';
        const es = ((w / 5) > (h / 5)) ? (h / 5)  : (w / 5);

        return (

            <div
                className={'csr-pc-attachment' + type}
                onMouseDown={this.fireSelectChange}
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                onDoubleClick={this.HandleDBLClick}
            >
                <a
                    href={'javascript:void(0)'}
                    title={att_n}
                    style={{width: '100%', height: '100%'}}
                     // tslint:disable-next-line:jsx-no-multiline-js
                    // style={{width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                    //     fontStyle: this.getCustomState().getFontStyle(), textDecoration: this.getCustomState().getTextDecoration(), fontSize: this.getCustomState().getFontSize() + 'px',
                    //     fontWeight: this.getCustomState().getFontWeight()
                    //     // backgroundColor: this.getCustomState().getBackgroundColor(), borderStyle: 'solid'
                    //     // borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth() + 'px'
                    // }}
                >
                    <div className="att-head" style={{right: es, height: es}}/>
                    <div className="att-edge" style={{borderLeftWidth: es, borderTopWidth: es}}/>
                    <div className="att-edge-shadow" style={{top: es, borderLeftWidth: es, borderTopWidth: es}}/>
                    <div className="att-body" style={{top: es}}>
                        <div style={{width: w + 'px', height: (h - parseFloat(es.toString())), paddingBottom: es + 'px'}}>
                            <p style={{fontSize: es + 'px', maxWidth: (w - 16) + 'px'}}>{att_ext}</p>
                            <p style={{fontSize: (es / 12 * 8) + 'px', maxWidth: (w - 16) + 'px'}}>{att_n}</p>
                        </div>
                    </div>

                </a>
            </div>

        );
    }

    // 双击下载
    public HandleDBLClick = () => {
        const att_url = 'asdfj';
        window.open(att_url);
    }

    // public getPropertiesToProperty = (): IProperty[]  => {
    //     return [
    //             // {
    //             //     pTitle: '是否选中',
    //             //     pKey: 'isCheck',
    //             //     pValue: this.getCustomState().getIsCheck(),
    //             //     pType: PropertiesEnum.SWITCH
    //             // }, {
    //             //     pTitle: '文字内容',
    //             //     pKey: 'option',
    //             //     pValue: this.getCustomState().getOption(),
    //             //     pType: PropertiesEnum.INPUT_STRING
    //             // },
    //             {
    //                 pTitle: '字体大小',
    //                 pKey: 'fontSize',
    //                 pValue: this.getCustomState().getFontSize(),
    //                 pType: PropertiesEnum.INPUT_NUMBER
    //             }, {
    //                 pTitle: '背景颜色',
    //                 pKey: 'backgroundColor',
    //                 pValue: this.getCustomState().getBackgroundColor(),
    //                 pType: PropertiesEnum.COLOR_PICKER
    //             }, {
    //                 pTitle: '边框颜色',
    //                 pKey: 'borderColor',
    //                 pValue: this.getCustomState().getBorderColor(),
    //                 pType: PropertiesEnum.COLOR_PICKER
    //             }, {
    //                 pTitle: '边框宽度',
    //                 pKey: 'borderWidth',
    //                 pValue: this.getCustomState().getBorderWidth(),
    //                 pType: PropertiesEnum.SLIDER
    //             }
    //         ];
    // }

    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newAttachmentState: AttachmentState = AttachmentState.set(this.getCustomState(), properties);

        this.setCustomState(newAttachmentState);
    }

}
