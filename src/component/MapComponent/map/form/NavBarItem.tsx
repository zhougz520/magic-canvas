import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import * as DragStyle from '../DragStyle';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
import { GlobalUtil } from '../../../util';
import { OrderedSet, List } from 'immutable';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_form_sn_name?: string;      // 名称
    map_form_sn_icon?: string;      // 图标
    selectOn?: string;              // 选中
    map_form_sn?: boolean;          // 是否显示
    index: number;
    onChangeItem: (id: string) => void;
}

export class NavBarItem extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_form_sn_name: '标签页',
        map_form_sn_icon: '',
        map_form_sni: undefined,
        map_form_sn: true,
        selectOn: undefined,
        index: 0
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
            map_form_sn_name
        } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '控件名称', pKey: 'map_form_sn_name', pValue: map_form_sn_name, pType: PropertiesEnum.INPUT_TEXT }
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
        return this.props.map_form_sn_name;
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
        this.props.updateProps(parentId, { p: { components: parent },  map_form_sni: undefined});

        return true;
    }

    public render() {
        const { map_form_sn_name, id, selectedId, map_form_sn_icon, index, selectOn } = this.props;
        const initDrag = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
                className={`${id === selectedId ? ' map-selected' : ''}`}
            >
                <div className={`lbItem${id === selectOn ? ' lbOn' : ''}`} >
                    <div className={`ico ${map_form_sn_icon}`} />
                    {map_form_sn_name}
                </div>
                {provided.placeholder}
            </div >
        );

        return (
            <div ref={(ref) => this.com = ref} onMouseDown={this.onChangeItem} className="container">
                <Draggable key={id} draggableId={id} index={index}>
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
