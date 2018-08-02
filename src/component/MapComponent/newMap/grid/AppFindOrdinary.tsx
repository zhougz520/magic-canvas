import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';

import { Input, Button } from 'antd';
import { OrderedSet, List } from 'immutable';

export interface IAppFindOrdinaryProps extends IBaseProps {
    map_fo_search?: boolean;    // 开启搜索
    map_fo_o?: string[];        // 显示数据
}

// tslint:disable-next-line:no-empty-interface
export interface IAppFindOrdinaryState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppFindOrdinary extends MapComponent<IAppFindOrdinaryProps, IAppFindOrdinaryState> {
    static defaultProps = {
        map_fo_search: false,
        map_fo_o: []
    };

    constructor(props: IAppFindOrdinaryProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_fo_o } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '查询字段', pKey: 'map_fo_o', pValue: map_fo_o, pType: PropertiesEnum.INPUT_LIST }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    render() {
        const { map_fo_search, map_fo_o, selectedId, id } = this.props;

        return (
            <div
                className={`search-item searchbox-quickfind ${selectedId === id ? 'map-select-open' : ''}`}
                onMouseDown={this.selectedCom}
            >
                <Input
                    style={{ width: '220px' }}
                    placeholder={`输入${map_fo_o ? map_fo_o.join('、') : ''}`}
                />
                {
                    map_fo_search ?
                        <Button
                            type="primary"
                            style={{
                                height: '30px',
                                width: '62px',
                                borderRadius: '3px',
                                backgroundColor: '#34A6F8',
                                borderColor: '#34A6F8',
                                marginLeft: '6px'
                            }}
                        >
                            搜索
                        </Button> : ''
                }
            </div>
        );
    }
}
