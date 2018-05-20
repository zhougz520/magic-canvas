import * as React from 'react';

import { BarList, IBarListComponent } from './BarList';
import { Stage, ComponentsType, ICompos } from '../../../src';
import './solution.css';
import { config } from './config';
import { Map } from 'immutable';

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
    private barList: IBarListComponent |null = null;

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
    changeStageOffset = (titleBarCollapsed: boolean, resourceBarCollapsed: boolean, propsBarCollapsed: boolean) => {
        this.getStage().changeStageOffset(titleBarCollapsed, resourceBarCollapsed, propsBarCollapsed);
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
    onPropertyProperties = (compProperty: Array<{pTitle: string, pKey: string, pValue: any, pType: string}> | undefined
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
                    // objectlist={this.props.objectlist}
                />
                <Stage
                    config={config}
                    ref={(render) => this.stage = render}
                    components={detail.content.components as ComponentsType}
                    onCommandProperties={this.onCommandProperties}
                    onPropertyProperties={this.onPropertyProperties}
                    clearSelectedProperty={this.clearSelectedProperty}
                />
            </div>
        );
    }
}

const detail = {
    content: {
        components: [
            {
                t: 'BaseComponent/demo/Demo',
                p: {
                    id: 'cs1',
                    txt_v: '我是测试组件1',
                    w: 200,
                    h: 125,
                    l: 10,
                    t: 10,
                    zIndex: 1
                }
            },
            {
                t: 'UniversalComponents/ImageCom/Image',
                p: {
                    id: 'cs6',
                    txt_v: '我是测试组件6',
                    w: 300, // 默认宽
                    h: 200,
                    l: 150,
                    t: 150,
                    zIndex: 6
                }
            },
            {
                t: 'UniversalComponents/Attachment/Attachment',
                p: {
                    id: 'cs7',
                    txt_v: '我是测试组件7',
                    w: 60, // 默认宽
                    h: 75,
                    l: 200,
                    t: 500,
                    zIndex: 6
                }
            },
            {
                t: 'BaseComponent/demo/Demo',
                p: {
                    id: 'cs2',
                    txt_v: '我是测试组件2',
                    w: 300,
                    h: 200,
                    l: 300,
                    t: 10,
                    zIndex: 2
                }
            },
            {
                t: 'BaseComponent/demo/Demo',
                p: {
                    id: 'cs3',
                    txt_v: '我是测试组件3',
                    w: 200,
                    h: 200,
                    l: 150,
                    t: 150,
                    zIndex: 3
                }
            },
            {
                t: 'MapComponent/map/AppGridForm',
                p: {
                    id: 'cs4',
                    txt_v: '编辑页面',
                    w: 600,
                    h: 400,
                    l: 450,
                    t: 350,
                    zIndex: 4,
                    p: {
                        components: [
                            {
                                t: 'MapComponent/map/ProjectDDTree',
                                p: {
                                    id: 'cs4.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppView',
                                p: {
                                    id: 'cs4.cs2'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppFind',
                                p: {
                                    id: 'cs4.cs3'
                                }
                            },
                            {
                                t: 'MapComponent/map/AppGridMenu',
                                p: {
                                    id: 'cs4.cs4',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs4.cs4.cs1',
                                                    map_mi_sa: true
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs4.cs4.cs2',
                                                    map_mi_txt: '新增'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridMenuItem',
                                                p: {
                                                    id: 'cs4.cs4.cs3',
                                                    map_mi_txt: '删除'
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                t: 'MapComponent/map/AppGrid',
                                p: {
                                    id: 'cs4.cs5',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/AppGridTitle',
                                                p: {
                                                    id: 'cs4.cs5.cs1',
                                                    map_gt_txt: 'AAA'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridTitle',
                                                p: {
                                                    id: 'cs4.cs5.cs2',
                                                    map_gt_txt: 'BBB'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/AppGridTitle',
                                                p: {
                                                    id: 'cs4.cs5.cs3',
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
