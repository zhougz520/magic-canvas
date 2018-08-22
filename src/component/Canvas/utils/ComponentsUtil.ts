import * as React from 'react';
import { IBoundary, IOffset, IRange, AlignType } from '../model/types';
import {
    BaseState,
    IComponent,
    ComponentType,
    IComData,
    IPosition,
    ISize,
    ICommentsList
} from '../../BaseComponent';
import { Canvas } from '../Canvas';
import { IComponentList } from '../model/types';
import { convertFromDataToBaseState } from '../encoding/convertFromDataToBaseState';
import { Map, OrderedSet, Set, List } from 'immutable';

export class ComponentsUtil {
    // 粘贴次数
    public _pasteNum: number = 0;
    // 同一批次添加组件次数
    public _addNum: number = 0;

    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 画布增加组件
     * @param dataList 组件的数据流List
     * @param position 组件在画布上添加的位置
     */
    addCanvasComponent = (
        dataList: List<any>,
        position: IOffset = { x: 0, y: 0 },
        isDrop: boolean = false,
        callback?: () => void
    ): void => {
        let addComponentList: List<IComponentList> = List();
        const timeStamp: number = Date.parse(new Date().toString());

        let componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        dataList.map(
            (data: any) => {
                const comData: IComData = this._canvas._componentsUtil.convertComponentToData(data, position);
                const baseState: BaseState = convertFromDataToBaseState(comData, data.t);
                const component: IComponentList = {
                    cid: comData.id,
                    comPath: data.t,
                    baseState,
                    childData: comData.p,
                    initType: 'Add'
                };

                componentList = componentList.add(component);
                addComponentList = addComponentList.push(component);

                // 如果是拖拽添加组件，选中当前添加的组件
                if (isDrop === true) {
                    this._canvas._newComponentCid = comData.id;
                }
                // 添加批注模式，记录当前添加的批注cid
                if (this._canvas._isAddCommentsMode === true) {
                    this._canvas._commentsUtil._currentCommentsCid = comData.id;
                }
            }
        );
        this._addNum = 0;

        this._canvas.setState({
            componentList
        }, () => {
            callback && callback();
            this._canvas._canvasUtil.repaintCanvas(0, 0, true);
            // 添加撤销栈
            this._canvas._stackUtil.setCanvasUndoStack(
                timeStamp,
                'create',
                addComponentList
            );
        });
    }

    /**
     * 画布删除组件
     */
    deleteCanvasComponent = (cids: Set<string>, isSetUndoStack: boolean = true) => {
        let delComponentList: List<IComponentList> = List();
        const timeStamp: number = Date.parse(new Date().toString());
        let commentsNum: number = 0;

        let componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        componentList.map(
            (component: IComponentList) => {
                if (cids.contains(component.cid)) {
                    componentList = componentList.delete(component);

                    delComponentList = delComponentList.push({
                        cid: component.cid,
                        comPath: component.comPath,
                        baseState: (this._canvas.getComponent(component.cid) as IComponent).getBaseState(),
                        childData: component.childData,
                        initType: 'Stack'
                    });

                    if (component.baseState.getCurrentContent().getComType() === 'Comments') {
                        commentsNum += 1;
                    }
                }
            }
        );

        this._canvas.setState({
            componentList
        }, () => {
            // 添加撤销栈
            if (isSetUndoStack === true) {
                this._canvas._stackUtil.setCanvasUndoStack(
                    timeStamp,
                    'remove',
                    delComponentList
                );
            }
            if (commentsNum > 0) {
                this.resetCommentsList();
            }
        });
        this._canvas._drawUtil.clearSelected();
        this._canvas._drawUtil.clearDragBox();
    }

    /**
     * 删除批注后，重新整理组件的锚点
     */
    resetCommentsList = () => {
        const componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        componentList.map(
            (component: IComponentList) => {
                const com: IComponent | null = this._canvas.getComponent(component.cid);
                if (com && com.getCommentsList().size > 0) {
                    const commentsList: ICommentsList[] = com.getCommentsList().toArray();
                    for (let i = commentsList.length - 1; i >= 0; i--) {
                        if (this._canvas.getComponent(commentsList[i].cid) === null) {
                            commentsList.splice(i, 1);
                        }
                    }
                    com.setCommentsList(List(commentsList));
                }
            }
        );
    }

    /**
     * 画布粘贴组件
     * @param dataList 组件的数据流List
     * @param position 组件在画布上添加的位置
     */
    pasteCanvasComponent = (
        dataList: any[]
    ): void => {
        this._pasteNum += 1;
        let addComponentList: List<IComponentList> = List();
        const timeStamp: number = new Date().getTime();

        let componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        dataList.map(
            (data: any) => {
                data.offset = { x: 0, y: 0 };
                const { l, t } = data.p;
                const getPasteCustomStateFun = require(`../../${data.t}`).getPasteCustomState;
                const comData: IComData = this._canvas._componentsUtil.convertComponentToData(
                    data,
                    { x: l + 10 * this._pasteNum, y: t + 10 * this._pasteNum },
                    getPasteCustomStateFun ? getPasteCustomStateFun(this._canvas, data.p.customState) : data.p.customState
                );
                const baseState: BaseState = convertFromDataToBaseState(comData, data.t);
                const component: IComponentList = {
                    cid: comData.id,
                    comPath: data.t,
                    baseState,
                    childData: comData.p,
                    initType: 'Paste'
                };

                componentList = componentList.add(component);
                addComponentList = addComponentList.push(component);
                this._canvas._newComponentCid = comData.id;
            }
        );
        this._addNum = 0;

        this._canvas.setState({
            componentList
        }, () => {
            this._canvas._canvasUtil.repaintCanvas(0, 0, true);
            // 添加撤销栈
            this._canvas._stackUtil.setCanvasUndoStack(
                timeStamp,
                'create',
                addComponentList
            );
        });
    }

    /**
     * 粘贴截图
     * @param dataUrl 图片的dataUrl
     * @param size 图片大小
     */
    pasteImage = (
        uid: string,
        size: { width: number; height: number; }
    ): void => {
        const currentMousePosition = this._canvas._canvasGlobalParam.currentMousePosition;
        const data = {
            t: 'UniversalComponents/ImageCom/Image',
            p: {
                name: '图片',
                w: size.width + 22,
                h: size.height + 52,
                l: currentMousePosition ? currentMousePosition.x : 100,
                t: currentMousePosition ? currentMousePosition.y : 100,
                txt_v: '图片',
                customState: {
                    src: '',
                    uid,
                    width: size.width,
                    height: size.height,
                    imageMagnifierList: OrderedSet(),
                    maxMagnifierId: 0,
                    backgroundColor: '#FFF',
                    borderColor: '#FFF',
                    borderWidth: 0
                }
            },
            offset: {
                x: 0,
                y: 0
            }
        };

        this._pasteNum += 1;
        let addComponentList: List<IComponentList> = List();
        const timeStamp: number = new Date().getTime();
        let componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;

        const comData: IComData = this._canvas._componentsUtil.convertComponentToData(data, { x: data.p.l, y: data.p.t }, data.p.customState);
        const baseState: BaseState = convertFromDataToBaseState(comData, data.t);
        const component: IComponentList = {
            cid: comData.id,
            comPath: data.t,
            baseState,
            childData: comData.p,
            initType: 'Paste'
        };

        componentList = componentList.add(component);
        addComponentList = addComponentList.push(component);
        this._canvas._newComponentCid = comData.id;
        this._addNum = 0;

        this._canvas.setState({
            componentList
        }, () => {
            this._canvas._canvasUtil.repaintCanvas(0, 0, true);
            // 添加撤销栈
            this._canvas._stackUtil.setCanvasUndoStack(
                timeStamp,
                'create',
                addComponentList
            );
        });
    }

    /**
     * 根据component数据创建画布上的组件
     */
    getChildrenComponent = (componentList: OrderedSet<IComponentList>): any[] => {
        const array: any[] = [];

        componentList.map(
            (com: IComponentList) => {
                const comModule = this._canvas._componentsUtil.getComponentModule(com.comPath);

                array.push(React.createElement(comModule,
                    Object.assign({}, {
                        baseState: com.baseState,
                        childData: com.childData,
                        comPath: com.comPath,
                        initType: com.initType
                    }, {
                            key: com.cid,
                            ref: `c.${com.cid}`,
                            pageMode: this._canvas.props.pageMode,
                            componentPosition: this._canvas.props.componentPosition,
                            selectionChanging: this._canvas.selectionChanging,
                            repaintSelected: this._canvas._drawUtil.repaintSelected,
                            repaintCanvas: this._canvas._canvasUtil.repaintCanvas,
                            dbClickToBeginEdit: this._canvas._richEditUtil.dbClickToBeginEdit,
                            getComponent: this._canvas.getComponent,
                            resetMaxAndMinZIndex: this._canvas._canvasUtil.resetZIndexAndComIndex,
                            setCanvasUndoStack: this._canvas._stackUtil.setCanvasUndoStack,
                            executeCommand: this._canvas.executeCommand,
                            onCommandProperties: this._canvas.props.onCommandProperties,
                            userInfo: this._canvas.props.userInfo
                        })
                ));
            }
        );

        return array;
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
     * @param position 把组件拖拽进画布的偏移量
     * @param customState 组件的customState
     */
    public convertComponentToData = (
        component: any,
        position: IOffset = { x: 0, y: 0 },
        customState: any = null
    ): IComData => {
        const offset: IOffset = component.offset;

        let data: IComData;
        if (offset !== undefined) {
            this._addNum += 1;
            const comPath: string = component.t;
            // TODO Map分包后需要修改
            const comType: ComponentType | null = this.getComponentType(comPath);
            // 添加新组件
            data = {
                ...component.p,
                id: comType === 'Comments' ? 'cm' + (this._canvas._maxCommentsIndex + this._addNum) : 'cs' + (this._canvas._maxComIndex + this._addNum),
                l: position.x - offset.x,
                t: position.y - offset.y,
                zIndex: comType === 'Comments' ? this._canvas._maxCommentsZIndex + 1 : this._canvas._maxZIndex + 1,
                comType,
                customState,
                commentsList: List()
            };
        } else {
            // 页面第一次加载
            data = {
                ...component.p
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
            maxZIndex: isFinite(Math.max(...zIndexList)) === true ? Math.max(...zIndexList) : this._canvas._maxZIndex,
            minZIndex: isFinite(Math.min(...zIndexList)) === true ? Math.min(...zIndexList) : this._canvas._minZIndex,
            maxCommentsZIndex: isFinite(Math.max(...commentsZIndexList)) === true ? Math.max(...commentsZIndexList) : this._canvas._maxCommentsZIndex,
            minCommentsZIndex: isFinite(Math.min(...commentsZIndexList)) === true ? Math.min(...commentsZIndexList) : this._canvas._minCommentsZIndex
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
            spacing = (range.width - range.sumComWidth) / (range.comNum - 1);
        } else if (alignType === 'Vertical' && selectedComponents.size > 1) {
            selectedComponents = selectedComponents.sortBy(
                (com: IComponent) => {
                    return com.getPosition().top;
                }
            ) as Map<string, IComponent>;
            spacing = (range.height - range.sumComHeight) / (range.comNum - 1);
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
                com.setPosition(position, true);
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
