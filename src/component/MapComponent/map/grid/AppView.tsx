import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { Select } from 'antd';
import { MaskLayer } from '../../../BaseComponent/mask/MaskLayer';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { OrderedSet, List } from 'immutable';

const Option = Select.Option;

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_v_txt?: string;
    map_v_o?: any;
}

export class AppView extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_v_txt: '视图',
        map_v_o: []
    };

    constructor(props: any, context?: any) {
        super(props, context);
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const {
            map_v_txt,
            map_v_o
        } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '控件名称', pKey: 'map_v_txt', pValue: map_v_txt, pType: PropertiesEnum.INPUT_TEXT }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件名称', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        // 字段设置
        propertyList = propertyList.push(
            { pTitle: '选项', pKey: 'map_v_o', pValue: map_v_o, pType: PropertiesEnum.INPUT_LIST }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '字段设置', groupKey: 'field', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.props.map_v_txt;
    }

    public render() {
        const { map_v_txt, map_v_o, selectedId, id } = this.props;
        let arrOption = [];
        if (map_v_o instanceof Array) {
            arrOption = map_v_o;
        } else {
            arrOption = map_v_o === undefined ? [''] : map_v_o.replace(/<br>/g, '\r\n').split(/\r?\n/);
        }
        const options: any[] = [];
        if (arrOption !== undefined) {
            arrOption.map((mi: string) => {
                options.push(
                    <Option value={mi} key={mi}>{mi}</Option>
                );
            });
        }

        return (
            <table
                onMouseDown={this.selectedCom}
                className={`csr-pc-map-app-view ${selectedId === id ? 'map-selected' : ''}`}
                ref={(ref) => this.com = ref}
                style={{ width: '100%' }}
            >
                <tbody>
                    <tr>
                        <td style={{ width: '75px', fontFamily: '宋体' }}>
                            <b style={{ color: '#66666' }}>{map_v_txt}</b>
                        </td>
                        <td>
                            <MaskLayer id={id} />
                            <div className="first-page">
                                <Select style={{ width: '100%' }}>
                                    {options}
                                </Select>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    public onProjectValueChange = (value: string) => {
        this.setState({
            projectValue: value
        });
    }
}
