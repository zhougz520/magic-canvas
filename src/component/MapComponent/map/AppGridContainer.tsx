import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../../BaseComponent/index';
import { AppView, ProjectDDTree, AppFind, AppGridMenu, AppGrid } from './grid/index';
import { MapProvider } from './MapProvider';
import { gridDetail } from './StructureDemo';

import '../sass/Map.scss';
import '../sass/Field.scss';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
    showProj: boolean;              // 显示 项目控件
    showView: boolean;              // 显示 视图
    showAppFind: boolean;           // 显示 查询控件
    showAppGridMenu: boolean;       // 显示 列表菜单
    showAppGrid: boolean;           // 显示 列表
    map_sm: string;                 // 版本(皮肤？)
}

export interface IDemoState extends IBaseState {
    selectedId?: string;  // 先...只能单选，后面看情况在调整
    title?: string;
}
export default class AppGridContainer extends BaseComponent<IDemoProps, IDemoState> {
    static defaultProps = {
        showProj: true,              // 显示 项目控件
        showView: true,              // 显示 视图
        showAppFind: true,           // 显示 查询控件
        showAppGridMenu: true,       // 显示 列表菜单
        showAppGrid: true            // 显示 列表
    };

    public com: HTMLElement | null = null;
    private proj: any = '';
    private view: any = '';
    private find: any = '';
    private menu: any = '';
    private grid: any = '';
    private _isCanMove: boolean = false;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(props.childData)
        };
    }
    componentDidMount() {
        const cid = this.getCid();
        let initData: any = this.props.childData;
        if (initData === undefined) {
            initData = JSON.stringify(gridDetail.p).replace(/【cs】/g, cid);
            this.setCustomState(JSON.parse(initData));
        }
    }
    public isCanMove = () => {
        return this._isCanMove;
    }

    public setIsCanMove = (isCanMove: boolean): void => {
        this._isCanMove = isCanMove;
    }
    /**
     * map控件选中
     * @param id 组件id
     */
    public selectComChange = (e: any, id: string | undefined) => {
        if (id !== undefined) {
            this.setIsCanMove(false);
        } else {
            this.setIsCanMove(true);
        }
        this.setState({
            selectedId: id
        });
    }
    public render() {
        const { showProj, showView, showAppFind, showAppGridMenu, showAppGrid, map_sm, pageMode } = this.props;
        const { title } = this.state;
        const childData = this.getCustomState() !== null && this.getCustomState() !== undefined ? this.getCustomState().toJS() : undefined;
        // const { p, w, h, map_sm } = data;
        if (childData !== undefined && childData.components.length > 0) {
            this.initCom(childData.components);
        }

        // 汇总style
        const currStyle = Object.assign(
            BaseStyle(
                this.getPositionState(),
                this.getSizeState(),
                this.getHierarchy()
            ),
            {
                overflow: 'auto'
            }
        );

        return (
            <MapProvider
                map_sm={map_sm}
                updateProps={this.updateProps}
                selectComChange={this.selectComChange}
                selectedId={this.state.selectedId}
                pageMode={pageMode}
                stateData={childData}
            >
                <div
                    className="ps-map"
                    style={currStyle}
                    ref={(ref) => this.com = ref}
                // onMouseDown={this.selectComTitle}
                >
                    <div
                        className="title"
                        onMouseDown={this.ontitleMouseDown}
                    // onMouseUp={this.ontitleMouseUp}
                    >
                        {title === undefined ? '标题' : title}
                    </div>
                    <div
                        className="grid-form"
                    >
                        <div className="grid-top" style={{ display: !showProj && !showView ? 'none' : '' }} >
                            <div className={`grid-top`}>
                                <div style={{ display: !showProj ? 'none' : '' }}>
                                    {this.proj}
                                </div>
                                <div style={{ display: !showView ? 'none' : '' }}>
                                    {this.view}
                                </div>
                            </div>
                        </div>
                        <div className="grid-find" style={{ display: !showAppFind ? 'none' : '' }} >
                            {this.find}
                        </div>
                        <div className="grid-menu" style={{ display: !showAppGridMenu ? 'none' : '' }} >
                            {this.menu}
                        </div>
                        <div className="grid-table" style={{ display: !showAppGrid ? 'none' : '' }} >
                            {this.grid}
                        </div>
                    </div>
                </div>
            </MapProvider>
        );
    }

    // 初始化加载控件
    public initCom = (components: any[]) => {
        const { selectedId } = this.state;
        components.forEach((com: any) => {
            switch (com.t) {
                case 'MapComponent/map/grid/ProjectDDTree':
                    this.proj = (
                        <ProjectDDTree
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                        />
                    );
                    break;
                case 'MapComponent/map/grid/AppView':
                    this.view = (
                        <AppView
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                        />
                    );
                    break;
                case 'MapComponent/map/grid/AppFind':
                    this.find = (
                        <AppFind
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                        />
                    );
                    break;
                case 'MapComponent/map/grid/AppGridMenu':
                    this.menu = (
                        <AppGridMenu
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateProps}
                        />
                    );
                    break;
                case 'MapComponent/map/grid/AppGrid':
                    this.grid = (
                        <AppGrid
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            w={this.getSizeState().getWidth()}
                            updateProps={this.updateProps}
                        />
                    );
                    break;
            }
        });
    }

    // 更新控件
    protected updateProps = (id: string, props: any) => {
        // 获取当前数据
        const childData = this.getCustomState().toJS();
        // 通过id查找到数据节点
        const newData = this.updateComProps(childData, id, props);
        // 更新数据到CustomState
        this.setCustomState(newData);
    }

    // 更新控件属性
    private updateComProps = (data: any, id: string, prop: any) => {
        let newData: any = data;
        data.components.forEach((com: any) => {
            if (com.p.id === id) {
                com.p = Object.assign({}, com.p, prop);
                newData = data;

                return newData;
            }
            // 如果存在子控件，则
            if (com.p.p !== undefined && com.p.p.components !== undefined) {
                this.updateComProps(com.p.p, id, prop);
            }
        });

        return newData;
    }

    private ontitleMouseDown = (e: any): void => {
        // this.setIsCanMove(true);
        this.selectComChange(e, undefined);
        this.fireSelectChange(e);
    }

    // private ontitleMouseUp = (): void => {
    //     this.setIsCanMove(false);
    // }
}
