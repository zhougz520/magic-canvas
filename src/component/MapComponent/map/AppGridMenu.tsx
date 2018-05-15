import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../index';
import { AppGridMenuItem } from './index';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { fromJS } from 'immutable';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_gm_txt?: string;
}
export interface IMapState extends IBaseState {
    dragonDrop: any;
}
export class AppGridMenu extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_gm_txt: '标题',
        selectedId: undefined
    };

    public menus: HTMLElement | null = null;

    constructor(props: IMapProps, context?: any) {
        super(props, context);
        this.state = {
            dragonDrop: null,
            hover: {},
            ...props
        };
    }
    shouldComponentUpdate(np: any, ns: any) {
        if (fromJS(ns.p) !== fromJS(this.state.p)) {
            ns.p = this.state.p;
        }

        return true;
    }
    render() {
        const { hover, p } = this.state;

        const {
            updateProps,
            map_gm_txt,
            map_sm,
            // p,
            id,
            selectedId,
            selectComChange,
            fireSelectChildChange
        } = this.props;
        const components = p === undefined ? undefined : p.components;
        const menus: any[] = [];
        // 循环初始化菜单按钮
        if (components !== undefined) {
            components.forEach((com: any, index: number) => {
                const { t } = com;
                if (t === 'MapComponent/map/AppGridMenuItem') {
                    menus.push(
                        <AppGridMenuItem
                            key={`c.${com.p.id}`}
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={selectComChange}
                            fireSelectChildChange={fireSelectChildChange}
                            {...com.p}
                            updateProps={updateProps}
                            index={index}
                        />
                    );
                }
            });
        }

        const initMenus = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
            (
                <div
                    className="menu-list"
                    ref={provided.innerRef}
                >
                    {menus}
                </div>
            );

        return (
            <div
                ref={(ref) => this.com = ref}
                className={`csr-pc-map-grid-menu ${map_sm || ''} ${selectedId === id ? 'selectecd' : ''}`}
                style={Object.assign({}, { width: '100%' }, hover)}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
            >
                <div className="app-grid-menu-title" >
                    <b>{map_gm_txt}</b>
                </div>
                <DragDropContext onDragEnd={this.handleOver} >
                    <Droppable droppableId="droppable" direction="horizontal">
                        {initMenus}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/AppGridMenuItem');
    }

    public handleOver = (result: any) => {
        const { p } = this.state;
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const components = this.reorder(
            this.state.p.components,
            result.source.index,
            result.destination.index
        );
        p.components = components;
        this.setState({
            p
        });
    }

    public reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }
}
