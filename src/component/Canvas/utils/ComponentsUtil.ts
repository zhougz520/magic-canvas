import * as React from 'react';
import { IBoundary, IOffset } from '../model/types';
import { BaseState, IComponent, ComponentType, IComData, convertFromDataToBaseState } from '../../BaseComponent';
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
                id: 'cs' + (this._canvas._maxComIndex + 1),
                l: position.x - offset.x,
                t: position.y - offset.y,
                zIndex: this._canvas._maxZIndex + 1,
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
    public updateSelectedComponentsZIndex(adjustment: number): void {
        const selectedComponents: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
        selectedComponents.map(
            (com: IComponent) => {
                const oldZIndex: number = com.getHierarchy();
                const newZIndex = oldZIndex + adjustment;

                com.setHierarchy(newZIndex);
            }
        );
    }

    /**
     * 获得选中组件的z-Index范围
     */
    public getSelectedComponentZIndexRange(): { maxZIndex: number; minZIndex: number } {
        let maxZIndex: number = 0;
        let minZIndex: number = 100000;

        const selectedComponents: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
        selectedComponents.map(
            (com: IComponent) => {
                const zIndex: number = com.getHierarchy();
                maxZIndex = Math.max(maxZIndex, zIndex);
                minZIndex = Math.min(minZIndex, zIndex);
            }
        );

        return {
            maxZIndex,
            minZIndex
        };
    }

}
