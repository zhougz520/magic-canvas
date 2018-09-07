import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
// import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_form_st_name?: string;      // tab名称
    selectOn?: string;              // 选中tab
    map_form_st?: boolean;          // 是否显示tab
    index?: number;
    tabSelected?: boolean;
    formState?: string;
    onChangeItem: (id: string) => void;
}

// tslint:disable:jsx-wrap-multiline
// tslint:disable:jsx-alignment
export class TabItemClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_form_st_name: '标签页',
        map_mi_sa: false,
        map_mi_line: false,
        map_form_st: '0',
        map_form_sti: undefined
    };

    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            defaultValue: props.map_form_st_name || ''
        };
    }

    public getItemStyle = (draggableStyle: any, isDragging: any) => ({

        // change background colour if dragging
        background: isDragging ? 'blue' : '',

        // styles we need to apply on draggables
        ...draggableStyle
    })

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_form_st_name } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '标题', pKey: 'map_form_st_name', pValue: map_form_st_name, pType: PropertiesEnum.INPUT_TEXT }
        );
        // propertyList = propertyList.push(
        //     {
        //         pTitle: '分区样式', pKey: 'map_form_st', pValue: map_form_st, pType: PropertiesEnum.SELECT,
        //         pList: [{ key: '0', value: '无边框' }, { key: '1', value: '有边框' }, { key: '2', value: '标签页显示' }]
        //     }
        // );
        // 组件属性整理
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }
    public render() {
        const { map_form_st_name, tabSelected, formState, selectedId, id } = this.props;
        // 如果分区状态为2，则以标签页的形式显示
        // 如果分区状态为1，则以标题的形式显示
        const showItem = formState === '2' ?
            <span className="tab-text" onClick={this.onChangeItem}>
                {map_form_st_name}
            </span>
            :
            <div className={`newTab-title`} style={{ display: `${formState !== '2' && tabSelected ? 'block' : 'none'}` }}>
                {map_form_st_name}
            </div>;

        return (
            <div
                style={{ float: 'left' }}
                ref={(ref) => this.com = ref}
                onMouseDown={this.selectedCom}
                className={`${formState === '2' ? ` newTab ${tabSelected ? ' newTabOn' : ''}` : ''} ${selectedId === id ? 'map-select-open' : ''}`}
            >
                {showItem}
            </div>
        );
    }
    private onChangeItem = (e: any) => {
        this.props.onChangeItem(this.props.id);
        this.selectedCom(e);
    }
}
export const TabItem = TabItemClass;
