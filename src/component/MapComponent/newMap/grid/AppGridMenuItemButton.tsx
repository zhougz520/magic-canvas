import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';

import { Button } from 'antd';
import { OrderedSet, List } from 'immutable';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { MaskLayer } from '../../../BaseComponent/mask/MaskLayer';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuItemButtonProps extends IBaseProps {
    map_gmib_txt?: string;          // 按钮名称
    map_gmib_hl?: boolean;          // 按钮高亮
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridMenuItemButtonState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppGridMenuItemButton extends MapComponent<IAppGridMenuItemButtonProps, IAppGridMenuItemButtonState> {
    static defaultProps = {
        map_gmib_txt: '新建',
        map_gmib_hl: false
    };

    constructor(props: IAppGridMenuItemButtonProps, context?: any) {
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
        const { map_gmib_txt, map_gmib_hl } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '按钮名称', pKey: 'map_gmib_txt', pValue: map_gmib_txt, pType: PropertiesEnum.INPUT_TEXT },
            { pTitle: '高亮显示', pKey: 'map_gmib_hl', pValue: map_gmib_hl, pType: PropertiesEnum.SWITCH }
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
        return this.props.map_gmib_txt;
    }

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj['map_gmib_txt'] = value;

        return obj;
    }

    render() {
        const { map_gmib_txt, map_gmib_hl, selectedId, id, doChildDbClickToEdit, index } = this.props;
        const { hidden } = this.state;

        return (
            <div
                className={`menuItem`}
                ref={(ref) => {
                    this.com = ref;
                }}
                onMouseDown={this.selectedCom}
                onDoubleClick={doChildDbClickToEdit}
            >
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {
                        (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
                            >
                                <MaskLayer id={id} />
                                <Button
                                    type={map_gmib_hl ? 'primary' : 'default'}
                                    className={`${selectedId === id ? 'map-select-open' : ''}`}
                                >
                                    <label
                                        ref={(ref) => {
                                            this.editCom = ref;
                                        }}
                                        style={{
                                            visibility: hidden ? 'hidden' : 'visible'
                                        }}
                                    >
                                        {map_gmib_txt}
                                    </label>
                                </Button>
                                {/* </Droppable> */}
                                {provided.placeholder}
                            </div >
                        )
                    }
                </Draggable >
            </div>
        );
    }
}
