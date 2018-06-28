import * as React from 'react';
import { PropertiesEnum, CommandMap, IPropertyGroup, IProperty } from '../../../../../src';
import { List, OrderedSet } from 'immutable';

import { SketchPicker } from 'react-color';
import { Input, Switch, Slider, Collapse, Popover } from 'antd';
const { TextArea } = Input;

export interface IPropertyProps {
    collapsed: boolean;
    titleBarCollapsed: boolean;
    // 发送命令
    onCommandEmitted: (cmd: any) => void;
    onPropsBarCollapse: (collapsed: boolean) => void;
}

export interface IPropertyState {
    propsGroup: OrderedSet<IPropertyGroup>;
}

export interface IPropertyComponent {
    setPropertyState: (propertyGroup: OrderedSet<IPropertyGroup>) => void;
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref jsx-no-multiline-js jsx-no-lambda */
export class PropertyBar extends React.PureComponent<IPropertyProps, IPropertyState> implements IPropertyComponent {
    constructor(props: IPropertyProps) {
        super(props);
        this.state = {
            propsGroup: OrderedSet()
        };
    }

    /**
     * 发射命令
     */
    fireCommand = (cmd: any, param: any = null) => {
        this.props.onCommandEmitted(
            {
                t: cmd,
                d: param
            }
        );
    }

    /**
     * 设置属性分组
     */
    setPropertyState = (propertyGroup: OrderedSet<IPropertyGroup>) => {
        this.setState(
            {
                propsGroup: propertyGroup
            });
    }

    /**
     * 折叠
     */
    onClick = () => {
        this.collapse(!this.props.collapsed);
    }

    collapse = (collapsed: boolean) => {
        this.props.onPropsBarCollapse(collapsed);
    }

    render() {
        const { collapsed, titleBarCollapsed } = this.props;

        return (
            <div
                className={`props-bar${collapsed ? ' collapsed' : ''}${titleBarCollapsed ? ' title-bar-collapsed' : ''}${' props-bar-show'}`}
                style={{ zIndex: 10 }}
            >
                {
                    collapsed ? null : (
                        <div className="bar">
                            {this.buildPropertyGroup()}
                        </div>
                    )
                }
                <div className="holder">
                    <div onClick={this.onClick}>折叠</div>
                </div>
            </div>
        );
    }

    /**
     * 构建属性分组
     */
    private buildPropertyGroup = () => {
        const { propsGroup } = this.state;
        const group: JSX.Element[] = [];

        propsGroup.map(
            (propGroup: IPropertyGroup) => {
                group.push(
                    <Collapse.Panel header={propGroup.groupTitle} key={propGroup.groupKey}>
                        {this.buildPropertyList(propGroup.propertyList, propGroup.groupKey)}
                    </Collapse.Panel>
                );
            }
        );

        return (
            <Collapse bordered={false} defaultActiveKey={['exterior']}>
                {group}
            </Collapse>
        );
    }

    /**
     * 构建属性列表
     */
    private buildPropertyList = (propertyList: List<IProperty>, groupKey: string) => {
        const list: JSX.Element[] = [];

        propertyList.map(
            (property: IProperty) => {
                const element: JSX.Element | null = this.buildPropertyElement(property, groupKey);
                if (element !== null) {
                    list.push(element);
                }
            }
        );

        return list;
    }

    /**
     * 构建属性元素
     */
    private buildPropertyElement = (property: IProperty, groupKey: string): JSX.Element | null => {
        let element: JSX.Element | null = null;

        switch (property.pType) {
            case PropertiesEnum.INPUT_TEXT:
                element = (
                    <div className="props-col-1 group-end" key={property.pKey}>
                        {property.pTitle}
                        <Input
                            type="text"
                            size="small"
                            value={property.pValue}
                            id={`${groupKey}.${property.pKey}`}
                            onBlur={(e) => this.handleInputText(e, 'blur')}
                            onPressEnter={(e) => this.handleInputText(e, 'enter')}
                            onChange={this.changePropertyValue}
                        />
                    </div>
                );
                break;
            case PropertiesEnum.INPUT_TEXTAREA:
                element = (
                    <div className="props-col-cross group-end" key={property.pKey}>
                        {property.pTitle}
                        <TextArea
                            rows={4}
                            autosize={false}
                            value={property.pValue}
                            id={`${groupKey}.${property.pKey}`}
                            onBlur={(e) => this.handleInputText(e, 'blur')}
                            onChange={this.changePropertyValue}
                        />
                    </div>
                );
                break;
            case PropertiesEnum.INPUT_NUMBER:
                element = (
                    <div className="props-col-1 group-end" key={property.pKey}>
                        {property.pTitle}
                        <Input
                            type="number"
                            size="small"
                            value={property.pValue}
                            id={`${groupKey}.${property.pKey}`}
                            onBlur={(e) => this.handleInputText(e, 'blur')}
                            onPressEnter={(e) => this.handleInputText(e, 'enter')}
                            onChange={this.changePropertyValue}
                        />
                    </div>
                );
                break;
            case PropertiesEnum.INPUT_LIST:
                element = (
                    <div className="props-col-cross group-end" key={property.pKey}>
                        {property.pTitle}
                        <TextArea
                            rows={4}
                            autosize={false}
                            value={property.pValue.join('\n')}
                            id={`${groupKey}.${property.pKey}`}
                            onBlur={(e) => this.handleInputList(e)}
                            onChange={(e) => this.changePropertyValue(e, e.target.value.split(/[\r\n]/))}
                        />
                    </div>
                );
                break;
            case PropertiesEnum.SWITCH:
                element = (
                    <div className="props-col-1 group-end" key={property.pKey}>
                        {property.pTitle}
                        <Switch
                            size="small"
                            checked={property.pValue}
                            onChange={(value) => this.handleSwitch(value, `${groupKey}.${property.pKey}`)}
                        />
                    </div>
                );
                break;
            case PropertiesEnum.COLOR_PICKER:
                element = (
                    <div className="props-col-1 group-end" key={property.pKey}>
                        {property.pTitle}
                        <Popover placement="left" content={this.buildColorPicker(property.pValue, `${groupKey}.${property.pKey}`)} trigger="click">
                            <div className="colorButton">
                                <div
                                    className="colorButton-inner"
                                    style={{
                                        background: property.pValue
                                    }}
                                />
                            </div>
                        </Popover>
                    </div>
                );
                break;
            case PropertiesEnum.SLIDER:
                element = (
                    <div className="props-col-1 group-end" key={property.pKey}>
                        {property.pTitle}
                        <Slider
                            min={0}
                            max={10}
                            value={property.pValue}
                            onChange={(value) => this.changePropertyValue(null, value, `${groupKey}.${property.pKey}`)}
                            onAfterChange={(value) => this.handleSlider(value, `${groupKey}.${property.pKey}`)}
                        />
                    </div>
                );
                break;
        }

        return element;
    }

    /**
     * 获取颜色选择器
     */
    private buildColorPicker = (pValue: any, pId: any): JSX.Element => {
        const colorPicker = (
            <SketchPicker
                color={pValue}
                onChangeComplete={(color) => this.handleColorPicker(color.hex, pId)}
            />
        );

        return colorPicker;
    }

    /**
     * 属性值修改重新渲染
     */
    private changePropertyValue = (e: any, value: any = e.target.value, id: any = e.target.id) => {
        const oldPropsGroup: OrderedSet<IPropertyGroup> = this.state.propsGroup;
        const pValue = value;
        const pKey = id.split('.')[1];
        const groupKey = id.split('.')[0];

        const newPropsGroup: OrderedSet<IPropertyGroup> = oldPropsGroup.toList().update(
            (propsGroup: List<IPropertyGroup>) => {
                propsGroup.find(
                    (propGroup: IPropertyGroup) => propGroup.groupKey === groupKey
                ).propertyList.update(
                    (list: List<IProperty>) => {
                        list.find(
                            (p: IProperty) => p.pKey === pKey
                        ).pValue = pValue;

                        return list;
                    }
                );

                return propsGroup;
            }
        ).toOrderedSet();

        this.setState({
            propsGroup: newPropsGroup
        });
    }

    /**
     * InputText值改变
     */
    private handleInputText = (e: any, type: 'enter' | 'blur') => {
        const pValue = e.target.value;
        const pKey = e.target.id.split('.')[1];

        switch (type) {
            case 'enter':
                // 把焦点移动到僚机，顺便触发当前文本框的onBlur
                this.fireCommand(CommandMap.WINGMAN_FOCUS);
                break;
            case 'blur':
                this.fireCommand(CommandMap.COM_SETPROPS, { pKey, pValue });
                break;
        }
    }

    /**
     * InputList值改变
     */
    private handleInputList = (e: any) => {
        const pValue = e.target.value.split(/[\r\n]/);
        const pKey = e.target.id.split('.')[1];
        this.fireCommand(CommandMap.COM_SETPROPS, { pKey, pValue });
    }

    /**
     * Switch值改变
     */
    private handleSwitch = (pValue: any, pId: any) => {
        const pKey = pId.split('.')[1];

        this.changePropertyValue(null, pValue, pId);
        this.fireCommand(CommandMap.COM_SETPROPS, { pKey, pValue });
    }

    /**
     * Slider值改变
     */
    private handleSlider = (pValue: any, pId: any) => {
        const pKey = pId.split('.')[1];

        this.fireCommand(CommandMap.COM_SETPROPS, { pKey, pValue });
    }

    /**
     * ColorPicker值改变
     */
    private handleColorPicker = (pValue: any, pId: any) => {
        const pKey = pId.split('.')[1];

        this.changePropertyValue(null, pValue, pId);
        this.fireCommand(CommandMap.COM_SETPROPS, { pKey, pValue });
    }
}
