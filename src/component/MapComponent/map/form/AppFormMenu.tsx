import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../../index';
import { AppFormMenuItem } from './index';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { MapConsumer } from '../MapConsumer';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_gm_txt?: string;
}
export interface IMapState extends IBaseState {
    dragonDrop: any;
}
// tslint:disable:jsx-no-string-ref
export class AppFormMenuClass extends MapComponent<IMapProps, any> {
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
    render() {
        const { hover } = this.state;

        const {
            updateProps,
            map_sm,
            p,
            selectedId,
            selectComChange
        } = this.props;
        const components = p === undefined ? undefined : p.components;
        const menus: any[] = [];
        // 循环初始化菜单按钮
        if (components !== undefined) {
            components.forEach((com: any, index: number) => {
                const { t } = com;
                if (t === 'MapComponent/map/form/AppFormMenuItem') {
                    menus.push(
                        <AppFormMenuItem
                            key={`c.${com.p.id}`}
                            selectedId={selectedId}
                            ref={`c.${com.p.id}`}
                            selectComChange={selectComChange}
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
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                className={`csr-pc-map-form-menu`}
                style={Object.assign({}, { width: '100%' }, hover)}
            >
                <div className={`menu ${map_sm || ''}`}>
                    <div className="head" />
                    <div className="menu-list">
                        <div className={`menu-item`}>文件</div>
                        <div className={`menu-item`}>操作</div>
                        <div className={`menu-item`}>帮助</div>
                    </div>
                </div>
                <div
                    className={`menu ${map_sm || ''}`}
                >
                    <div className="head" />
                    <DragDropContext onDragEnd={this.onDragEnd} >
                        <Droppable droppableId="droppable" direction="horizontal">
                            {initMenus}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        );
    }
    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/form/AppFormMenuItem');
    }
}
export const AppFormMenu = MapConsumer(AppFormMenuClass);
