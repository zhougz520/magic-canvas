import * as React from 'react';
import { BaseComponent, BaseStyle, IBaseProps, IBaseState } from '../../BaseComponent';
import { SelectorState } from './SelectorState';
import { Select as AntSelector } from 'antd';
import { BoxType } from '../../util/AnchorPoint';
import { Map, List } from 'immutable';
import { PropertiesEnum } from '../../config';
// import { SelectValue } from 'antd/lib/select';
// import { ReactElement } from 'react';

const Option = AntSelector.Option;
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Selector extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new SelectorState())
        };
    }

    /**
     * 重写basecomponent方法, 设置此组件的类型
     */
    public getType(): string {
        return BoxType.BarType;
    }

    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '选项',
                    pKey: 'options',
                    pValue: this.getCustomState().getOptions(),
                    pType: PropertiesEnum.INPUT_OBJECT_LIST
                }, {
                    pTitle: '选中值',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '默认选中值',
                    pKey: 'defaultValue',
                    pValue: this.getCustomState().getDefaultValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '占位符',
                    pKey: 'placeholder',
                    pValue: this.getCustomState().getPlaceholder(),
                    pType: PropertiesEnum.INPUT_STRING
                }
            ];
    }

    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: SelectorState = SelectorState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '选项',
                    pKey: 'options',
                    pValue: this.getCustomState().getOptions(),
                    pType: PropertiesEnum.INPUT_OBJECT_LIST
                }, {
                    pTitle: '选中值',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '默认选中值',
                    pKey: 'defaultValue',
                    pValue: this.getCustomState().getDefaultValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '占位符',
                    pKey: 'placeholder',
                    pValue: this.getCustomState().getPlaceholder(),
                    pType: PropertiesEnum.INPUT_STRING
                }
            ];
    }

    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newInputState: SelectorState = SelectorState.set(this.getCustomState(), properties);

        this.setCustomState(newInputState);
    }

    render() {
        const optionsList: List<Map<any, any>> = this.getCustomState().getOptions();
        // tslint:disable-next-line:no-shadowed-variable
        const optionElem = (optionsList: List<Map<any, any>>) => {
            const res = [];
            for (let i = 0; i < optionsList.size; i++) {
                res.push(
                    <Option
                         key={i}
                        //  value={i}
                    >
                         {optionsList.toArray()[i].get('label')}
                    </Option>);
            }

            return res;
        };

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                // onClick={this.onClick}
            >
                <AntSelector
                    disabled={this.getCustomState().getDisable()}
                    placeholder={this.getCustomState().getPlaceholder()}
                    style={{ width: this.getSizeState().getWidth(), height: this.getSizeState().getHeight() }}
                    value={this.getCustomState().getValue()}
                    defaultValue={this.getCustomState().getDefaultValue()}
                    // onChange={this.handleChange}
                >
                    {optionElem(optionsList)}
                </AntSelector>

            </div>
        );
    }

    // handleChange = (value: any) => {
    //     console.log(`selected ${value}`);
    // }

    // private onClick = () => {
    //     const newSelectorState: SelectorState = SelectorState.set(
    //         this.getCustomState(),
    //         {
    //             placeholder: 'this is a new placeholder'
    //         }
    //     );

    //     this.setCustomState(newSelectorState);
    // }

}
