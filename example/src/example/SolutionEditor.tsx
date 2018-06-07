import * as React from 'react';

import { BarList, IBarListComponent } from './BarList';
import { Stage, ComponentsType, ICompos } from '../../../src';
import './solution.css';
import { config } from './config';
import { detail1, detail2 } from './data';
import { Map, List } from 'immutable';

export interface ISolutionProp {
    [key: string]: any;
}

export interface ISolutionState {
    compos: ICompos;
    canvasSize: { width: number, height: number };
}

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export default class SolutionEditor extends React.PureComponent<ISolutionProp, ISolutionState> {
    private stage: Stage | null = null;
    private barList: IBarListComponent | null = null;

    constructor(props: ISolutionProp) {
        super(props);
        this.state = {
            compos: config.componentPosition,
            canvasSize: config.canvasSize
        };
    }

    getStage = (): Stage => {
        return (this.stage as Stage);
    }

    // 修改画布的偏移量
    changeStageOffset = (resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => {
        this.getStage().changeStageOffset(resourceBarCollapsed, propsBarCollapsed);
    }

    highPerformance = (value: boolean) => {
        this.getStage().changeHighPerformance(value);
    }

    // 获取命令，并传给canvas
    onCommandEmitted = (cmd: any) => {
        this.getStage().getCanvas().executeCommand(cmd);
    }

    // 获取选中的组件集合并传给CommandBar
    onCommandProperties = (selectedComs: Map<string, any>): void => {
        if (this.barList) {
            this.barList.setCommandState(selectedComs);
        }
    }

    // 将输入参数：编辑中的组件属性，传给propertyTool
    onPropertyProperties = (compProperty: Array<{ pTitle: string, pKey: string, pValue: any, pType: string }> | undefined
    ): void => {
        if (this.barList && compProperty !== undefined) {
            this.barList.setPropertyState(compProperty);
        }
    }

    // 将propertyTool的修改的属性传给canvas 设置对应的选中控件
    onFireProperties = (pKey: string, pValue: any) => {
        this.getStage().getCanvas().executeProperties(pKey, pValue);
    }

    // 清除属性工具栏状态
    clearSelectedProperty = () => {
        if (this.barList) {
            this.barList.clearPropertyState();
        }
    }

    render() {
        return (
            <div className="main-editor">
                <BarList
                    ref={(render) => this.barList = render}
                    changeStageOffset={this.changeStageOffset}
                    onCommandEmitted={this.onCommandEmitted}
                    onFireProperties={this.onFireProperties}
                    onPropertyProperties={this.onPropertyProperties}
                    highPerformance={this.highPerformance}
                />
                <Stage
                    config={config}
                    ref={(render) => this.stage = render}
                    components={detail2.content.components as ComponentsType}
                    onCommandProperties={this.onCommandProperties}
                    onPropertyProperties={this.onPropertyProperties}
                    clearSelectedProperty={this.clearSelectedProperty}
                    pageMode={'Edit'}
                />
            </div>
        );
    }
}

export const detail = {
    content: {
        components: [

            {
                t: 'MapComponent/map/AppGridContainer',
                p: {
                    id: 'cs1',
                    txt_v: '编辑页面',
                    w: 600,
                    h: 400,
                    l: 450,
                    t: 350,
                    zIndex: 4,
                    comType: 'Map',
                    customState: null,
                    commentsList: List(),
                    p: {
                        components: [
                            {
                                t: 'MapComponent/map/ProjectDDTree',
                                p: {
                                    id: 'cs1.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppView',
                                p: {
                                    id: 'cs1.cs2'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppFind',
                                p: {
                                    id: 'cs1.cs3'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppGridMenu',
                                p: {
                                    id: 'cs1.cs4',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs1.cs4.cs1',
                                                    map_mi_txt: '新增'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs1.cs4.cs2',
                                                    map_mi_txt: '删除'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs1.cs4.cs3',
                                                    map_mi_sa: true
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                t: 'MapComponent/map/AppGrid',
                                p: {
                                    id: 'cs1.cs5',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/AppGridTitle',
                                                p: {
                                                    id: 'cs1.cs5.cs1',
                                                    map_gt_txt: 'AAA'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridTitle',
                                                p: {
                                                    id: 'cs1.cs5.cs2',
                                                    map_gt_txt: 'BBB'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridTitle',
                                                p: {
                                                    id: 'cs1.cs5.cs3',
                                                    map_gt_txt: 'CCC'
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },
    layout: { mode: 'free' }
};
