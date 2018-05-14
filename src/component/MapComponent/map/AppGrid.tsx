import * as React from 'react';
import { MapComponent, IBaseProps, IBaseState } from '../index';
import { Checkbox } from 'antd';
import { AppGridTitle } from './index';
import DragOnDrop from 'drag-on-drop';
import { GlobalUtil } from '../../util/GlobalUtil';

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
}
export interface IMapState extends IBaseState {
    dragonDrop?: any;
    // map_af_se: boolean;
}
export class AppGrid extends MapComponent<IMapProps, IMapState> {
    static defaultProps = {
        map_g_mc: false,
        map_g_sl: false,
        map_g_pg: false,
        map_g_data: false,
        map_g_modal: false,
        map_g_tree: false
    };

    public title: HTMLElement | null = null;
    public titles: JSX.Element[] = [];

    constructor(props: any, context?: any) {
        super(props, context);
        this.state = {
            dragonDrop: null,
            hover: {}
        };
    }
    componentDidMount() {
        if (this.com != null) {
            this.com.addEventListener('drop', this.handleDropAddComponent);
        }

        const dragonDrop = new DragOnDrop(this.title, {
            item: 'div.title',
            handle: 'div.title-content',
            announcement: {
                grabbed: (el: any, items: any) => {
                    GlobalUtil.debugLog(el, '1');
                    GlobalUtil.debugLog(items, 'list');

                    return `The rankings have been updated`;
                },
                dropped: (el: any, items: any) => {
                    GlobalUtil.debugLog(el, '2');
                    GlobalUtil.debugLog(items, 'list');
                    GlobalUtil.debugLog(dragonDrop, 'dragonDrop');
                    GlobalUtil.debugLog(this.title, 'ref');

                    return `The rankings have been updated`;
                }
            }
        });

        this.setState({ dragonDrop });
    }
    public render() {
        // const { map_g_mc, map_g_sl, map_g_pg, map_g_data, map_g_modal, map_g_tree, w, h } = this.props;
        const { map_g_mc, map_g_tree, map_sm, selectedId, id, w, p } = this.props;
        const { hover } = this.state;
        // 加载 GridTitle
        this.initTitle(p);

        return (
            <div
                onMouseDown={this.selectedCom}
                ref={(ref) => this.com = ref}
                className={`csr-pc-map-app-grid ${map_sm || ''} ${selectedId === id ? 'selectecd' : ''}`}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                style={Object.assign({}, hover)}
            >
                <div className={`grid-title`} style={{ width: w - 10 }}>
                    <div className={`grid-title-index`} style={{ display: map_g_tree ? 'none' : '' }}>
                        {map_g_mc ? (<Checkbox defaultChecked={false} />) : `序号`}
                    </div>
                    <div className="title-split no-ctrl" />
                    <div className={`grid-title-content`} ref={(ref) => this.title = ref}>
                        {this.titles}
                    </div>
                </div>
            </div>
        );
    }
    // 初始化标题
    protected initTitle = (p: any) => {
        const { selectComChange, selectedId, fireSelectChildChange, updateProps } = this.props;
        if (p !== undefined) {
            const currTitles: JSX.Element[] = [];
            p.components.forEach((com: any) => {
                currTitles.push(
                    <AppGridTitle
                        key={`c.${com.p.id}`}
                        selectedId={selectedId}
                        // tslint:disable-next-line:jsx-no-string-ref
                        ref={`c.${com.p.id}`}
                        selectComChange={selectComChange}
                        fireSelectChildChange={fireSelectChildChange}
                        {...com.p}
                        updateProps={updateProps}
                    />
                );
            });
            this.titles = currTitles;
        }
    }
    /*重载添加组件*/
    protected componentCanBeAdded(t: string) {
        return (t === 'MapComponent/map/AppGridTitle');
    }
}
