import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { OrderedSet, List } from 'immutable';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import * as DragStyle from '../DragStyle';

export interface IMapProps extends IBaseProps {
    map_form_st_name?: string;      // tab名称
    tabSelected?: boolean;
    formState?: string;
    onChangeItem: (id: string) => void;
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref */
export class TabItemClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_form_st_name: '标签页'
    };

    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            hidden: false
        };
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
        const { map_form_st_name } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '标题', pKey: 'map_form_st_name', pValue: map_form_st_name, pType: PropertiesEnum.INPUT_TEXT }
        );
        // 组件属性整理
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
        return this.props.map_form_st_name;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_form_st_name'] = value;

        return obj;
    }

    public render() {
        const { hidden } = this.state;
        const { map_form_st_name, tabSelected, formState, selectedId, id, index, doChildDbClickToEdit } = this.props;
        // 如果分区状态为2，则以标签页的形式显示
        // 如果分区状态为1，则以标题的形式显示
        const showItem = (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                className={`${formState === '2' ? ` newTab ${tabSelected ? ' newTabOn' : ''}` : ''} ${selectedId === id ? 'map-select-open' : ''}`}
                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
            >
                {
                    formState === '2' ?
                        <span className="tab-text" onClick={this.onChangeItem}>
                            <label
                                ref={(ref) => this.editCom = ref}
                                style={{
                                    visibility: hidden ? 'hidden' : 'visible'
                                }}
                                onDoubleClick={doChildDbClickToEdit}
                            >
                                {map_form_st_name}
                            </label>
                        </span>
                        :
                        <div className={`newTab-title`} style={{ display: `${formState !== '2' && tabSelected ? 'block' : 'none'}` }}>
                            <label
                                ref={(ref) => this.editCom = ref}
                                style={{
                                    visibility: hidden ? 'hidden' : 'visible'
                                }}
                                onDoubleClick={doChildDbClickToEdit}
                            >
                                {map_form_st_name}
                            </label>
                        </div>
                }
            </div>

        );

        return (
            <div
                style={{ float: 'left' }}
                ref={(ref) => this.com = ref}
                onMouseDown={this.selectedCom}
            >
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {showItem}
                </Draggable>
            </div>
        );
    }
    private onChangeItem = (e: any) => {
        this.props.onChangeItem(this.props.id);
        this.selectedCom(e);
    }
}
export const TabItem = TabItemClass;
