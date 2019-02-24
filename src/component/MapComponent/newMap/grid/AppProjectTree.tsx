import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../../IBaseProps';
import { IBaseState } from '../../IBaseState';
import { MapComponent } from '../../MapComponent';

import { Select } from 'antd';
import { OrderedSet, List } from 'immutable';

export interface IAppProjectTreeProps extends IBaseProps {
    map_pt_txt?: string;        // 标题
    map_pt_search?: boolean;    // 开启搜索
    map_pt_o?: string[];        // 显示数据
}

// tslint:disable-next-line:no-empty-interface
export interface IAppProjectTreeState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppProjectTree extends MapComponent<IAppProjectTreeProps, IAppProjectTreeState> {
    static defaultProps = {
        map_pt_txt: '项目',
        map_pt_search: true,
        map_pt_o: []
    };

    constructor(props: IAppProjectTreeProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_pt_txt } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '标题', pKey: 'map_pt_txt', pValue: map_pt_txt, pType: PropertiesEnum.INPUT_TEXT }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.props.map_pt_txt;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_pt_txt'] = value;

        return {
            editObj: obj,
            pKey: 'map_pt_txt',
            groupKey: 'mapProps'
        };
    }

    render() {
        const { map_pt_txt, map_pt_o, selectedId, id, doChildDbClickToEdit } = this.props;
        const { hidden } = this.state;

        const dropDownMenu: any[] = [];
        if (map_pt_o !== undefined) {
            let idx = 0;
            map_pt_o.map((pt) => {
                dropDownMenu.push(
                    <Select.Option key={idx} value={pt}>{pt}</Select.Option>
                );
                idx++;
            });
        }

        return (
            <div
                className={`search-item ${selectedId === id ? 'map-select-open' : ''}`}
                onMouseDown={this.selectedCom}
            >
                <label
                    ref={(ref) => this.editCom = ref}
                    style={{
                        visibility: hidden ? 'hidden' : 'visible'
                    }}
                    onDoubleClick={doChildDbClickToEdit}
                >
                    {map_pt_txt}
                </label>
                <div className="item-content" style={{ width: '160px' }}>
                    <Select style={{ width: '100%' }}>
                        {dropDownMenu}
                    </Select>
                </div>
            </div>
        );
    }
}
