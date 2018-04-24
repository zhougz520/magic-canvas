import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState } from '../../BaseComponent/index';
// import { AppView, ProjectDDTree, AppFind, AppGridMenu, AppGridTitle } from './index';

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
}
export default class AppGridForm extends BaseComponent<IDemoProps, IDemoState> {
    public com: HTMLElement | null = null;

    public render() {
        const { showProj, showView, showAppFind, showAppGridMenu, showAppGrid } = this.props;
        // const { p, w, h, map_sm } = data;

        return (
            <table
                ref={(ref) => this.com = ref}
                className="ps-map"
                // style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
            >
                <tbody>
                    <tr>
                        <td>
                            <table className="proj-view" style={{ display: !showProj && !showView ? 'none' : '' }} >
                                <tbody>
                                    <tr>
                                        <td>
                                            {/* <ProjectDDTree /> */}项目控件
                                        </td>
                                        <td>
                                            {/* <AppView /> */}视图控件
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style={{ display: !showAppFind ? 'none' : '' }} >
                        <td>
                            {/* <AppFind /> */}查询控件
                        </td>
                    </tr>
                    <tr style={{ display: !showAppGridMenu ? 'none' : '' }} >
                        <td>
                            {/* <AppGridMenu /> */}
                        </td>
                    </tr>
                    <tr style={{ display: !showAppGrid ? 'none' : '' }} >
                        <td>
                            {/* <AppGrid /> */}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
