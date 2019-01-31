import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { Dropdown, Menu, Icon } from 'antd';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { MaskLayer } from '../../../BaseComponent/mask/MaskLayer';
import * as DragStyle from '../DragStyle';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
import { OrderedSet, List } from 'immutable';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_mi_txt?: string;
    map_mi_dd?: string[];
    map_mi_si?: boolean;
    map_mi_ico?: string;
    map_mi_sa?: boolean;
    index?: number;
    data: any;
    map_mi_line?: boolean;
}

export class AppFormMenuItem extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_mi_txt: '按钮',
        map_mi_sa: false,
        map_mi_line: false,
        map_mi_dd: []
    };

    constructor(props: any, context?: any) {
        super(props, context);
    }

    public getItemStyle = (draggableStyle: any, isDragging: any) => ({

        // change background colour if dragging
        background: isDragging ? DragStyle.BaseDragStyle.background : '',

        // styles we need to apply on draggables
        ...draggableStyle
    })

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const {
            map_mi_txt,
            map_mi_sa,
            map_mi_line,
            map_mi_dd
        } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 属性列表
        propertyList = propertyList.push(
            { pTitle: '控件名称', pKey: 'map_mi_txt', pValue: map_mi_txt, pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '下拉箭头', pKey: 'map_mi_sa', pValue: map_mi_sa, pType: PropertiesEnum.SWITCH },
            { pTitle: '分割线', pKey: 'map_mi_line', pValue: map_mi_line, pType: PropertiesEnum.SWITCH }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '属性列表', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        // 子菜单
        propertyList = propertyList.push(
            { pTitle: '子菜单', pKey: 'map_mi_dd', pValue: map_mi_dd, pType: PropertiesEnum.INPUT_LIST }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '菜单列表', groupKey: 'exterior', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        console.log('map_mi_txt', this.props.map_mi_txt);

        return this.props.map_mi_txt;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        console.log('value', value);
        const obj: any = {};
        obj.map_mi_txt = value;

        return obj;
    }

    public render() {
        const { map_mi_txt, map_mi_dd, map_mi_ico, map_mi_si, map_mi_sa, selectedId, id, index, map_mi_line } = this.props;

        const dropDownMenu: any[] = [];
        if (map_mi_dd !== undefined) {
            let idx = 0;
            map_mi_dd.map((mi: string) => {
                dropDownMenu.push(
                    mi === '-' ?
                        <Menu.Divider key={idx} /> :
                        <Menu.Item key={idx}>{mi}</Menu.Item>
                );
                idx++;
            });
        }
        const menu = (
            <Menu>
                {dropDownMenu}
            </Menu>
        );
        const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
            >
                <Dropdown overlay={menu} trigger={['click']}>
                    <div
                        className={`menu-item ${selectedId === id ? 'map-selected' : ''}`}
                    >
                        <span className="line" style={{ display: map_mi_line ? `block` : `none` }}>|</span>
                        {map_mi_txt}
                        {map_mi_si ? (<div className={`ico ${map_mi_ico}`} />) : ''}
                        <Icon
                            type="caret-down"
                            className="dropDownArrow"
                            style={{ display: map_mi_sa ? `block` : `none` }}
                        />
                    </div>
                </Dropdown>
                {provided.placeholder}
            </div >
        );

        return (
            <div
                onMouseDown={this.selectedCom}
                ref={(ref) => this.com = ref}
            >
                <MaskLayer id={id} />
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {initDrag}
                </Draggable>
            </div>
        );
    }
}
