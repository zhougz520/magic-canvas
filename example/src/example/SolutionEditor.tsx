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
                    components={detail.content.components as ComponentsType}
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
                    l: 150,
                    t: 150,
                    zIndex: 4,
                    comType: 'Map',
                    customState: {
                        components: [
                            {
                                t: 'MapComponent/map/grid/ProjectDDTree',
                                p: {
                                    id: 'cs1.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppView',
                                p: {
                                    id: 'cs1.cs2'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppFind',
                                p: {
                                    id: 'cs1.cs3'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppGridMenu',
                                p: {
                                    id: 'cs1.cs4',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/grid/AppGridMenuItem',
                                                p: {
                                                    id: 'cs1.cs4.cs1',
                                                    map_mi_txt: '新增'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/grid/AppGridMenuItem',
                                                p: {
                                                    id: 'cs1.cs4.cs2',
                                                    map_mi_txt: '删除'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/grid/AppGridMenuItem',
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
                                t: 'MapComponent/map/grid/AppGrid',
                                p: {
                                    id: 'cs1.cs5',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/grid/AppGridTitle',
                                                p: {
                                                    id: 'cs1.cs5.cs1',
                                                    map_gt_txt: 'AAA'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/grid/AppGridTitle',
                                                p: {
                                                    id: 'cs1.cs5.cs2',
                                                    map_gt_txt: 'BBB'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/grid/AppGridTitle',
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
                    },
                    commentsList: List(),
                    p: {
                        components: [
                            {
                                t: 'MapComponent/map/grid/ProjectDDTree',
                                p: {
                                    id: 'cs1.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppView',
                                p: {
                                    id: 'cs1.cs2'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppFind',
                                p: {
                                    id: 'cs1.cs3'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppGridMenu',
                                p: {
                                    id: 'cs1.cs4',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/grid/AppGridMenuItem',
                                                p: {
                                                    id: 'cs1.cs4.cs1',
                                                    map_mi_txt: '新增'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/grid/AppGridMenuItem',
                                                p: {
                                                    id: 'cs1.cs4.cs2',
                                                    map_mi_txt: '删除'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/grid/AppGridMenuItem',
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
                                t: 'MapComponent/map/grid/AppGrid',
                                p: {
                                    id: 'cs1.cs5',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/grid/AppGridTitle',
                                                p: {
                                                    id: 'cs1.cs5.cs1',
                                                    map_gt_txt: 'AAA'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/grid/AppGridTitle',
                                                p: {
                                                    id: 'cs1.cs5.cs2',
                                                    map_gt_txt: 'BBB'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/grid/AppGridTitle',
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
            },
            {
                t: 'MapComponent/map/AppFormContainer',
                p: {
                    id: 'cs2',
                    txt_v: '编辑页面',
                    w: 600,
                    h: 400,
                    l: 250,
                    t: 250,
                    zIndex: 4,
                    comType: 'Map',
                    customState: {
                        components: [
                            {
                                t: 'MapComponent/map/form/AppFormMenu',
                                p: {
                                    id: 'cs2.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/map/form/AppForm',
                                p: {
                                    id: 'cs2.cs2',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/form/NavBarItem',
                                                p: {
                                                    id: 'cs2.cs2.cs1',
                                                    p: {
                                                        components: [
                                                            {
                                                                t: 'MapComponent/map/form/TabForm',
                                                                p: {
                                                                    id: 'cs2.cs2.cs1.cs1',
                                                                    p: {
                                                                        components: [
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs1.cs1.cs1',
                                                                                    p: {
                                                                                        components: [
                                                                                            {
                                                                                                t: 'MapComponent/map/form/SectionForm',
                                                                                                p: {
                                                                                                    id: 'cs2.cs2.cs1.cs1.cs1.cs1',
                                                                                                    p: {
                                                                                                        components: [
                                                                                                            {
                                                                                                                t: 'MapComponent/map/form/Section',
                                                                                                                p: {
                                                                                                                    id: 'cs2.cs2.cs1.cs1.cs1.cs1.cs1'
                                                                                                                }
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs1.cs1.cs2',
                                                                                    p: {
                                                                                        components: [
                                                                                            {
                                                                                                t: 'MapComponent/map/form/SectionForm',
                                                                                                p: {
                                                                                                    id: 'cs2.cs2.cs1.cs1.cs2.cs1',
                                                                                                    p: {
                                                                                                        components: [
                                                                                                            {
                                                                                                                t: 'MapComponent/map/form/Section',
                                                                                                                p: {
                                                                                                                    id: 'cs2.cs2.cs1.cs1.cs2.cs1.cs1'
                                                                                                                }
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs1.cs1.cs3'
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/form/NavBarItem',
                                                p: {
                                                    id: 'cs2.cs2.cs2',
                                                    p: {
                                                        components: [
                                                            {
                                                                t: 'MapComponent/map/form/TabForm',
                                                                p: {
                                                                    id: 'cs2.cs2.cs2.cs1',
                                                                    p: {
                                                                        components: [
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs2.cs1.cs1'
                                                                                }
                                                                            },
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs2.cs1.cs2',
                                                                                    p: {
                                                                                        components: [
                                                                                            {
                                                                                                t: 'MapComponent/map/form/SectionForm',
                                                                                                p: {
                                                                                                    id: 's2.cs2.cs2.cs1.cs2.cs1'
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
                                                    }
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/form/NavBarItem',
                                                p: {
                                                    id: 'cs2.cs2.cs3',
                                                    p: {
                                                        components: [
                                                            {
                                                                t: 'MapComponent/map/form/TabForm',
                                                                p: {
                                                                    id: 'cs2.cs2.cs3.cs1',
                                                                    p: {
                                                                        components: [
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs3.cs1.cs1'
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
                                    }
                                }
                            }
                        ]
                    },
                    commentsList: List(),
                    p: {
                        components: [
                            {
                                t: 'MapComponent/map/form/AppFormMenu',
                                p: {
                                    id: 'cs2.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/map/form/AppForm',
                                p: {
                                    id: 'cs2.cs2',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/form/NavBarItem',
                                                p: {
                                                    id: 'cs2.cs2.cs1',
                                                    p: {
                                                        components: [
                                                            {
                                                                t: 'MapComponent/map/form/TabForm',
                                                                p: {
                                                                    id: 'cs2.cs2.cs1.cs1',
                                                                    p: {
                                                                        components: [
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs1.cs1.cs1',
                                                                                    p: {
                                                                                        components: [
                                                                                            {
                                                                                                t: 'MapComponent/map/form/SectionForm',
                                                                                                p: {
                                                                                                    id: 'cs2.cs2.cs1.cs1.cs1.cs1',
                                                                                                    p: {
                                                                                                        components: [
                                                                                                            {
                                                                                                                t: 'MapComponent/map/form/Section',
                                                                                                                p: {
                                                                                                                    id: 'cs2.cs2.cs1.cs1.cs1.cs1.cs1'
                                                                                                                }
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs1.cs1.cs2',
                                                                                    p: {
                                                                                        components: [
                                                                                            {
                                                                                                t: 'MapComponent/map/form/SectionForm',
                                                                                                p: {
                                                                                                    id: 'cs2.cs2.cs1.cs1.cs2.cs1',
                                                                                                    p: {
                                                                                                        components: [
                                                                                                            {
                                                                                                                t: 'MapComponent/map/form/Section',
                                                                                                                p: {
                                                                                                                    id: 'cs2.cs2.cs1.cs1.cs2.cs1.cs1'
                                                                                                                }
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs1.cs1.cs3'
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/form/NavBarItem',
                                                p: {
                                                    id: 'cs2.cs2.cs2',
                                                    p: {
                                                        components: [
                                                            {
                                                                t: 'MapComponent/map/form/TabForm',
                                                                p: {
                                                                    id: 'cs2.cs2.cs2.cs1',
                                                                    p: {
                                                                        components: [
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs2.cs1.cs1'
                                                                                }
                                                                            },
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs2.cs1.cs2',
                                                                                    p: {
                                                                                        components: [
                                                                                            {
                                                                                                t: 'MapComponent/map/form/SectionForm',
                                                                                                p: {
                                                                                                    id: 's2.cs2.cs2.cs1.cs2.cs1'
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
                                                    }
                                                }
                                            },
                                            {
                                                t: 'MapComponent/map/form/NavBarItem',
                                                p: {
                                                    id: 'cs2.cs2.cs3',
                                                    p: {
                                                        components: [
                                                            {
                                                                t: 'MapComponent/map/form/TabForm',
                                                                p: {
                                                                    id: 'cs2.cs2.cs3.cs1',
                                                                    p: {
                                                                        components: [
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs2.cs2.cs3.cs1.cs1'
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
