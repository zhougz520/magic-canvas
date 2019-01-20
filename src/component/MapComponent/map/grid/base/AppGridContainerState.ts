import { Record } from 'immutable';

import { Theme, GridStyle } from '../../model/types';

/**
 * AppGridContainerState的属性
 */
export interface IAppGridContainerState {
    gridStyle: GridStyle;               // 列表样式
    showAppProjectTree: boolean;        // 显示 项目控件
    showAppFindOrdinary: boolean;       // 显示 普通查询
    showAppFindAdvanced: boolean;       // 显示 高级搜索
    showAppGridView: boolean;           // 显示 视图
    showAppGridTitle: boolean;          // 显示 标题
    showAppGridMenu: boolean;           // 显示 表头
    showAppGrid: boolean;               // 显示 列表
    showAppGridPage: boolean;           // 显示 分页
    showModalMenu: boolean;             // 显示 对话框按钮
    title: string;                      // 标题
    childData: any;                     // 子组件数据
    theme: Theme;                       // 皮肤{ black:经典黑, blue:宝石蓝, green:橄榄绿, light-blue:天空蓝, light-green:荷叶绿, red:活力红, orange:欢快橙 }
}

const defaultRecord: IAppGridContainerState = {
    gridStyle: 'advanced',
    showAppProjectTree: true,
    showAppFindOrdinary: true,
    showAppFindAdvanced: true,
    showAppGridView: true,
    showAppGridTitle: false,
    showAppGridMenu: true,
    showAppGrid: true,
    showAppGridPage: true,
    showModalMenu: false,
    title: '标题',
    childData: null,
    theme: 'black'
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

    getGridStyle(): GridStyle {
        return this.get('gridStyle');
    }

    getShowAppProjectTree(): boolean {
        return this.get('showAppProjectTree');
    }

    getShowAppFindOrdinary(): boolean {
        return this.get('showAppFindOrdinary');
    }

    getShowAppFindAdvanced(): boolean {
        return this.get('showAppFindAdvanced');
    }

    getShowAppGridView(): boolean {
        return this.get('showAppGridView');
    }

    getShowAppGridTitle(): boolean {
        return this.get('showAppGridTitle');
    }

    getShowAppGridMenu(): boolean {
        return this.get('showAppGridMenu');
    }

    getShowAppGrid(): boolean {
        return this.get('showAppGrid');
    }

    getShowAppGridPage(): boolean {
        return this.get('showAppGridPage');
    }

    getShowModalMenu(): boolean {
        return this.get('showModalMenu');
    }

    getTitle(): string {
        return this.get('title');
    }

    getChildData(): any {
        return this.get('childData');
    }

    getTheme(): Theme {
        return this.get('theme');
    }
}
