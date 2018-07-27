import * as React from 'react';

import {
    BaseComponent,
    IBaseProps,
    IBaseState,
    BaseStyle
} from '../../../../BaseComponent';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../../../../UniversalComponents';

import { MapProvider } from '../../MapProvider';
import { AppGridContainerState } from './AppGridContainerState';

import { Map, List, OrderedSet } from 'immutable';

import '../../sass/AppGrid.scss';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridContainerProps extends IBaseProps {
}

export interface IAppGridContainerState extends IBaseState {
    selectedId: string | null;  // 当前选中的子控件id
    refs: any;
}

export default class AppGridContainer extends BaseComponent<IAppGridContainerProps, IAppGridContainerState> {

    constructor(props: IAppGridContainerProps, context?: any) {
        super(props, context);

        const { childData } = this.props;
        this.state = {
            baseState: this.initBaseStateWithCustomState(new AppGridContainerState({ childData })),
            selectedId: null,
            refs: this.refs
        };
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const appGridContainerState: AppGridContainerState = this.getCustomState();
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            {
                pTitle: '标题',
                pKey: 'title',
                pValue: appGridContainerState.getTitle(),
                pType: PropertiesEnum.INPUT_TEXT
            },
            {
                pTitle: '主题',
                pKey: 'theme',
                pValue: appGridContainerState.getTheme(),
                pType: PropertiesEnum.INPUT_TEXT
            },
            {
                pTitle: '显示项目控件',
                pKey: 'showAppProjectTree',
                pValue: appGridContainerState.getShowAppProjectTree(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '显示普通查询',
                pKey: 'showAppFindOrdinary',
                pValue: appGridContainerState.getShowAppFindOrdinary(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '显示高级搜索',
                pKey: 'showAppFindAdvanced',
                pValue: appGridContainerState.getShowAppFindAdvanced(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '显示视图',
                pKey: 'showAppGridView',
                pValue: appGridContainerState.getShowAppGridView(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '显示标题',
                pKey: 'showAppGridTitle',
                pValue: appGridContainerState.getShowAppGridTitle(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '显示表头',
                pKey: 'showAppGridMenu',
                pValue: appGridContainerState.getShowAppGridMenu(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '显示分页',
                pKey: 'showAppGridPage',
                pValue: appGridContainerState.getShowAppGridPage(),
                pType: PropertiesEnum.SWITCH
            },
            {
                pTitle: '显示对话框按钮',
                pKey: 'showModalMenu',
                pValue: appGridContainerState.getShowModalMenu(),
                pType: PropertiesEnum.SWITCH
            }
        );
        propertyGroup = propertyGroup.add(
            {
                groupTitle: '列表属性',
                groupKey: 'gridProps',
                colNum: 1,
                propertyList
            }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 设置属性
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any, callback?: () => void) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newAppGridContainerState: AppGridContainerState = AppGridContainerState.set(this.getCustomState(), properties);

        this.setCustomState(newAppGridContainerState, true, callback);
    }

    render() {
        const { pageMode } = this.props;
        const { selectedId, refs } = this.state;
        const appGridContainerState: AppGridContainerState = this.getCustomState();

        return (
            <MapProvider
                data={appGridContainerState.getChildData()}
                selectedId={selectedId}
                pageMode={pageMode}
                theme={appGridContainerState.getTheme()}
                refs={refs}
            >
                <div
                    className="map-grid"
                    style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), true, this.isCanSelected())}
                    onMouseDown={this.fireSelectChange}
                >
                    <div
                        className="map-title"
                    >
                        {appGridContainerState.getTitle()}
                    </div>
                </div>
            </MapProvider>
        );
    }
}
