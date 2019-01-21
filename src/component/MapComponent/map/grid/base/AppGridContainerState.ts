import { Record, List } from 'immutable';

import { Theme } from '../../../model/types';

/**
 * AppGridContainerState的属性
 */
export interface IAppGridContainerState {
    showProj: boolean;              // 显示 项目控件
    showView: boolean;              // 显示 视图
    showAppFind: boolean;           // 显示 查询控件
    showAppGridMenu: boolean;       // 显示 列表菜单
    showAppGrid: boolean;           // 显示 列表
    map_sm: Theme;                  // 版本(皮肤？)
    title: string;                  // 标题
    childData: any;                 // 子组件数据
}

const defaultRecord: IAppGridContainerState = {
    showProj: true,              // 显示 项目控件
    showView: true,              // 显示 视图
    showAppFind: true,           // 显示 查询控件
    showAppGridMenu: true,       // 显示 列表菜单
    showAppGrid: true,           // 显示 列表
    map_sm: 'black',             // 皮肤 黑色
    title: '标题',               // 标题
    childData: null              // 子组件数据
};

export const AppGridContainerStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建基类的AppGridContainerState
 * 提供初始化、get\set对应属性的方法
 */
export class AppGridContainerState extends AppGridContainerStateRecord {
    /**
     * 通过传入对象初始化AppGridContainerState
     * @param appGridContainerState IAppGridContainerState中属性的集合对象（eg：{type: 'primary'}）
     */
    static create(appGridContainerState: IAppGridContainerState): AppGridContainerState {
        return new AppGridContainerState(appGridContainerState);
    }

    /**
     * 给AppGridContainerState设置内容
     * @param appGridContainerState this.getCustomState()
     * @param put IAppGridContainerState属性的集合
     */
    static set(appGridContainerState: AppGridContainerState, put: any): AppGridContainerState {
        const map: any = appGridContainerState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new AppGridContainerState(map);
    }

    showProj(): boolean {
        return this.get('showProj');
    }

    showView(): boolean {
        return this.get('showView');
    }

    showAppFind(): boolean {
        return this.get('showAppFind');
    }

    showAppGridMenu(): boolean {
        return this.get('showAppGridMenu');
    }

    showAppGrid(): boolean {
        return this.get('showAppGrid');
    }

    getTitle(): string {
        return this.get('title');
    }

    getChildData(): any {
        return this.get('childData');
    }

    getTheme(): Theme {
        return this.get('map_sm');
    }
}
