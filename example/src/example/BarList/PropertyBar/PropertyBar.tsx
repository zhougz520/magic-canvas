import * as React from 'react';
import { PropertiesEnum, CommandMap, IPropertyGroup, IProperty } from '../../../../../src';
import { List, OrderedSet, fromJS } from 'immutable';
import { SketchPicker } from 'react-color';
import { Input, Switch, Slider, Collapse, Popover, Select, InputNumber } from 'antd';
import { IpList, IFilterList } from '../../../../../src/component/UniversalComponents/model/types';
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
        this.setState({
            propsGroup: propertyGroup
        });
        propertyGroup.map(
            (propGroup: IPropertyGroup) => {
                propGroup.propertyList.map(
                    (property: IProperty) => {
                        if (property.pFilterCondition && property.pFilterCondition.length > 0) {
                            property.pFilterCondition.forEach( (vif: any) => {
                                if (property.pValue === vif.pFilterValue) {
                                    switch (vif.pFilterFun) {
                                        case 'isShow':
                                            const e: any = {
                                                pFilterKey: vif.pFilterKey,
                                                pFilterValue: vif.pFilterValue
                                            };
                                            this.isShow(e, property.pValue, propertyGroup);
                                            break;
                                    }
                                }
                            });
                        }
                    }
                );
            }
        );
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
        let groupLineNum: string = '';
        const activeKeys: string[] = [];
        propsGroup.map(
            (propGroup: IPropertyGroup) => {
                switch (propGroup.colNum) {
                    case 1:
                        groupLineNum = 'column1';
                        break;
                    case 2:
                        groupLineNum = 'column2';
                        break;
                }
                const groupRequire: boolean = (!propGroup.hasOwnProperty('groupRequire') || (propGroup.hasOwnProperty('groupRequire') && propGroup.groupRequire === true)) ? true : false;
                if (groupRequire) {
                    group.push(
                        <Collapse.Panel header={propGroup.groupTitle} key={propGroup.groupKey} className={groupLineNum}>
                            {this.buildPropertyList(propGroup.propertyList, propGroup.groupKey)}
                        </Collapse.Panel>
                    );
                    if (propGroup.isActive === true) activeKeys.push(propGroup.groupKey);
                }
            }
        );

        return (
            <Collapse bordered={false} activeKey={activeKeys} onChange={(key) => this.changePropertyActive(key)}>
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
        const pRequire: boolean = (!property.hasOwnProperty('pRequire') || (property.hasOwnProperty('pRequire') && property.pRequire === true)) ? true : false;
        switch (property.pType) {
            case PropertiesEnum.INPUT_TEXT:
                element = pRequire ? (
                    <div className="props-col-1" key={property.pKey}>
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
                ) : null;
                break;
            case PropertiesEnum.INPUT_TEXTAREA:
                element = pRequire ? (
                    <div className="props-col-cross" key={property.pKey}>
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
                ) : null;
                break;
            case PropertiesEnum.INPUT_NUMBER:
                element = pRequire ? (
                    <div className="props-col-1" key={property.pKey}>
                        {property.pTitle}
                        <InputNumber
                            size="small"
                            value={property.pValue}
                            id={`${groupKey}.${property.pKey}`}
                            onBlur={(e) => this.handleInputText(e, 'blur')}
                            min={property.pMin ? property.pMin : -10000}
                            max={property.pMax ? property.pMax : 10000}
                            onChange={(value) => typeof(value) === 'number' ? this.changePropertyValue(property, value, `${groupKey}.${property.pKey}`) : {}}
                        />
                    </div>
                ) : null;
                break;
            case PropertiesEnum.INPUT_LIST:
                element = pRequire ? (
                    <div className="props-col-cross" key={property.pKey}>
                        {property.pTitle}
                        <TextArea
                            rows={4}
                            autosize={false}
                            value={property.pValue.join('\n')}
                            id={`${groupKey}.${property.pKey}`}
                            onBlur={(e) => this.handleInputList(e)}
                            onChange={(e) => this.changePropertyValue(property, e.target.value.split(/[\r\n]/), `${groupKey}.${property.pKey}`)}
                        />
                    </div>
                ) : null;
                break;
            case PropertiesEnum.SWITCH:
                element = pRequire ? (
                    <div className="props-col-1 group-end" key={property.pKey}>
                        {property.pTitle}
                        <Switch
                            size="small"
                            checked={property.pValue}
                            onChange={(value) => this.handleSwitch(value, `${groupKey}.${property.pKey}`, property)}
                        />
                    </div>
                ) : null;
                break;
            case PropertiesEnum.COLOR_PICKER:
                element = pRequire ? (
                    <div className="props-col-1" key={property.pKey}>
                        {property.pTitle}
                        <Popover placement="left" content={this.buildColorPicker(property.pValue, `${groupKey}.${property.pKey}`, property)} trigger="hover">
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
                ) : null;
                break;
            case PropertiesEnum.SLIDER:
                element = pRequire ? (
                    <div className="props-col-1" key={property.pKey}>
                        {property.pTitle}
                        <Slider
                            min={0}
                            max={10}
                            value={property.pValue}
                            onChange={(value) => this.changePropertyValue(property, value, `${groupKey}.${property.pKey}`)}
                            onAfterChange={(value) => this.handleSlider(value, `${groupKey}.${property.pKey}`)}
                        />
                    </div>
                ) : null;
                break;
            case PropertiesEnum.SELECT:
                element = pRequire ? (
                    <div className="props-col-1" key={property.pKey}>
                        {property.pTitle}
                        <Select
                            size="small"
                            value={property.pValue}
                            onChange={(value) => this.handleSelect(value, `${groupKey}.${property.pKey}`, property)}
                        >
                            {
                                property.pList !== undefined ?
                                    property.pList.map((pL: IpList, zIndex: number) => {
                                        return <Select.Option key={zIndex} value={`${pL.key}`}>{`${pL.value}`}</Select.Option>;
                                    }) : ''
                            }
                        </Select>
                    </div>
                ) : null;
                break;
        }

        return element;
    }

    /**
     * 获取颜色选择器
     */
    private buildColorPicker = (pValue: any, pId: any, e: any): JSX.Element => {
        const colorPicker = (
            <SketchPicker
                color={pValue}
                onChangeComplete={(color) => this.handleColorPicker(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`, pId, e)}
            />
        );

        return colorPicker;
    }

    /**
     * 属性值修改重新渲染
     */
    private changePropertyValue = (e: any, value: any = e.target.value, id: any = e.target.id, type?: string) => {
        const oldPropsGroup: OrderedSet<IPropertyGroup> = this.state.propsGroup;
        const pValue = value;
        const pKey = id.split('.')[1];
        const groupKey = id.split('.')[0];
        const pFilterCondition: any[] = e.pFilterCondition;
        // 执行过滤程序
        if (pFilterCondition && pFilterCondition.length > 0) {
            for (let a = 0; a < pFilterCondition.length; a++) {
                if (pFilterCondition[a].pFilterFun === 'isShow') {
                    this.isShow(pFilterCondition[a], pValue);
                }
                if (type && type === 'select' && pFilterCondition[a].pFilterValue === pValue) break;
            }
        }

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
    private handleSwitch = (pValue: any, pId: any, e: any) => {
        const pKey = pId.split('.')[1];
        this.changePropertyValue(e, pValue, pId);
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
    private handleColorPicker = (pValue: any, pId: any, e: any) => {
        const pKey = pId.split('.')[1];

        this.changePropertyValue(e, pValue, pId);
        this.fireCommand(CommandMap.COM_SETPROPS, { pKey, pValue });
    }

    /**
     * Select值改变
     */
    private handleSelect = (pValue: any, pId: any, e: any) => {
        const pKey = pId.split('.')[1];

        this.changePropertyValue(e, pValue, pId, 'select');
        this.fireCommand(CommandMap.COM_SETPROPS, { pKey, pValue });
    }

    /**
     * propsGroup控制面板显示隐藏联动
     */
    private isShow = (e: any, pValue: any, pGroup?: any) => {
        const propsGroupList: OrderedSet<IPropertyGroup> = pGroup ? pGroup : this.state.propsGroup;
        const pFilterKey: IFilterList[] = e.pFilterKey;
        const pFilterValue: any = e.pFilterValue;
        const value: boolean = pValue === pFilterValue ? true : false;
        // 将所有显示置为隐藏
        propsGroupList.forEach((cs: any) => {
            if (cs.hasOwnProperty('groupRequire')) {
                cs.groupRequire = false;
            }
            cs.propertyList.forEach((item: any) => {
                if (item.hasOwnProperty('pRequire')) {
                    item.pRequire = false;
                }
            });
        });
        // 将过滤的组件设为显示
        pFilterKey.forEach((cs: any) => {
            propsGroupList.toList().update(
                (propsGroup: List<IPropertyGroup>) => {
                    if (!cs.pKey) {
                        propsGroup.find(
                            (propGroup: IPropertyGroup) => propGroup.groupKey === cs.groupKey
                        ).groupRequire = value;
                    } else {
                        propsGroup.find(
                            (propGroup: IPropertyGroup) => propGroup.groupKey === cs.groupKey
                        ).propertyList.update(
                            (list: List<IProperty>) => {
                                list.find(
                                    (p: IProperty) => p.pKey === cs.pKey
                                ).pRequire = value;

                                return list;
                            }
                        );
                    }

                    return propsGroup;
                }
            ).toOrderedSet();
        });

        this.setState({
            propsGroup: propsGroupList
        });
    }

    /**
     * Collapse的active值改变
     */
    private changePropertyActive = (allKey: string | string[]) => {
        const IallKey = fromJS(allKey).toList();
        let oldPropsGroup: OrderedSet<IPropertyGroup> = this.state.propsGroup;
        // 收起所有折叠面板
        oldPropsGroup = oldPropsGroup.toList().update(
            (propsGroup: List<IPropertyGroup>) => {
                propsGroup.map(
                    (item: IPropertyGroup) => {
                        item.isActive = false;
                    }
                );

                return propsGroup;
            }
        ).toOrderedSet();
        if (!IallKey.first()) {
            this.setState({
                propsGroup: oldPropsGroup
            });

            return;
        }
        // 展开激活折叠面板
        OrderedSet(IallKey).forEach((key: string) => {
            const newPropsGroup: OrderedSet<IPropertyGroup> = oldPropsGroup.toList().update(
                (propsGroup: List<IPropertyGroup>) => {
                    propsGroup.find(
                        (propGroup: IPropertyGroup) => propGroup.groupKey === key
                    ).isActive = true;

                    return propsGroup;
                }
            ).toOrderedSet();
            this.setState({
                propsGroup: newPropsGroup
            });
        });
    }
}
