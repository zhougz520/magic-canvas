import * as React from 'react';

import { MapComponent } from '../../../index';
import { IBaseProps } from '../../../IBaseProps';
import { IBaseState } from '../../../IBaseState';

import { IComponent } from '../../../IComponent';
import { IComData } from '../../model/types';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../../UniversalComponents';

import { AppProjectTree } from '../../grid/AppProjectTree';
import { AppFindOrdinary } from '../../grid/AppFindOrdinary';
import { AppFindAdvanced } from '../../grid/AppFindAdvanced';
import { AppGridView } from '../../grid/AppGridView';
import { AppGridTitle } from '../../grid/AppGridTitle';
import { AppGridMenu } from '../../grid/AppGridMenu';
import { AppGrid } from '../../grid/AppGrid';
import { AppGridPage } from '../../grid/AppGridPage';

import { List, OrderedSet } from 'immutable';
// tslint:disable-next-line:no-var-requires

import '../../sass/AppGrid.scss';
import { HandleChildCom } from '../../../types';

/* tslint:disable:no-empty-interface jsx-no-string-ref jsx-no-multiline-js jsx-no-lambda */
export interface IAppGridContainerProps extends IBaseProps {
    gridStyle: any;               // 列表样式
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
    theme: any;                       // 皮肤{ black:经典黑, blue:宝石蓝, green:橄榄绿, light-blue:天空蓝, light-green:荷叶绿, red:活力红, orange:欢快橙 }
}

export interface IAppGridContainerState extends IBaseState {
    unfoldAdv: boolean;         // 展开筛选
//     selectedId: string | null;  // 当前选中的子控件id
//     hidden: boolean;
}

export default class AppGridContainer extends MapComponent<IAppGridContainerProps, IAppGridContainerState> {
    static defaultProps = {
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

    private appProjectTree: JSX.Element | null = null;
    private appFindOrdinary: JSX.Element | null = null;
    private appFindAdvanced: JSX.Element | null = null;
    private appGridView: JSX.Element | null = null;
    private appGridTitle: JSX.Element | null = null;
    private appGridMenu: JSX.Element | null = null;
    private appGrid: JSX.Element | null = null;
    private appGridPage: JSX.Element | null = null;
    // private modalMenu: JSX.Element | null = null;

    private _isCanMove: boolean = false;
    private _childPropertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

    constructor(props: IAppGridContainerProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false,
            hover: {},
            unfoldAdv: true
        };
    }

    /**
     * BaseComponent方法：组件是否可以移动
     * 组件自己重写
     */
    public isCanMove = () => {
        return this._isCanMove;
    }

    /************************************* begin 富文本 ****************************************/

    /**
     * 构建要设置的文本属性对象
     */
    public buildRichChildNode = (value: any): any => {
        const obj: any = {};
        obj.title = value;

        return obj;
    }

    /**
     * 根据子组件id获取子组件对象
     */
    public getChildComponent = (cid: string | null): IComponent | null => {
        if (!cid) {
            return null;
        }

        const idList: string[] = cid.split('.');
        let currRefs: any = this.refs;
        let currCid: string = 'c.' + idList[0];

        let ref: any = null;
        for (let i = 1; i < idList.length; i++) {
            currCid += '.' + idList[i];
            ref = currRefs[`${currCid}`] as any;
            if (ref === undefined) {
                return null;
            }
            if (currRefs[`${currCid}`] !== undefined && Object.keys(currRefs[`${currCid}`].refs).length > 0) {
                // 正常情况下一级只有一个，
                // 如果存在多个，则直接进入下一次循环
                currRefs = currRefs[`${currCid}`].refs as any;
            }
        }

        return (ref as IComponent) || null;
    }

    /**
     * 操作子控件
     */
    public handleChildCom = (handle: string, fromFun?: string): boolean => {
        const { selectedId } = this.props;
        if (!selectedId) return false;
        const childCom: any = this.getChildComponent(selectedId);
        if (!childCom) return false;

        let result: boolean = false;
        switch (handle) {
            case HandleChildCom.DELETE:         // 删除
                result = childCom.deleteComponentsById();
                break;
            case HandleChildCom.SELECT_PARENT:  // 选中父组件
                result = childCom.selectedComParent();
                break;
            case HandleChildCom.COPY_COM:       // 复制粘贴控件
                result = childCom.copySelectedCom(fromFun);
                break;
            case HandleChildCom.PASTE_COM:       // 粘贴控件
                result = childCom.parseSelectedCom();
                break;
        }

        return result;
    }

    /************************************* end 富文本 ****************************************/

    /************************************* begin 属性设置 ****************************************/
    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        if (this._childPropertyGroup.size > 0) {
            // 选中子组件，显示子组件的属性栏
            return this._childPropertyGroup;
        } else {
            let propertyList: List<IProperty> = List();
            let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();
            const gridStyleList: any[] = [
                { key: 'simple', value: '简单' },
                { key: 'advanced', value: '复杂' }
            ];
            const {
                gridStyle,
                showAppProjectTree,
                showAppFindOrdinary,
                showAppFindAdvanced,
                showAppGridView,
                showAppGridTitle,
                showAppGridMenu,
                showAppGridPage,
                title
            } = this.props;

            // 列表属性
            propertyList = propertyList.push(
                { pTitle: '标题', pKey: 'title', pValue: title, pType: PropertiesEnum.INPUT_TEXT },
                { pTitle: '列表样式', pKey: 'gridStyle', pValue: gridStyle, pType: PropertiesEnum.SELECT, pList: gridStyleList },
                // { pTitle: '主题', pKey: 'theme', pValue: appGridContainerState.getTheme(), pType: PropertiesEnum.INPUT_TEXT },
                { pTitle: '显示项目控件', pKey: 'showAppProjectTree', pValue: showAppProjectTree, pType: PropertiesEnum.SWITCH },
                { pTitle: '显示普通查询', pKey: 'showAppFindOrdinary', pValue: showAppFindOrdinary, pType: PropertiesEnum.SWITCH },
                { pTitle: '显示高级搜索', pKey: 'showAppFindAdvanced', pValue: showAppFindAdvanced, pType: PropertiesEnum.SWITCH },
                { pTitle: '显示视图', pKey: 'showAppGridView', pValue: showAppGridView, pType: PropertiesEnum.SWITCH },
                { pTitle: '显示标题', pKey: 'showAppGridTitle', pValue: showAppGridTitle, pType: PropertiesEnum.SWITCH },
                { pTitle: '显示表头', pKey: 'showAppGridMenu', pValue: showAppGridMenu, pType: PropertiesEnum.SWITCH },
                { pTitle: '显示分页', pKey: 'showAppGridPage', pValue: showAppGridPage, pType: PropertiesEnum.SWITCH }
                // { pTitle: '显示对话框按钮', pKey: 'showModalMenu', pValue: appGridContainerState.getShowModalMenu(), pType: PropertiesEnum.SWITCH }
            );
            propertyGroup = propertyGroup.add(
                { groupTitle: '列表属性', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
            );
            propertyList = List();

            return propertyGroup;
        }
    }

    /************************************* end 属性设置 ****************************************/
    render() {
        const { hidden, unfoldAdv } = this.state;

        const {
            title,
            showAppProjectTree,
            showAppFindOrdinary,
            showAppFindAdvanced,
            showAppGridView,
            showAppGridTitle,
            showAppGridMenu,
            showAppGrid,
            showAppGridPage,
            id,
            gridStyle,
            selectedId
        } = this.props;
        this.initCom();

        return (
            <div
                className={`page-appgrid ${selectedId === id ? 'map-select-open' : ''}`}
                style={{
                    border: '1px solid #d3d5d9',
                    background: 'white'
                }}
                onMouseDown={this.selectedCom}
                draggable
                onDragOver={this.handleFieldOver}
                // onDragOver={this.onDrageOver}
                onDragLeave={this.handleLeave}
                onDragEnd={this.handleLeave}
                ref={(ref) => this.com = ref}
            >
                {/* 列表组件标题 */}
                <div
                    className="map-title"
                >
                    {hidden ? '' : title}
                </div>
                <div className="map-grid">
                    <div className="listheader-search">
                        {/* 项目 */}
                        {
                            showAppProjectTree ? this.appProjectTree : ''
                        }

                        {/* 普通查询 */}
                        {
                            showAppFindOrdinary ? this.appFindOrdinary : ''
                        }

                        {/* 高级搜索展开按钮 */}
                        {
                           showAppFindAdvanced ?
                                <a className="btn-adv-search" style={{ display: 'inline' }} onClick={this.changeUnfoldAdv}>{unfoldAdv ? '收起筛选' : '展开筛选'}</a> : ''
                        }
                    </div>

                    {/* 高级搜索 */}
                    {
                        showAppFindAdvanced && unfoldAdv ?
                            <div className="map-appfilter" style={{ borderWidth: '0px' }}>
                                {this.appFindAdvanced}
                            </div> : ''
                    }

                    {/* 视图 + Title + Menu */}
                    {
                        showAppGridView || showAppGridTitle || showAppGridMenu ?
                            <div className="listheader">
                                <div className={`mc-listheader mc-listheader--${gridStyle}`}>
                                    {/* 视图 */}
                                    {
                                        showAppGridView ? this.appGridView : ''
                                    }
                                    {/* Title */}
                                    {
                                        showAppGridTitle ? this.appGridTitle : ''
                                    }
                                    {/* Menu */}
                                    {
                                        showAppGridMenu ? this.appGridMenu : ''
                                    }
                                </div>
                            </div> : ''
                    }
                    {/* AppGrid */}
                    {
                        showAppGrid ? this.appGrid : ''
                    }

                    {/* AppGridPage */}
                    {
                        showAppGridPage ? this.appGridPage : ''
                    }
                </div>
            </div>
        );
    }

    /**
     * 加载子组件
     */
    private initCom = () => {
        const {
            pageMode,
            gridStyle,
            showAppFindOrdinary,
            showAppGridTitle,
            showAppGridView,
            theme,
            selectComChange,
            setChildPropertyGroup,
            doChildDbClickToEdit,
            updateProps,
            getRefs,
            selectedId,
            stateData,
            p
        } = this.props;

        p.components.map(
            (component: IComData) => {
                const id: string = component.p.id;
                switch (component.t) {
                    case 'MapComponent/newMap/grid/AppProjectTree':
                        this.appProjectTree = (
                            <AppProjectTree
                                ref={`c.${id}`}
                                theme={theme}
                                gridStyle={gridStyle}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppFindOrdinary':
                        const showSearch = showAppFindOrdinary === false ? true : !this.state.unfoldAdv;
                        this.appFindOrdinary = (
                            <AppFindOrdinary
                                ref={`c.${id}`}
                                theme={theme}
                                gridStyle={gridStyle}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                {...component.p}
                                map_fo_search={showSearch}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppFindAdvanced':
                        this.appFindAdvanced = (
                            <AppFindAdvanced
                                ref={`c.${id}`}
                                theme={theme}
                                gridStyle={gridStyle}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppGridView':
                        this.appGridView = (
                            <AppGridView
                                ref={`c.${id}`}
                                theme={theme}
                                gridStyle={gridStyle}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppGridTitle':
                        this.appGridTitle = (
                            <AppGridTitle
                                ref={`c.${id}`}
                                theme={theme}
                                gridStyle={gridStyle}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                {...component.p}
                            />
                        );
                    case 'MapComponent/newMap/grid/AppGridMenu':
                        const onlyMenu: boolean = gridStyle === 'advanced' && !showAppGridTitle && !showAppGridView ? true : false;
                        this.appGridMenu = (
                            <AppGridMenu
                                ref={`c.${id}`}
                                theme={theme}
                                gridStyle={gridStyle}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                {...component.p}
                                onlyMenu={onlyMenu}
                            />
                        );
                        break;
                        case 'MapComponent/newMap/grid/AppGrid':
                        this.appGrid = (
                            <AppGrid
                                ref={`c.${id}`}
                                theme={theme}
                                gridStyle={gridStyle}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                {...component.p}
                            />
                        );
                        break;
                    case 'MapComponent/newMap/grid/AppGridPage':
                        this.appGridPage = (
                            <AppGridPage
                                ref={`c.${id}`}
                                theme={theme}
                                gridStyle={gridStyle}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                                {...component.p}
                            />
                        );
                        break;
                }
            }
        );
    }

    /**
     * 展开筛选\收起筛选
     */
    private changeUnfoldAdv = () => {
        this.setState({
            unfoldAdv: !this.state.unfoldAdv
        });
    }

}
