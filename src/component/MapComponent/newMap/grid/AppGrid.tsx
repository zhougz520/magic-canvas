import * as React from 'react';
import { IPropertyGroup, IProperty, PropertiesEnum } from '../../../UniversalComponents';

import { IBaseProps } from '../../IBaseProps';
import { IBaseState } from '../../IBaseState';
import { MapComponent } from '../../MapComponent';
import { AppGridHeader } from './AppGridHeader';
import { AppGridContent } from './AppGridContent';

import { GlobalUtil } from '../../../util';
import { OrderedSet, List } from 'immutable';

import { Checkbox} from 'antd';

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
            { groupTitle: '组件属性', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
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
        const componentsColumnsChild = (components && components[0].p.p) ? components[0].p.p.components : null;
        const componentsRowChild = (components && components[1].p.p) ? components[1].p.p.components : null;
        const columns: any = [];
        const rows: any = [];
        // 获取表格columns
        if (componentsColumnsChild) {
            componentsColumnsChild.map(
                (com: any) => {
                    const { p } = com;
                    columns.push(p);
                }
            );
        }

        // 获取表格rows
        if (componentsRowChild && columns.length > 0) {
            componentsRowChild.map(
                (com: any) => {
                    const { p } = com;
                    rows.push(p);
                }
            );
        }
        let appGridHeader: JSX.Element | null = null;
        let appGridContent: JSX.Element | null = null;
        if (!GlobalUtil.isUndefined(components)) {
            components.map(
                (com: any, index: number) => {
                    const { t, p } = com;
                    if (t === 'MapComponent/newMap/grid/AppGridHeader') {
                        appGridHeader = (
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
                                map_g_check={map_g_check}
                                map_g_num={map_g_num}
                            />
                        );
                    }
                    if (t === 'MapComponent/newMap/grid/AppGridContent') {
                        appGridContent = (
                            <AppGridContent
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
                                columns={columns}
                            />
                        );
                    }
                }
            );
        }

        return (
            <div
                className={`map-grid-viewcontainer ${selectedId === id ? 'map-select-open' : ''}`}
                ref={(ref) => this.com = ref}
                onDragOver={this.handleOver}
                onDragLeave={this.handleLeave}
                onMouseDown={this.selectedCom}
            >
                 <div className="map-grid-viewport map-table-header flex-row" style={{ height: '260px', position: 'relative'}}>
                    {/* 序号 & 复选 */}
                    <div className="flex-column">
                        {/* 表头 */}
                        <div className="flex-row item-center">
                            {
                                map_g_check ? (
                                    <div className="table-title title-width" style={{width: 40, lineHeight: '40px', textAlign: 'center', background: '#fafafa'}}><Checkbox /></div>
                                ) : null
                            }
                            {/* 序号列 */}
                            {
                                map_g_num ? (
                                    <div className="table-title" style={{width: 60, lineHeight: '40px', textAlign: 'center', background: '#fafafa'}}>序列号</div>
                                ) : null
                            }
                        </div>
                        {/* 表体 */}
                        {rows.map(
                            (com: any, index: number) => {
                                return (
                                    <div className="flex-row item-center" key={index}>
                                        {map_g_check ? <div className="rowItem" style={{width: 40}}><Checkbox /></div> : null}
                                        {map_g_num ? (<div className="rowItem" style={{width: 60}}>{index + 1}</div>) : null}
                                    </div>
                                );
                            })
                        }
                    </div>
                     {/* 标题头 */}
                     <div className="flex1">
                        <div id="table" style={{width: '100%', height: '250px', overflow: 'auto'}}>
                            {appGridHeader !== null ? appGridHeader : ''}
                            {appGridContent !== null ? appGridContent : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
