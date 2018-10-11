import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';

import { OrderedSet, List } from 'immutable';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridViewItemProps extends IBaseProps {
    map_gvi_txt?: string;           // 视图名称
    map_gvi_selected?: boolean;     // 选中视图
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridViewItemState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppGridViewItem extends MapComponent<IAppGridViewItemProps, IAppGridViewItemState> {
    static defaultProps = {
        map_gvi_txt: '新建视图',
        map_gvi_selected: false
    };

    constructor(props: IAppGridViewItemProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_gvi_txt, map_gvi_selected } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '视图名称', pKey: 'map_gvi_txt', pValue: map_gvi_txt, pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '是否选中', pKey: 'map_gvi_selected', pValue: map_gvi_selected, pType: PropertiesEnum.SWITCH }
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
        return this.props.map_gvi_txt;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_gvi_txt'] = value;

        return obj;
    }

    render() {
        const { map_gvi_txt, map_gvi_selected, selectedId, id, doChildDbClickToEdit } = this.props;
        const { hidden } = this.state;

        return (
            <li
                className={`mc-listheader-viewlist-buttongroup__item ${map_gvi_selected ? 'is-selected' : ''} ${selectedId === id ? 'map-select-open' : ''}`}
                onMouseDown={this.selectedCom}
            >
                <label
                    ref={(ref) => this.editCom = ref}
                    style={{
                        visibility: hidden ? 'hidden' : 'visible'
                    }}
                    onDoubleClick={doChildDbClickToEdit}
                >
                    {map_gvi_txt}
                </label>
            </li>
        );
    }
}
