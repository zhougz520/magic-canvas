import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import * as DragStyle from '../DragStyle';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
import { GlobalUtil } from '../../../util';

import { OrderedSet, List } from 'immutable';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_form_st_name?: string;      // tab名称
    selectOn?: string;              // 选中tab
    map_form_st?: boolean;          // 是否显示tab
    index?: number;
    onChangeItem: (id: string) => void;
}

export class TabItem extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_form_st_name: '标签页',
        map_mi_sa: false,
        map_mi_line: false,
        map_form_sti: undefined
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
            map_form_st_name
        } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '控件名称', pKey: 'map_form_st_name', pValue: map_form_st_name, pType: PropertiesEnum.INPUT_TEXT }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件名称', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 获取组件文本
     */
    public getRichChildNode = (): any => {
        return this.props.map_form_st_name;
    }

    /**
     * 删除子组件
     */
    public deleteComponentsById = (): boolean => {
        const cid: string = this.props.selectedId as string;
        const state = this.props.stateData;
        if (GlobalUtil.isEmptyString(cid) || GlobalUtil.isUndefined(cid)) {
            return false;
        }
        if (GlobalUtil.isEmptyString(state) || GlobalUtil.isUndefined(state)) return false;

        const parent = this.findComponentParent(state, cid as string);
        if (!GlobalUtil.isUndefined(parent)) {
            const idx = parent.findIndex((com: any) => com.p.id === cid);
            if (idx >= 0) {
                parent.splice(idx, 1);
            }
        }
        const parentId = cid.substring(0, cid.lastIndexOf('.'));
        this.props.updateProps(parentId, { p: { components: parent },  map_form_sti: undefined});

        return true;
    }

    public render() {
        const { map_form_st_name, id, selectedId, index, selectOn } = this.props;

        const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
                className={`${id === selectedId ? ' map-selected' : ''}`}
            >
                <span
                    className={`tab${id === selectOn ? ' tabOn' : ''}`}
                >
                    {map_form_st_name}
                </span>
                {provided.placeholder}
            </div >
        );

        return (
            <div ref={(ref) => this.com = ref} onMouseDown={this.onChangeItem} className={`container`}>
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {initDrag}
                </Draggable>
            </div>
        );
    }
    private onChangeItem = (e: any) => {
        this.props.onChangeItem(this.props.id);
        this.selectedCom(e);
    }
}
