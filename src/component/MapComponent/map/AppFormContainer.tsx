import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../../BaseComponent/index';
import { AppView, ProjectDDTree, AppFind, AppGridMenu, AppGrid } from './grid/index';
// import { fromJS } from 'immutable';

import '../sass/Map.scss';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
    showProj: boolean;              // 显示 项目控件
    showView: boolean;              // 显示 视图
    showAppFind: boolean;           // 显示 查询控件
    showAppGridMenu: boolean;       // 显示 列表菜单
    showAppGrid: boolean;           // 显示 列表
}

export interface IDemoState extends IBaseState {
    selectedId?: string;  // 先...只能单选，后面看情况在调整
    title?: string;
}
export default class AppFormContainer extends BaseComponent<IDemoProps, IDemoState> {
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
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(props.childData)
        };
    }
    public render() {
        const { showProj, showView, showAppFind, showAppGridMenu, showAppGrid } = this.props;
        const { title } = this.state;
        const childData = this.getCustomState().toJS();
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
            <div
                className="ps-map"
                style={currStyle}
                ref={(ref) => this.com = ref}
                onMouseDown={this.fireSelectChange}
            >
                <div
                    className="grid-form"
                >
                    <div className="title">
                        {title === undefined ? '标题' : title}
                    </div>
                    <div className="grid-top" style={{ display: !showProj && !showView ? 'none' : '' }} >
                        <div style={{ display: !showProj ? 'none' : '' }}>
                            {this.proj}
                        </div>
                        <div style={{ display: !showView ? 'none' : '' }}>
                            {this.view}
                        </div>
                    </div>
                    <div className="grid-find" style={{ display: !showAppFind ? 'none' : '', marginBottom: 10 }} >
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
        );
    }

    // 初始化加载控件
    public initCom = (components: any[]) => {
        const { selectedId } = this.state;
        components.forEach((com: any) => {
            switch (com.t) {
                case 'MapComponent/map/ProjectDDTree':
                    this.proj = (
                        <ProjectDDTree
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateCom}
                        />
                    );
                    break;
                case 'MapComponent/map/AppView':
                    this.view = (
                        <AppView
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateCom}
                        />
                    );
                    break;
                case 'MapComponent/map/AppFind':
                    this.find = (
                        <AppFind
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateCom}
                        />
                    );
                    break;
                case 'MapComponent/map/AppGridMenu':
                    this.menu = (
                        <AppGridMenu
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            updateProps={this.updateCom}
                        />
                    );
                    break;
                case 'MapComponent/map/AppGrid':
                    this.grid = (
                        <AppGrid
                            selectedId={selectedId}
                            // tslint:disable-next-line:jsx-no-string-ref
                            ref={`c.${com.p.id}`}
                            selectComChange={this.selectComChange}
                            {...com.p}
                            w={this.getSizeState().getWidth()}
                            updateProps={this.updateCom}
                        />
                    );
                    break;
            }
        });
    }

    // 更新控件
    protected updateCom = (id: string, props: any) => {
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
}
