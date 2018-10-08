import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';

import { Button, Dropdown, Menu, Icon } from 'antd';
import { OrderedSet, List } from 'immutable';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuItemDropdownProps extends IBaseProps {
    map_gmid_txt?: string;          // 按钮名称
    map_gmid_o?: string[];          // 下拉选项
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuItemDropdownState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppGridMenuItemDropdown extends MapComponent<IAppGridMenuItemDropdownProps, IAppGridMenuItemDropdownState> {
    static defaultProps = {
        map_gmid_txt: '新建',
        map_gmid_o: []
    };

    constructor(props: IAppGridMenuItemDropdownProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_gmid_txt, map_gmid_o } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '按钮名称', pKey: 'map_gmid_txt', pValue: map_gmid_txt, pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '子菜单', pKey: 'map_gmid_o', pValue: map_gmid_o, pType: PropertiesEnum.INPUT_LIST }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.props.map_gmid_txt;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_gmid_txt'] = value;

        return obj;
    }

    render() {
        const { map_gmid_txt, map_gmid_o, selectedId, id, doChildDbClickToEdit } = this.props;
        const { hidden } = this.state;
        const menu = (
            <Menu>
                {
                    map_gmid_o && map_gmid_o.map(
                        (val) => {
                            return (<Menu.Item key={val}>{val}</Menu.Item>);
                        }
                    )
                }
            </Menu>
        );

        return (
            <li
                style={{ display: 'inline-block' }}
                onMouseDown={this.selectedCom}
            >
                <Dropdown overlay={menu}>
                    <Button
                        className={`${selectedId === id ? 'map-select-open' : ''}`}
                        onDoubleClick={doChildDbClickToEdit}
                    >
                        <label
                            ref={(ref) => this.editCom = ref}
                            style={{
                                visibility: hidden ? 'hidden' : 'visible'
                            }}
                        >
                            {map_gmid_txt}<Icon type="down" />
                        </label>
                    </Button>
                </Dropdown>
            </li>
        );
    }
}