import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../../index';
import { Checkbox } from 'antd';
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { AppGridTitle } from './index';
import { MapConsumer } from '../MapConsumer';

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
    scroll: number; // 滚动条位置
}
export interface IMapState extends IBaseState {
    dragonDrop?: any;
    // map_af_se: boolean;
}
export class AppGridClass extends MapComponent<IMapProps, any> {
    static defaultProps = {
        map_g_mc: false,
        map_g_sl: false,
        map_g_pg: false,
        map_g_data: false,
        map_g_modal: false,
        map_g_tree: false,
        scroll: 0
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

    componentDidUpdate() {
        // 记住滚动条的位置，在改变的时候更新
        if (this.com !== null) {
            this.com.scrollLeft = this.props.scroll;
        }
    }
    public getItemStyle = (draggableStyle: any, isDragging: any) => ({
        background: isDragging ? 'lightblue' : 'lightgrey',
        display: 'flex',
        // padding: grid,
        overflow: 'auto'
    })

    public render() {
        // const { map_g_mc, map_g_sl, map_g_pg, map_g_data, map_g_modal, map_g_tree, w, h } = this.props;
        const { map_sm, selectedId, id, w, p } = this.props;
        const { hover } = this.state;
        // 加载 GridTitle
        this.initTitle(p);

        return (
            <div
                // onMouseDown={this.selectedCom}
                ref={(ref) => this.com = ref}
                className={`csr-pc-map-app-grid ${map_sm || ''} ${selectedId === id ? 'map-selected' : ''}`}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                onScroll={this.scrollHandle}
                style={Object.assign({}, hover)}
            >
                <div className={`grid-title`} style={{ width: w - 20 }}>
                    <div className={`grid-title-content`} ref={(ref) => this.title = ref}>
                        <DragDropContext onDragEnd={this.onDragEnd} >
                            <Droppable droppableId="droppable" direction="horizontal">
                                {this.titles}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
                <div className={`grid-bottom`}>
                    <div className={`grid-bottom-left`}>
                        <span style={{ marginLeft: 8 }}>页次： <input /> /0</span>
                        <span style={{ marginLeft: 8 }}>每页 <input /> 条/共0条</span>
                    </div>
                    <div className={`grid-bottom-right`}>
                        <span className="g-bottom-page">[末页]</span>
                        <span className="g-bottom-page">[下页]</span>
                        <span className="g-bottom-page">[上页]</span>
                        <span className="g-bottom-page">[首页]</span>
                    </div>
                </div>
            </div >
        );
    }
    /*重载添加组件*/
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/grid/AppGridTitle');
    }
    // 初始化标题
    protected initTitle = (p: any) => {
        const { selectComChange, selectedId, updateProps, map_g_tree, map_g_mc } = this.props;
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
                    // scroll={scroll}
                    />
                );
            });
            this.titles = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
                (
                    <div
                        className="title-list"
                        ref={provided.innerRef}
                    >
                        <div
                            className={`app-grid-title-item`}
                        >
                            <div>
                                <div className={`title grid-title-index`} style={{ display: map_g_tree ? 'none' : '' }}>
                                    {map_g_mc ? (<Checkbox defaultChecked={false} />) : `序号`}
                                </div>
                            </div>
                            <div className="title-split no-ctrl" />
                        </div>
                        {currTitles}
                    </div>
                );
        }
    }

}

export const AppGrid = MapConsumer(AppGridClass);
