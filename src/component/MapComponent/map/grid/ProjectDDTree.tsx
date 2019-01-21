import * as React from 'react';
// import { MapComponent, IBaseProps } from '../../index';
import { Select } from 'antd';
// import { MaskLayer } from '../../../BaseComponent/mask/MaskLayer';
import { MapConsumer } from '../MapConsumer';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../../IBaseProps';
// import { IBaseState } from '../../IBaseState';
import { MapComponent } from '../../MapComponent';

import { OrderedSet, List } from 'immutable';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_pddt_txt?: string;
    map_pddt_o?: string[];
}

export class ProjectDDTreeClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_pddt_txt: '组织架构',
        map_pddt_o: [],
        selectedId: undefined
    };

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            ...props
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_pddt_txt, map_pddt_o } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '控件名称', pKey: 'map_pddt_txt', pValue: map_pddt_txt, pType: PropertiesEnum.INPUT_TEXT }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件名称', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        // 字段设置
        propertyList = propertyList.push(
            { pTitle: '选项', pKey: 'map_pddt_o', pValue: map_pddt_o, pType: PropertiesEnum.INPUT_LIST }
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
        return this.props.map_pddt_txt;
    }

    public render() {
        const { map_pddt_txt, map_pddt_o, selectedId, id } = this.props;

        const options: any[] = [];
        if (map_pddt_o !== undefined) {
            map_pddt_o.map((mi: string, index: number) => {
                options.push(
                    <Select.Option key={index} value={mi}>{mi}</Select.Option>
                );
            });
        }

        return (
            <table
                onMouseDown={this.selectedCom}
                className={`csr-pc-map-app-project ${selectedId === id ? 'map-selected' : ''}`}
                ref={(ref) => this.com = ref}
                style={{ width: '100%' }}
            >
                <tbody>
                    <tr>
                        <td style={{ width: '75px', fontFamily: '宋体' }}>
                            <b style={{ color: '#66666' }}>{map_pddt_txt}</b>
                        </td>
                        <td>
                            <div className="first-page">
                                {/* <MaskLayer id={id} /> */}
                                <Select
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    onChange={this.onProjectValueChange}
                                >
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
export const ProjectDDTree = MapConsumer(ProjectDDTreeClass);
