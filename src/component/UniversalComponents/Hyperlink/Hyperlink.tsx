import * as React from 'react';
import { BaseComponent, BaseStyle, IBaseProps, IBaseState } from '../../BaseComponent';
import { HyperlinkState } from './HyperlinkState';
import { BoxType } from '../../util/AnchorPoint';
import { PropertiesEnum, ComponentProperty } from '../../config';
import { Map } from 'immutable';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Hyperlink extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;

    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new HyperlinkState())
        };
    }

    /**
     * 重写basecomponent方法, 设置此组件的类型
     */
    public getType(): string {
        return BoxType.BarType;
    }

    render() {
        return (
            <div
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                ref={(handler) => this.com = handler}
            >
                <a
                    href={this.getCustomState().getHerf()}
                >
                    {this.getRichChildNode() as JSX.Element}
                </a>
            </div>
        );
    }

    public getPropertiesToCommand = (): ComponentProperty  => {
        return {
            componentCid: this.getCustomState().getSelectedCid(),
            componentProperties: [
                // {
                //     pTitle: '内容',
                //     pKey: 'content',
                //     pValue: this.getCustomState().getContent(),
                //     pType: PropertiesEnum.INPUT_STRING
                // },
                {
                    pTitle: '地址',
                    pKey: 'herf',
                    pValue: this.getCustomState().getHerf(),
                    pType: PropertiesEnum.INPUT_STRING
                }
            ]
        };
    }

    public setPropertiesFromCommand = (cid: string, pProperty: {pKey: string, pValue: any}) => {
        let properties = Map();
        properties = properties.set(pProperty.pKey, pProperty.pValue);
        properties = properties.set('selectedCid', cid);
        const newInputState: HyperlinkState = HyperlinkState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    public getPropertiesToProperty = (): ComponentProperty  => {
        return {
            componentCid: this.getCustomState().getSelectedCid(),
            componentProperties: [
                // {
                //     pTitle: '内容',
                //     pKey: 'content',
                //     pValue: this.getCustomState().getContent(),
                //     pType: PropertiesEnum.INPUT_STRING
                // },
                {
                    pTitle: '地址',
                    pKey: 'herf',
                    pValue: this.getCustomState().getHerf(),
                    pType: PropertiesEnum.INPUT_STRING
                }
            ]
        };
    }

    public setPropertiesFromProperty = (cid: string, pProperty: {pKey: string, pValue: any}) => {
        let properties = Map();
        properties = properties.set(pProperty.pKey, pProperty.pValue);
        properties = properties.set('selectedCid', cid);
        const newInputState: HyperlinkState = HyperlinkState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

}
