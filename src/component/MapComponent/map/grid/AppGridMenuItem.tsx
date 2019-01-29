import * as React from 'react';
import { MapComponent, IBaseProps } from '../../index';
import { Dropdown, Menu, Icon } from 'antd';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { MaskLayer } from '../../../BaseComponent/mask/MaskLayer';
import * as DragStyle from '../DragStyle';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_mi_txt?: string;
    map_mi_dd?: string[];
    map_mi_si?: boolean;
    map_mi_ico?: string;
    map_mi_sa?: boolean;
    index?: number;
    data: any;
}

export class AppGridMenuItem extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_mi_txt: '按钮',
        map_mi_sa: false
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

    public render() {
        const { map_mi_txt, map_mi_dd, map_mi_ico, map_mi_si, map_mi_sa, selectedId, id, index } = this.props;

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
                <MaskLayer id={id} />
                <Dropdown overlay={menu} trigger={['click']}>
                    <div
                        ref={(ref) => this.com = ref}
                        className={`app-grid-menu-item ${selectedId === id ? 'map-selected' : ''}`}
                    >
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
                className={`app-grid-menu-item`}
                onMouseDown={this.selectedCom}
            >
                <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                    {initDrag}
                </Draggable>
            </div>
        );
    }
}
