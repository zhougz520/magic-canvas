import * as React from 'react';
import { BaseComponent, BaseStyle, IBaseProps, IBaseState, SizeState, ISize, BaseState, ContentState } from '../../BaseComponent';
import { SelectorState } from './SelectorState';
import { Select as AntSelector } from 'antd';
import { BoxType } from '../../util/AnchorPoint';
import { Map, List } from 'immutable';
import { PropertiesEnum } from '../../config';

const Option = AntSelector.Option;
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Selector extends BaseComponent<IDemoProps, IBaseState> {
    // private com: any = null;
    com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new SelectorState())
        };
    }

    // /**
    //  * 重写basecomponent方法, 设置此组件的类型
    //  */
    public getType(): string {
        return BoxType.BarType;
    }

    componentDidUpdate() {
        // tslint:disable-next-line:no-console
        console.log(this.getSize());
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
                }
            ];
    }

    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newSelectorState: SelectorState = SelectorState.set(this.getCustomState(), properties);

        this.setCustomState(newSelectorState);
    }

    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}>  => {
        return [
                {
                    pTitle: '选项',
                    pKey: 'options',
                    pValue: this.getCustomState().getOptions(),
                    pType: PropertiesEnum.INPUT_OBJECT_LIST
                }, {
                    pTitle: '选中项',
                    pKey: 'value',
                    pValue: this.getCustomState().getValue(),
                    pType: PropertiesEnum.INPUT_STRING
                }, {
                    pTitle: '是否禁用',
                    pKey: 'disabled',
                    pValue: this.getCustomState().getDisabled(),
                    pType: PropertiesEnum.SWITCH
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

        const oldBorderWidth = this.getCustomState().getBorderWidth();
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newSelectorState: SelectorState = SelectorState.set(this.getCustomState(), properties);

        let sizeState: SizeState = this.getSizeState();
        if (pKey === 'borderWidth') {
            const size: ISize = this.getSize();
            const newSize: ISize = {
                width: size.width,
                height: size.height + (pValue - oldBorderWidth) * 2
            };
            sizeState = SizeState.create(newSize);
        }

        const oldContentState: ContentState = this.getBaseState().getCurrentContent();
        const newContentState: ContentState = oldContentState.merge({
            sizeState,
            customState: newSelectorState
        }) as ContentState;

        const oldBaseState: BaseState = this.getBaseState();
        const newBaseState: BaseState = BaseState.push(oldBaseState, newContentState);
        this.setBaseState(newBaseState);
    }

    public getComponentSettableCommands = (): string[] => {
        return ['Color', 'fontStyle', 'fontSize', 'fontWeight'];
    }

    render() {
        const optionsList: List<Map<any, any>> = this.getCustomState().getOptions();
        // tslint:disable-next-line:no-shadowed-variable
        const optionElem = (optionsList: List<Map<any, any>>) => {
            const res = [];
            for (let i = 0; i < optionsList.size; i++) {
                res.push(
                    <Option
                        key={optionsList.toArray()[i].get('label')}
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
                    // tslint:disable-next-line:jsx-no-multiline-js
                    style={{width: '100%', height: '100%', color: this.getCustomState().getFontColor(),
                        fontStyle: this.getCustomState().getFontStyle(), fontSize: this.getCustomState().getFontSize() + 'px',
                        fontWeight: this.getCustomState().getFontWeight(), backgroundColor: this.getCustomState().getBackgroundColor(), borderStyle: 'solid',
                        borderColor: this.getCustomState().getBorderColor(), borderWidth: this.getCustomState().getBorderWidth() + 'px'
                    }}
                    disabled={this.getCustomState().getDisabled()}
                    value={this.getCustomState().getValue()}
                >
                    {optionElem(optionsList)}
                </AntSelector>

            </div>
        );
    }
}
