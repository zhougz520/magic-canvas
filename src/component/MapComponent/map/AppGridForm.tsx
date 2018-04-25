import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../../BaseComponent/index';
import { AppView, ProjectDDTree, AppFind, AppGridMenu } from './index';

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
    demoState: string;
    selectCom: string;  // 先...只能单选，后面看情况在调整
    title: string;
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

    public render() {
        const { data, showProj, showView, showAppFind, showAppGridMenu, showAppGrid } = this.props;
        const { title } = this.state;
        // const { p, w, h, map_sm } = data;
        if (data.p !== undefined && data.p.components.length > 0) {
            this.initCom(data.p.components);
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
                ref={(ref) => this.com = ref}
                className="ps-map"
                style={currStyle}
            >
                <div className="title">
                    {title}
                </div>
                <table className="grid-form" >
                    <tbody>
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
        const { selectCom } = this.state;
        // console.log(selectCom);
        components.forEach((com: any) => {
            switch (com.t) {
                case 'MapComponent/map/ProjectDDTree':
                    this.proj = (
                        <ProjectDDTree
                            selectedId={selectCom}
                            selectCom={this.selectComChange}
                            {...com.p}
                            updateProps={this.props.data.updateProps}
                        />
                    );
                    break;
                case 'MapComponent/map/AppView':
                    this.view = (
                        <AppView
                            selectedId={selectCom}
                            selectCom={this.selectComChange}
                            {...com.p}
                            updateProps={this.props.data.updateProps}
                        />
                    );
                    break;
                case 'MapComponent/map/AppFind':
                    this.find = (
                        <AppFind
                            selectedId={selectCom}
                            selectCom={this.selectComChange}
                            {...com.p}
                            updateProps={this.props.data.updateProps}
                        />
                    );
                    break;
                case 'MapComponent/map/AppGridMenu':
                    this.menu = (
                        <AppGridMenu
                            selectedId={selectCom}
                            selectCom={this.selectComChange}
                            {...com.p}
                            updateProps={this.props.data.updateProps}
                        />
                    );
                    break;
            }
        });
    }

    public selectComChange = (id: string) => {
        this.setState({
            selectCom: id
        });
    }
}
