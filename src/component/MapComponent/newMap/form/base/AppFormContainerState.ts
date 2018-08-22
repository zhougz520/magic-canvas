import { Record } from 'immutable';

import { Theme } from '../../model/types';

/**
 * AppFormContainerState的属性
 */
export interface IAppFormContainerState {
    showHeader: boolean;                // 显示 标题
    showBottom: boolean;                // 显示 底部
    title: string;                      // 标题
    childData: any;                     // 子组件数据
    theme: Theme;                       // 皮肤{ black:经典黑, blue:宝石蓝, green:橄榄绿, light-blue:天空蓝, light-green:荷叶绿, red:活力红, orange:欢快橙 }
}

const defaultRecord: IAppFormContainerState = {
    showHeader: true,
    showBottom: true,
    title: '标题',
    childData: null,
    theme: 'black'
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

    getShowHeader(): boolean {
        return this.get('showHeader');
    }

    getShowBottom(): boolean {
        return this.get('showBottom');
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
