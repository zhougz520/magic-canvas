import * as React from 'react';

import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../IBaseProps';
import { IBaseState } from '../IBaseState';
import { MapComponent } from '../MapComponent';
import { AppGridHeader } from './AppGridHeader';

import { GlobalUtil } from '../../../util';
import { OrderedSet, List } from 'immutable';
import { DragDropContext, Droppable, DroppableProvided } from 'react-beautiful-dnd';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridProps extends IBaseProps {
    map_g_check?: boolean;
    map_g_num?: boolean;
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal jsx-no-string-ref no-shadowed-variable */
export class AppGrid extends MapComponent<IAppGridProps, IAppGridState> {

    static defaultProps = {
        map_g_check: false,
        map_g_num: true
    };

    public headerCom: HTMLElement | null = null;

    constructor(props: IAppGridProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false,
            hover: {}
        };
    }

    /**
     * 重载添加组件
     * @param t 组件路径
     */
    public componentCanBeAdded(t: string) {
        return (t === 'MapComponent/newMap/grid/AppGridHeader');
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        const { map_g_check, map_g_num } = this.props;
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 列表属性
        propertyList = propertyList.push(
            { pTitle: '显示序号列', pKey: 'map_g_num', pValue: map_g_num, pType: PropertiesEnum.SWITCH },
            { pTitle: '允许多选', pKey: 'map_g_check', pValue: map_g_check, pType: PropertiesEnum.SWITCH }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '组件属性', groupKey: 'gridProps', isActive: true, colNum: 1, propertyList }
        );
        propertyList = List();

        return propertyGroup;
    }

    render() {
        const {
            theme,
            pageMode,
            selectedId,
            selectComChange,
            setChildPropertyGroup,
            doChildDbClickToEdit,
            updateProps,
            getRefs,
            stateData,
            p,
            map_g_check,
            map_g_num,
            id
        } = this.props;

        const components = GlobalUtil.isUndefined(p) ? undefined : p.components;
        const appGridHeader: any[] = [];
        const appGridBody: any[] = [];
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any, index: number) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppGridHeader') {
                        appGridHeader.push(
                            <AppGridHeader
                                ref={`c.${p.id}`}
                                key={p.id}
                                index={index}
                                {...p}
                                theme={theme}
                                pageMode={pageMode}
                                selectedId={selectedId}
                                selectComChange={selectComChange}
                                setChildPropertyGroup={setChildPropertyGroup}
                                doChildDbClickToEdit={doChildDbClickToEdit}
                                updateProps={updateProps}
                                getRefs={getRefs}
                                stateData={stateData}
                            />
                        );

                        appGridBody.push(
                            <td key={p.id} style={{ padding: '0px', borderRight: '1px', borderRightStyle: 'solid', borderRightColor: 'transparent', margin: '0px', height: '0px', width: `${p.map_gh_width ? p.map_gh_width : 60}px` }} />
                        );
                    }
                }
            );
        }

        return (
            <div
                className={`map-grid-viewcontainer ${selectedId === id ? 'map-select-open' : ''}`}
                style={Object.assign({}, { height: '200px' }, this.state.hover)}
                ref={(ref) => this.com = ref}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                onMouseDown={this.selectedCom}
            >
                <div className="map-grid-viewport">
                    {/* 标题头 */}
                    <div className="map-grid-columns">
                        {/* 数据列 */}
                        <div className="map-grid-columns-view" ref={(ref) => this.headerCom = ref}>
                            <DragDropContext onDragEnd={this.onDragEnd}>
                                <table className="map-grid-table" cellSpacing="0" cellPadding="0" style={{ border: '0', height: 'auto' }}>
                                    <Droppable droppableId="droppable-appGrid" direction="horizontal">
                                        {
                                            (provided: DroppableProvided) =>
                                                (
                                                    <tbody ref={provided.innerRef}>
                                                        <tr style={{ height: '0px' }}>
                                                            {/* 多选 */}
                                                            {
                                                                map_g_check ? (
                                                                    <td style={{ padding: '0px', border: '0px', margin: '0px', height: '0px', width: '47px' }} />
                                                                ) : null
                                                            }
                                                            {/* 序号列 */}
                                                            {
                                                                map_g_num ? (
                                                                    <td style={{ padding: '0px', border: '0px', margin: '0px', height: '0px', width: '47px' }} />
                                                                ) : null
                                                            }
                                                            {
                                                                appGridBody.length > 0 ? appGridBody :
                                                                    (
                                                                        <td className="map-grid-emptyText" />
                                                                    )
                                                            }
                                                        </tr>
                                                        <tr style={{ height: '34px' }}>
                                                            {/* 多选 */}
                                                            {
                                                                map_g_check ? (
                                                                    <td className="map-grid-headerCell" style={{ width: '47px', textAlign: 'center' }}>
                                                                        <div className="map-grid-headerCell-outer" style={{ paddingLeft: '0px', paddingRight: '2px' }}>
                                                                            <div className="map-grid-headerCell-inner map-grid-headerCell-nowrap">
                                                                                <span className="map-grid-checkbox map-grid-checkbox__check-all" />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                ) : null
                                                            }
                                                            {/* 序号列 */}
                                                            {
                                                                map_g_num ? (
                                                                    <td className="map-grid-headerCell" style={{ width: '47px', textAlign: 'center' }}>
                                                                        <div className="map-grid-headerCell-outer" style={{ paddingLeft: '0px', paddingRight: '2px' }}>
                                                                            <div className="map-grid-headerCell-inner map-grid-headerCell-nowrap">
                                                                                &nbsp;
                                                        </div>
                                                                        </div>
                                                                    </td>
                                                                ) : null
                                                            }
                                                            {
                                                                appGridHeader.length > 0 ? appGridHeader :
                                                                    (
                                                                        <td className="map-grid-headerCell" style={{ width: '120px' }} />
                                                                    )
                                                            }
                                                        </tr>
                                                    </tbody>
                                                )
                                        }
                                    </Droppable>
                                </table>
                            </DragDropContext>
                        </div>
                        {/* 操作列 */}
                        <div className="map-grid-columns-lock map-grid-columns-lock-right" style={{ width: '124px' }}>
                            <table className="map-grid-table" cellSpacing="0" cellPadding="0" style={{ border: '0' }}>
                                <tbody>
                                    <tr style={{ height: '0px' }}>
                                        <td style={{ padding: '0px', border: '0px', margin: '0px', height: '0px', width: '100px' }} />
                                        <td style={{ padding: '0px', border: '0px', margin: '0px', height: '0px', width: '24px' }} />
                                    </tr>
                                    <tr>
                                        <td className="map-grid-headerCell" style={{ textAlign: 'right' }}>
                                            <div className="map-grid-headerCell-outer">
                                                <div className="map-grid-headerCell-inner map-grid-headerCell-nowrap">操作</div>
                                            </div>
                                        </td>
                                        <td className="map-grid-headerCell">
                                            <div className="map-grid-headerCell-outer" style={{ paddingLeft: '0px', paddingRight: '2px' }}>
                                                <div className="map-grid-headerCell-inner map-grid-headerCell-nowrap">
                                                    <div className="map-grid-refresh" title="刷新" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* 数据 */}
                    <div className="map-grid-body" style={{ height: '165px' }}>
                        <div className="map-grid-rows-view" style={{ marginLeft: '0px', width: 'auto', marginRight: '125px' }} onScroll={this.onScroll}>
                            <table className="map-grid-table" cellSpacing="0" cellPadding="0" style={{ border: '0px', width: '100%' }}>
                                <tbody>
                                    <tr style={{ height: '30px' }}>
                                        {/* 多选 */}
                                        {
                                            map_g_check ? (
                                                <td style={{ padding: '0px', border: '0px', margin: '0px', height: '0px', width: '47px' }} />
                                            ) : null
                                        }
                                        {/* 序号列 */}
                                        {
                                            map_g_num ? (
                                                <td style={{ padding: '0px', border: '0px', margin: '0px', height: '0px', width: '47px' }} />
                                            ) : null
                                        }
                                        {
                                            appGridBody.length > 0 ? appGridBody :
                                                (
                                                    <td className="map-grid-emptyText" />
                                                )
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private onScroll = (e: any) => {
        if (this.headerCom) {
            this.headerCom.scrollTo(e.target.scrollLeft, e.target.scrollLeft);
        }
    }
}
