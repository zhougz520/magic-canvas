import * as React from 'react';
import { MapComponent, IBaseProps } from '../index';
import { Dropdown, Menu, Icon } from 'antd';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_mi_txt?: string;
    map_mi_dd?: string[];
    map_mi_si?: boolean;
    map_mi_ico?: string;
    map_mi_sa?: boolean;
    index?: number;
}

export class AppGridMenuItem extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_mi_txt: '按钮',
        map_mi_sa: false
    };

    constructor(props: any, context?: any) {
        super(props, context);

        this.state = {
            ...props
        };
    }

    public getItemStyle = (draggableStyle: any, isDragging: any) => ({
        // some basic styles to make the items look a bit nicer
        // userSelect: 'none',
        // paddingRight: 5,
        // paddingLeft: 5,

        // change background colour if dragging
        background: isDragging ? 'blue' : '',

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
            <div className={`app-grid-menu-item`}>
                <div
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    style={this.getItemStyle(provided.draggableProps.style, snapshot.isDragging)}
                >
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div
                            ref={(ref) => this.com = ref}
                            className={`app-grid-menu-item ${selectedId === id ? 'selectecd' : ''}`}
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
                </div>
                {provided.placeholder}
            </div>
        );

        return (
            // TODO: 现在位置不对，是因为拖动元素的样式有问题，不能用fload...
            <Draggable key={id} draggableId={id} index={index === undefined ? 0 : index}>
                {initDrag}
            </Draggable>
        );
    }
}
