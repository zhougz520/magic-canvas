import * as React from 'react';
import { IBoundary, IOffset, IRange, AlignType } from '../model/types';
import { BaseState, IComponent, ComponentType, IComData, convertFromDataToBaseState, IPosition, ISize } from '../../BaseComponent';
import { Canvas } from '../Canvas';
import { IComponentList } from '../ICanvasState';
import { Map, OrderedSet, Set } from 'immutable';

export class ComponentsUtil {
    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 画布增加组件,返回新的组件List
     * @param data 组件的数据流
     * @param position 组件在画布上添加的位置
     */
    addCancasComponent = (data: any, position: IOffset = { x: 0, y: 0 }): OrderedSet<IComponentList> => {
        const comData: IComData = this._canvas._componentsUtil.convertComponentToData(data, position);
        const baseState: BaseState = convertFromDataToBaseState(comData);
        // 记录新添加的组件cid
        this._canvas._newComponentCid = comData.id;

        const oldComponentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        const newComponentList: OrderedSet<IComponentList> = oldComponentList.add({
            cid: comData.id,
            comPath: comData.comPath,
            baseState,
            childData: comData.p
        });

        return newComponentList;
    }

    /**
     * 画布删除组件
     */
    deleteCanvasComponent = (cids: Set<string>, isSetStack: boolean = true) => {
        let componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        componentList.map(
            (component: IComponentList) => {
                if (cids.contains(component.cid)) {
                    componentList = componentList.delete(component);
                }
            }
        );

        const state: any = {
            componentList
        };
        // if (isSetStack === true) {
        //     // 删除组件记栈
        //     const oldUndoStack: Stack<IStack> = this.state.undoStack;
        //     const newUndoStack: Stack<IStack> = StackUtil.getCanvasStack(this, oldUndoStack, 'remove', comDataList);
        //     state = {
        //         componentList,
        //         undoStack: newUndoStack
        //     };
        // }

        this._canvas.setState(state);
        this._canvas._drawUtil.clearSelected();
        this._canvas._drawUtil.clearDragBox();
    }

    /**
     * 根据component数据创建画布上的组件
     */
    getChildrenComponent = (componentList: OrderedSet<IComponentList>): React.ReactFragment => {
        const array: { [key: string]: React.ReactElement<any> } = {};

        componentList.map(
            (com: IComponentList) => {
                const comModule = this._canvas._componentsUtil.getComponentModule(com.comPath);

                array[com.cid] = React.createElement(comModule,
                    Object.assign({}, { baseState: com.baseState, childData: com.childData }, {
                        ref: `c.${com.cid}`,
                        selectionChanging: this._canvas.selectionChanging,
                        repaintSelected: this._canvas._drawUtil.repaintSelected,
                        repaintCanvas: this._canvas._canvasUtil.repaintCanvas,
                        dbClickToBeginEdit: this._canvas._richEditUtil.dbClickToBeginEdit,
                        getComponent: this._canvas.getComponent,
                        resetMaxAndMinZIndex: this._canvas._canvasUtil.resetZIndexAndComIndex
                    })
                );
            }
        );
        const createFragment = require('react-addons-create-fragment');

        return createFragment(array);
    }

    /**
     * 得到选中组件的坐标范围 {startPoint: {x: 0, y: 0}, endPoint: {x: 10, y: 10}}
     * @param coms 组件对象
     */
    // TODO 与getSelectedComponentsRange功能重复
    public getComponentsRange = (coms: Map<string, any>): IBoundary => {
        const startPoint: IOffset = { x: 1000000, y: 1000000 };
        const endPoint: IOffset = { x: 0, y: 0 };

        coms.map(
            (com: IComponent) => {
                const position = com.getPosition();
                const size = com.getSize();

                startPoint.x = Math.min(startPoint.x, position.left);
                startPoint.y = Math.min(startPoint.y, position.top);

                endPoint.x = Math.max(endPoint.x, position.left + size.width);
                endPoint.y = Math.max(endPoint.y, position.top + size.height);
            }
        );

        return {
            startPoint,
            endPoint
        };
    }

    /**
     * 更新ContentState中的CommentsMap
     * @param coms 选中组件
     * @param componentIndex Comments的componentIndex
     */
    public updateCommentsMap = (coms: Map<string, any>, componentIndex: number) => {
        // 更新所选组件的commentsMap
        coms.map(
            (com: IComponent) => {
                const oldCommentsMap = com.getCommentsMap();
                const newCommentsMap = oldCommentsMap.merge(
                    Map().set('cs' + componentIndex, 'Comments')
                );
                com.setCommentsMap(newCommentsMap);
            }
        );
    }

    /**
     * 通过csType获取组件类型
     * @param csType 组件路径
     */
    public getComponentType = (csType: string): ComponentType | null => {
        let comType: ComponentType | null;
        switch (csType.split('/')[0]) {
            case 'MapComponent':
                comType = 'Map';
                break;
            case 'UniversalComponents':
                comType = 'Universal';
                break;
            case 'Comments':
                comType = 'Comments';
                break;
            default:
                comType = null;
                break;
        }

        return comType;
    }

    /**
     * 获取组件的module
     * @param comPath 组件的默认到处路径
     */
    public getComponentModule = (comPath: string): any => {
        // TODO Map组件分包后需修改
        return require(`../../${comPath}`).default;
    }

    /**
     * 把组件的jsonData转译成IComData结构的data
     * @param component jsonData
     * @param zIndex 组件的z-Index
     * @param position 把组件拖拽进画布的偏移量
     * @param customState 组件的customState
     */
    public convertComponentToData = (
        component: any,
        position: IOffset = { x: 0, y: 0 },
        customState: any = null
    ): IComData => {
        const comPath: string = component.t;
        // TODO Map分包后需要修改
        const comType: ComponentType | null = this.getComponentType(comPath);
        const offset: IOffset = component.offset;

        let data: IComData;
        if (offset !== undefined) {
            // 添加新组件
            data = {
                ...component.p,
                id: comType === 'Comments' ? 'cm' + (this._canvas._maxCommentsIndex + 1) : 'cs' + (this._canvas._maxComIndex + 1),
                l: position.x - offset.x,
                t: position.y - offset.y,
                zIndex: comType === 'Comments' ? this._canvas._maxCommentsZIndex + 1 : this._canvas._maxZIndex + 1,
                comType,
                customState,
                commentsMap: Map(),
                comPath
            };
        } else {
            // 页面第一次加载
            data = {
                ...component.p,
                comType,
                customState,
                commentsMap: Map(),
                comPath
            };
        }

        return data;
    }

    /**
     * 更新选中组件的层级
     * @param adjustment 调整层级数量
     */
    public updateSelectedComponentsZIndex(adjustment: number, adjustmentComments: number): void {
        const selectedComponents: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
        selectedComponents.map(
            (com: IComponent) => {
                const oldZIndex: number = com.getHierarchy();
                let newZIndex: number = 0;

                const comType: ComponentType | null = com.getComType();
                if (comType === 'Comments') {
                    newZIndex = oldZIndex + adjustmentComments;
                } else {
                    newZIndex = oldZIndex + adjustment;
                }

                com.setHierarchy(newZIndex);
            }
        );
    }

    /**
     * 获得选中组件的z-Index范围
     */
    public getSelectedComponentsZIndexRange(): {
        maxZIndex: number;
        minZIndex: number;
        maxCommentsZIndex: number;
        minCommentsZIndex: number;
    } {
        const zIndexList: number[] = [];
        const commentsZIndexList: number[] = [];

        const selectedComponents: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
        selectedComponents.map(
            (com: IComponent) => {
                const zIndex: number = com.getHierarchy();
                const comType: ComponentType | null = com.getComType();
                if (comType === 'Comments') {
                    commentsZIndexList.push(zIndex);
                } else {
                    zIndexList.push(zIndex);
                }
            }
        );

        return {
            maxZIndex: isFinite(Math.max(...zIndexList))  === true ? Math.max(...zIndexList) : this._canvas._maxZIndex,
            minZIndex: isFinite(Math.min(...zIndexList))  === true ? Math.min(...zIndexList) : this._canvas._minZIndex,
            maxCommentsZIndex: isFinite(Math.max(...commentsZIndexList))  === true ? Math.max(...commentsZIndexList) : this._canvas._maxCommentsZIndex,
            minCommentsZIndex: isFinite(Math.min(...commentsZIndexList))  === true ? Math.min(...commentsZIndexList) : this._canvas._minCommentsZIndex
        };
    }

    /**
     * 设置选中组件的对齐坐标
     * @param range 选择组件的范围
     * @param alignType 对齐类型
     */
    public updateSelectedComponentsPosition(range: IRange, alignType: AlignType) {
        let selectedComponents: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
        const position: IPosition = { top: 0, left: 0 };
        let prevEndPosition: IPosition = { top: 0, left: 0 };
        let spacing: number = 0;

        // 调整间距的时候：1.把组件按position排序；2.计算间距
        if (alignType === 'Horizontal' && selectedComponents.size > 1) {
            selectedComponents = selectedComponents.sortBy(
                (com: IComponent) => {
                    return com.getPosition().left;
                }
            ) as Map<string, IComponent>;
            spacing = (range.width - range.sumComWidth) / ( range.comNum - 1 );
        } else if (alignType === 'Vertical' && selectedComponents.size > 1) {
            selectedComponents = selectedComponents.sortBy(
                (com: IComponent) => {
                    return com.getPosition().top;
                }
            ) as Map<string, IComponent>;
            spacing = (range.height - range.sumComHeight) / ( range.comNum - 1 );
        }

        selectedComponents.map(
            (com: IComponent) => {
                const comPosition: IPosition = com.getPosition();
                const comSize: ISize = com.getSize();

                switch (alignType) {
                    case 'Left':
                        position.left = range.left;
                        position.top = comPosition.top;
                        break;
                    case 'Center':
                        position.left = Math.ceil(range.left + (range.width - comSize.width) / 2);
                        position.top = comPosition.top;
                        break;
                    case 'Right':
                        position.left = range.left + range.width - comSize.width;
                        position.top = comPosition.top;
                        break;
                    case 'Top':
                        position.top = range.top;
                        position.left = comPosition.left;
                        break;
                    case 'Middle':
                        position.top = Math.ceil(range.top + (range.height - comSize.height) / 2);
                        position.left = comPosition.left;
                        break;
                    case 'Bottom':
                        position.top = range.top + range.height - comSize.height;
                        position.left = comPosition.left;
                        break;
                    case 'Horizontal':
                        if (com !== selectedComponents.first() && com !== selectedComponents.last()) {
                            position.left = Math.ceil(prevEndPosition.left + spacing);
                            position.top = comPosition.top;
                        } else {
                            position.left = comPosition.left;
                            position.top = comPosition.top;
                        }
                        break;
                    case 'Vertical':
                        if (com !== selectedComponents.first() && com !== selectedComponents.last()) {
                            position.top = Math.ceil(prevEndPosition.top + spacing);
                            position.left = comPosition.left;
                        } else {
                            position.top = comPosition.top;
                            position.left = comPosition.left;
                        }
                        break;
                }

                prevEndPosition = {
                    top: position.top + comSize.height,
                    left: position.left + comSize.width
                };
                com.setPosition(position);
            }
        );
    }

    /**
     * 获取选中组件的position、size范围
     */
    public getSelectedComponentsRange(): IRange {
        const startPosition: IPosition = {
            top: 100000,
            left: 100000
        };
        const endPosition: IPosition = {
            top: 0,
            left: 0
        };
        let comNum: number = 0;
        let sumComWidth: number = 0;
        let sumComHeight: number = 0;

        const selectedComponents: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
        selectedComponents.map(
            (com: IComponent) => {
                const position: IPosition = com.getPosition();
                const size: ISize = com.getSize();

                startPosition.top = Math.min(startPosition.top, position.top);
                startPosition.left = Math.min(startPosition.left, position.left);
                endPosition.top = Math.max(endPosition.top, position.top + size.height);
                endPosition.left = Math.max(endPosition.left, position.left + size.width);

                comNum += 1;
                sumComWidth += size.width;
                sumComHeight += size.height;
            }
        );

        return {
            top: startPosition.top,
            left: startPosition.left,
            width: endPosition.left - startPosition.left,
            height: endPosition.top - startPosition.top,
            comNum,
            sumComWidth,
            sumComHeight
        };
    }
}
