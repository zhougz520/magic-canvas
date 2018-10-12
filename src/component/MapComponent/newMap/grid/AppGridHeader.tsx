import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';

import { OrderedSet, List } from 'immutable';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridHeaderProps extends IBaseProps {
    map_gh_txt?: string;        // 列名称
    map_gh_width?: number;      // 列宽
    map_gh_seq?: boolean;       // 允许排序
    map_gh_req?: boolean;       // 必填
    map_gh_align?: 'left' | 'center' | 'right';     // 对齐方式
    map_gh_dataType?: 'txt' | 'input' | 'number' | 'date' | 'select' | 'radio' | 'link' | 'lookup';     // 数据类型
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridHeaderState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppGridHeader extends MapComponent<IAppGridHeaderProps, IAppGridHeaderState> {
    static defaultProps = {
        map_gh_txt: '文本',
        map_gh_width: 60,
        map_gh_seq: false,
        map_gh_req: false,
        map_gh_align: 'left',
        map_gh_dataType: 'txt'
    };

    constructor(props: IAppGridHeaderProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
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
        const { map_gh_txt, map_gh_width, map_gh_seq, map_gh_req, map_gh_align, map_gh_dataType } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '列名称', pKey: 'map_gh_txt', pValue: map_gh_txt, pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '列宽', pKey: 'map_gh_width', pValue: map_gh_width, pType: PropertiesEnum.INPUT_NUMBER },
            { pTitle: '允许排序', pKey: 'map_gh_seq', pValue: map_gh_seq, pType: PropertiesEnum.SWITCH },
            { pTitle: '必填', pKey: 'map_gh_req', pValue: map_gh_req, pType: PropertiesEnum.SWITCH },
            { pTitle: '对齐方式', pKey: 'map_gh_align', pValue: map_gh_align, pType: PropertiesEnum.SELECT, pList: [{ key: 'left', value: '左对齐' }, { key: 'center', value: '居中' }, { key: 'right', value: '右对齐' }] },
            // tslint:disable-next-line:max-line-length
            { pTitle: '数据类型', pKey: 'map_gh_dataType', pValue: map_gh_dataType, pType: PropertiesEnum.SELECT, pList: [{ key: 'txt', value: '文本' }, { key: 'input', value: '普通输入' }, { key: 'number', value: '数字输入' }, { key: 'date', value: '日期选择' }, { key: 'select', value: '下拉框' }, { key: 'radio', value: '复选' }, { key: 'link', value: '超链接' }, { key: 'lookup', value: '弹出选择' }] }
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
        return this.props.map_gh_txt;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_gh_txt'] = value;

        return obj;
    }

    render() {
        const { map_gh_txt, map_gh_width, map_gh_seq, map_gh_req, map_gh_align, selectedId, id, doChildDbClickToEdit, index } = this.props;
        const { hidden } = this.state;

        return (
            <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                {
                    (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <td
                            ref={(ref) => this.com = ref}
                            className={`map-grid-headerCell ${selectedId === id ? 'map-select-open' : ''}`}
                            style={{ width: `${map_gh_width}px`, textAlign: map_gh_align }}
                            onMouseDown={this.selectedCom}
                        >
                            <div
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
                            >
                                <div className="map-grid-headerCell-outer">
                                    <div className="map-grid-headerCell-inner map-grid-headerCell-nowrap">
                                        <label
                                            ref={(ref) => this.editCom = ref}
                                            style={{
                                                visibility: hidden ? 'hidden' : 'visible',
                                                color: map_gh_req ? 'red' : undefined
                                            }}
                                            onDoubleClick={doChildDbClickToEdit}
                                        >
                                            {map_gh_txt}
                                            {
                                                map_gh_seq ? (<span className="map-grid-sortIcon" />) : null
                                            }
                                        </label>
                                    </div>
                                </div>
                                {/* </Droppable> */}
                                {provided.placeholder}
                            </div >
                        </td>
                    )
                }
            </Draggable >
        );
    }
}
