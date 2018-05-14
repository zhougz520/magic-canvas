import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../../BaseComponent/index';
import { AppView, ProjectDDTree, AppFind, AppGridMenu, AppGrid } from './index';
import { fromJS } from 'immutable';

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
export default class AppGridForm extends BaseComponent<IDemoProps, IDemoState> {
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
            baseState: this.initBaseStateWithCustomState(fromJS(this.props.data))
        };
    }
    public render() {
        const { childData, showProj, showView, showAppFind, showAppGridMenu, showAppGrid } = this.props;
        const { title } = this.state;
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
            >
                <table
                    className="grid-form"
                >
                    <tbody>
                        <tr className="title" onMouseDown={this.fireSelectChange} >
                            <td>
                                {title === undefined ? '标题' : title}
                            </td>
                        </tr>
                        <tr style={{ display: !showProj && !showView ? 'none' : '', height: 30 }} >
                            <td>
                                <table className="proj-view" >
                                    <tbody>
                                        <tr>
                                            <td style={{ display: !showProj ? 'none' : '' }}>
                                                {this.proj}
                                            </td>
                                            <td style={{ display: !showView ? 'none' : '' }}>
                                                {this.view}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr style={{ display: !showAppFind ? 'none' : '', height: 1, marginBottom: 10 }} >
                            <td>
                                {this.find}
                            </td>
                        </tr>
                        <tr style={{ display: !showAppGridMenu ? 'none' : '', height: 1 }} >
                            <td>
                                {this.menu}
                            </td>
                        </tr>
                        <tr style={{ display: !showAppGrid ? 'none' : '' }} >
                            <td>
                                {this.grid}
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                            fireSelectChildChange={this.fireSelectChildChange}
                            {...com.p}
                            updateProps={undefined}
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
                            fireSelectChildChange={this.fireSelectChildChange}
                            {...com.p}
                            updateProps={undefined}
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
                            fireSelectChildChange={this.fireSelectChildChange}
                            {...com.p}
                            updateProps={undefined}
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
                            fireSelectChildChange={this.fireSelectChildChange}
                            {...com.p}
                            updateProps={undefined}
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
                            fireSelectChildChange={this.fireSelectChildChange}
                            {...com.p}
                            w={this.getSizeState().getWidth()}
                            updateProps={undefined}
                        />
                    );
                    break;
            }
        });
    }
}
