import { Record } from 'immutable';

import { Theme } from '../../../model/types';

/**
 * AppFormContainerState的属性
 */
export interface IAppFormContainerState {
    showMenu: boolean;              // 显示 项目控件
    showNavBar: boolean;            // 显示 视图
    showTabItems: boolean;          // 显示 查询控件
    map_sm: string;                 // 版本(皮肤？)
    title: string;                  // 标题
    childData: any;                 // 子组件数据
}

const defaultRecord: IAppFormContainerState = {
    showMenu: true,                 // 显示 项目控件
    showNavBar: true,               // 显示 左侧标签页
    showTabItems: true,             // 显示 横向标签页
    map_sm: 'black',                // 皮肤
    title: '标题',                  // 标题
    childData: null                // 子组件数据
};

export const AppFormContainerStateRecord: Record.Class = Record(defaultRecord);

/**
 * 构建基类的AppFormContainerState
 * 提供初始化、get\set对应属性的方法
 */
export class AppFormContainerState extends AppFormContainerStateRecord {
    /**
     * 通过传入对象初始化AppFormContainerState
     * @param appFormContainerState IAppFormContainerState中属性的集合对象（eg：{type: 'primary'}）
     */
    static create(appFormContainerState: IAppFormContainerState): AppFormContainerState {
        return new AppFormContainerState(appFormContainerState);
    }

    /**
     * 给AppFormContainerState设置内容
     * @param appFormContainerState this.getCustomState()
     * @param put IAppFormContainerState属性的集合
     */
    static set(appFormContainerState: AppFormContainerState, put: any): AppFormContainerState {
        const map: any = appFormContainerState.withMutations(
            (state: any) => {
                state.merge(put);
            }
        );

        return new AppFormContainerState(map);
    }

    getTitle(): string {
        return this.get('title');
    }

    getChildData(): any {
        return this.get('childData');
    }

    getShowMenu(): boolean {
        return this.get('showMenu');
    }

    getShowNavBar(): string {
        return this.get('showNavBar');
    }

    getShowTabItems(): any {
        return this.get('showTabItems');
    }

    getTheme(): Theme {
        return this.get('map_sm');
    }
}
