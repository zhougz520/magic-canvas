import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../../index';
import { Checkbox } from 'antd';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { AppGridTitle } from './index';

export interface IMapProps extends IBaseProps {
    updateProps: (cid: string, updateProp: any) => void;
    map_g_mc: boolean;   // 是否多选
    map_g_sl: number;   // 滚动条位置
    map_g_pg: boolean;   // 是否显示分页栏

    map_g_data: any;   // grid数据
    map_g_modal: boolean;  // 是否开启grid数据编辑
    map_g_tree: boolean;    // 是否TreeGrid
    w: number;   // 宽度 (用于列表横向滚动条)
    h: number;   // 高度 (用于列表数据竖向滚动条)
    p: any;
}
export interface IMapState extends IBaseState {
    dragonDrop?: any;
    // map_af_se: boolean;
}
export class AppGrid extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_g_mc: false,
        map_g_sl: false,
        map_g_pg: false,
        map_g_data: false,
        map_g_modal: false,
        map_g_tree: false
    };

    public title: HTMLElement | null = null;
    public titles: any;

    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            dragonDrop: null,
            hover: {}
        };
    }
    public getItemStyle = (draggableStyle: any, isDragging: any) => ({
        background: isDragging ? 'lightblue' : 'lightgrey',
        display: 'flex',
        // padding: grid,
        overflow: 'auto'
    })
    public render() {
        // const { map_g_mc, map_g_sl, map_g_pg, map_g_data, map_g_modal, map_g_tree, w, h } = this.props;
        const { map_g_mc, map_g_tree, map_sm, selectedId, id, w, p } = this.props;
        const { hover } = this.state;
        // 加载 GridTitle
        this.initTitle(p);

        return (
            <div
                // onMouseDown={this.selectedCom}
                ref={(ref) => this.com = ref}
                className={`csr-pc-map-app-grid ${map_sm || ''} ${selectedId === id ? 'selectecd' : ''}`}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                style={Object.assign({}, hover)}
            >
                <div className={`grid-title`} style={{ width: w - 10 }}>
                    <div className="app-grid-title-item index">
                        <div className={`grid-title-index`} style={{ display: map_g_tree ? 'none' : '' }}>
                            {map_g_mc ? (<Checkbox defaultChecked={false} />) : `序号`}
                        </div>
                        <div className="title-split no-ctrl" />
                    </div>
                    <div className={`grid-title-content`} ref={(ref) => this.title = ref}>
                        <DragDropContext onDragEnd={this.onDragEnd} >
                            <Droppable droppableId="droppable" direction="horizontal">
                                {this.titles}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>
        );
    }
    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/AppGridTitle');
    }
    // 初始化标题
    protected initTitle = (p: any) => {
        const { selectComChange, selectedId, updateProps } = this.props;
        if (p !== undefined) {
            const currTitles: JSX.Element[] = [];
            p.components.forEach((com: any, index: number) => {
                // 如果当前正在拖拽title, 则更新推拽title的宽度
                currTitles.push(
                    <AppGridTitle
                        key={`c.${com.p.id}`}
                        selectedId={selectedId}
                        // tslint:disable-next-line:jsx-no-string-ref
                        ref={`c.${com.p.id}`}
                        selectComChange={selectComChange}
                        {...com.p}
                        updateProps={updateProps}
                        index={index}
                    />
                );
            });
            this.titles = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
                (
                    <div
                        className="title-list"
                        ref={provided.innerRef}
                    >
                        {currTitles}
                    </div>
                );
        }
    }
    protected onDragEnd = (result: any) => {
        const { p, id } = this.props;
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const components = this.reorder(
            p.components,
            result.source.index,
            result.destination.index
        );

        p.components = components;
        this.props.updateProps(id, { p });
    }

    protected reorder = (list: any, startIndex: any, endIndex: any) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

}
