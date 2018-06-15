import * as React from 'react';
import { RichEdit, Wingman } from '../RichEdit';
import { IProperty } from '../UniversalComponents';

import { BaseState, IComponent, IComData } from '../BaseComponent';
import { ICanvasState } from './ICanvasState';
import { ICanvasProps } from './ICanvasProps';
import { ICanvasComponent } from './ICanvasComponent';
import { CanvasStyle, ContainerStyle } from './model/CanvasStyle';
import { IComponentList, IStack } from './model/types';

import { CanvasGlobalParam } from './utils/CanvasGlobalParam';
import { CanvasUtil } from './utils/CanvasUtil';
import { CommentsUtil } from './utils/CommentsUtil';
import { ComponentsUtil } from './utils/ComponentsUtil';
import { DrawUtil } from './utils/DrawUtil';
import { MouseAndKeyUtil } from './utils/MouseAndKeyUtil';
import { PositionUtil } from './utils/PositionUtil';
import { RichEditUtil } from './utils/RichEditUtil';
import { StackUtil } from './utils/StackUtil';

import { convertFromDataToBaseState } from './encoding/convertFromDataToBaseState';
import { convertFromBaseStateToData } from './encoding/convertFromBaseStateToData';
import { HandleModes } from './handlers/HandleModes';
import { HandlerMap } from './handlers/canvas/HandlerMap';
import { pageActions } from './command/pageActions';

import { Map, OrderedSet, Stack } from 'immutable';

/**
 * 定义一组对象来对应所有可能的'mode'
 */
const handlerMap: any = {
    canvas: HandlerMap
};

/* tslint:disable:no-console */
/* tslint:disable:jsx-no-string-ref */
export class Canvas extends React.PureComponent<ICanvasProps, ICanvasState> implements ICanvasComponent {
    container: HTMLDivElement | null = null;
    canvas: HTMLDivElement | null = null;
    editor: RichEdit | null = null;
    wingman: Wingman | null = null;

    /**
     * 画布的工具包
     */
    public _canvasGlobalParam: CanvasGlobalParam;
    public _canvasUtil: CanvasUtil;
    public _commentsUtil: CommentsUtil;
    public _componentsUtil: ComponentsUtil;
    public _drawUtil: DrawUtil;
    public _mouseAndKeyUtil: MouseAndKeyUtil;
    public _positionUtil: PositionUtil;
    public _richEditUtil: RichEditUtil;
    public _stackUtil: StackUtil;

    /**
     * 把事件路由到处理程序
     */
    public _handler: any;
    public _onDocMouseMove: any = this._buildHandler('onDocMouseMove');
    public _onDocMouseLeave: any = this._buildHandler('onDocMouseLeave');
    public _onDocMouseDown: any = this._buildHandler('onDocMouseDown');
    public _onDocMouseUp: any = this._buildHandler('onDocMouseUp');
    public _onDocKeyDown: any = this._buildHandler('onDocKeyDown');
    public _onDocKeyUp: any = this._buildHandler('onDocKeyUp');
    public _onCanDrop: any = this._buildHandler('onCanDrop');
    public _onCanDragOver: any = this._buildHandler('onCanDragOver');

    /**
     * 全局变量
     */
    public _maxZIndex: number = 0;                          // 当前最大z-Index
    public _minZIndex: number = 0;                          // 当前最小z-Index
    public _maxComIndex: number = 0;                        // 当前最大组件index
    public _maxCommentsZIndex: number = 100000;             // 当前最大批注z-Index
    public _minCommentsZIndex: number = 100000;             // 当前最小批注z-Index
    public _maxCommentsIndex: number = 0;                   // 当前最大批注index
    public _newComponentCid: string | null = null;          // 新添加的组件cid，用于选中新添加组件
    public _isWingmanFocus: boolean = false;                // 僚机是否获取到焦点
    public _isRichEditMode: boolean = false;                // 是否富文本编辑模式
    public _undoStack: Stack<IStack> = Stack();             // 撤销栈
    public _redoStack: Stack<IStack> = Stack();             // 重做栈
    public _isAddCommentsMode: boolean = false;             // 是否新增批注模式
    public _isDirty: boolean = false;                       // 画布是否弄脏

    /**
     * 由于使用的时PureComponent,所有不变的数据直接放在state中,变化的数据放过在CanvasStae中
     * @param props ICanvasProps
     */
    constructor(props: ICanvasProps) {
        super(props);

        /**
         * 初始化画布工具包
         */
        this._canvasGlobalParam = new CanvasGlobalParam(this);
        this._canvasUtil = new CanvasUtil(this);
        this._commentsUtil = new CommentsUtil(this);
        this._componentsUtil = new ComponentsUtil(this);
        this._drawUtil = new DrawUtil(this);
        this._mouseAndKeyUtil = new MouseAndKeyUtil(this);
        this._positionUtil = new PositionUtil(this);
        this._richEditUtil = new RichEditUtil(this);
        this._stackUtil = new StackUtil(this);

        // 把props的components的数据转译为baseState
        let componentList: OrderedSet<IComponentList> = OrderedSet();
        this.props.components.map(
            (component) => {
                const comData: IComData = this._componentsUtil.convertComponentToData(component);
                const baseState: BaseState = convertFromDataToBaseState(comData, component.t);

                componentList = componentList.add({
                    cid: comData.id,
                    comPath: component.t,
                    baseState,
                    childData: comData.p,
                    initType: 'Init'
                });
            }
        );

        this.state = {
            cursor: 'default',
            componentList
        };

        // 绑定操作动作（模仿.net partial）
        pageActions.bind(this);
    }

    getEditor = (): RichEdit => {
        return (this.editor as RichEdit);
    }

    getWingman = (): Wingman => {
        return (this.wingman as Wingman);
    }

    /**
     * 根据组件cid获取组件对象
     */
    getComponent = (cid: string): IComponent | null => {
        const idList: string[] = cid.split('.');
        let currRefs: any = this.refs;
        let currCid: string = 'c';

        let ref: any = null;
        for (let i = 0; i < idList.length; i++) {
            currCid += '.' + idList[i];
            ref = currRefs[`${currCid}`] as any;
            if (ref === undefined) {
                return null;
            }
            currRefs = currRefs[`${currCid}`].refs as any;
        }

        return (ref as IComponent) || null;
    }

    /**
     * 组件选中，画布不要记录组件的位置与大小信息，否则同步信息很乱
     * @param cid 组件ID
     */
    selectionChanging = (cid: string): void => {
        // 选中组件就把焦点给到编辑框，随时准备输入
        this.getWingman().setFocus();

        // 如果是编辑模式：切换选中或者点击当前组件，结束编辑状态。
        if (this._isRichEditMode === true) {
            this._richEditUtil.endEdit();
        }

        const com = this.getComponent(cid);
        if (com) {
            this._drawUtil.selectedComponent(cid, com, false);
        }
    }

    /**
     * 执行命令
     * @param cmd 命令参数：{ t: e.addComments, d: {key: xxx, value: xxx, type: xxx, name: xxx} }
     */
    executeCommand = (cmd: any) => {
        // 解析命令来源
        // eg：e.addComments
        const cmdParams = cmd.t.split('.');
        if (cmdParams[0] === 'e') {
            (this as any)[cmdParams[1]](cmd.d);
        }
    }

    // 给canvas编辑中的组件设置propertyTool中的属性
    executeProperties = (pKey: string, pValue: any) => {
        const currentSelectedComponent: Map<string, any> = this._canvasGlobalParam.getSelectedComponents();
        currentSelectedComponent.map(
            (com) => {
                com.setPropertiesFromProperty(pKey, pValue);
                if (pKey === 'borderWidth') {
                    setTimeout(() => {
                        this._drawUtil.repaintSelected();
                    }, 0);
                }
            }
        );
    }

    // 获取canvas编辑中的组件的属性
    getSelectedProperties = (currentSelectedComponents: Map<string, any>): IProperty[] | undefined => {
        let propertyResult: IProperty[] = [];
        // 多个选中的组件 则获取共同的属性
        if (currentSelectedComponents.size > 1) {
            const components = currentSelectedComponents.toArray();
            for (let i = 0; i < currentSelectedComponents.size; i++) {
                const property = components[i].getPropertiesToProperty();
                if (i === 0) {
                    propertyResult = property;
                } else {
                    for (let x = propertyResult.length - 1; x > -1; x--) {
                        let isNeedDelete: boolean = true;
                        for (let y = property.length - 1; y > -1; y--) {
                            if (propertyResult[x].pKey === property[y].pKey
                                && propertyResult[x].pType === property[y].pType) {
                                isNeedDelete = false;
                            }
                        }
                        if (isNeedDelete) {
                            propertyResult.splice(x, 1);
                        }
                    }
                }
            }

            return propertyResult;
        } else if (currentSelectedComponents.size === 1) {
            // 一个选中的组件 则获取该组件的属性
            return propertyResult = currentSelectedComponents.first().getPropertiesToProperty();
        } else {
            return undefined;
        }
    }

    /**
     * 收集保存数据
     */
    getSaveData = (): any => {
        const componentList = this.state.componentList;
        const components: any[] = [];
        componentList.map(
            (component: IComponentList) => {
                const com = this.getComponent(component.cid);
                if (com) {
                    components.push(
                        convertFromBaseStateToData(
                            com.getBaseState(),
                            {
                                comPath: com.getBaseProps().comPath,
                                childData: com.getBaseProps().childData
                            }
                        )
                    );
                }
            }
        );

        const detail = {
            content: {
                components
            }
        };

        return detail;
    }

    getIsDirty = (): boolean => {
        return this._isDirty;
    }

    componentDidMount() {
        // 设置事件模式
        this.setMode('canvas');
        // 初始化事件监听
        this.initEventListener();
        // 设置_maxZIndex、_minZIndex、_maxComIndex
        this._canvasUtil.resetZIndexAndComIndex(true);
    }

    componentDidUpdate(prevProps: ICanvasProps, prevState: ICanvasState) {
        // 如果有新拖入的组件，选中新组件
        if (this._newComponentCid !== null) {
            this.selectionChanging(this._newComponentCid);
            this._canvasUtil.pushOpenOtherComponent(this._newComponentCid);
            // 清除新添加组件记录
            this._newComponentCid = null;
        }

        // 组件有改变时，重新设置_maxZIndex、_minZIndex、_maxComIndex
        if (prevState.componentList !== this.state.componentList) {
            this._canvasUtil.resetZIndexAndComIndex(true);
        }
    }

    render() {
        const { componentPosition, canvasSize } = this.props;
        const canvasOffset = componentPosition.canvasOffset;
        const children = this._componentsUtil.getChildrenComponent(this.state.componentList);
        const cursor = this.state.cursor;

        return (
            <div
                ref={(handler) => this.container = handler}
                className="container"
                style={{ ...ContainerStyle(canvasSize), cursor }}
            >
                <div
                    // tslint:disable-next-line:jsx-no-lambda
                    ref={(handler) => this.canvas = handler}
                    style={CanvasStyle(canvasOffset)}
                    className="canvas"
                    onDrop={this._onCanDrop}
                    onDragOver={this._onCanDragOver}
                >
                    {children}
                </div>
                <RichEdit
                    ref={(handler) => this.editor = handler}
                />
                <Wingman
                    ref={(handler) => this.wingman = handler}
                    setIsWingmanFocus={this._canvasGlobalParam.setIsWingmanFocus}
                />
            </div>
        );
    }

    /**
     * 初始化画布事件监听
     * 事件触发顺序：false，由内而外；true，由外向内；react合成事件绑定在document节点上
     */
    public initEventListener = (): void => {
        document.addEventListener('mousemove', this._onDocMouseMove);
        document.addEventListener('mouseleave', this._onDocMouseLeave);
        (this.canvas as HTMLDivElement).addEventListener('mousedown', this._onDocMouseDown);
        document.addEventListener('mouseup', this._onDocMouseUp);
        document.addEventListener('keydown', this._onDocKeyDown);
        document.addEventListener('keyup', this._onDocKeyUp);
    }

    /**
     * 设置事件模式
     */
    public setMode = (mode: HandleModes): void => {
        this._handler = handlerMap[mode];
    }

    /**
     * 构建一个将事件传递给指定程序的方法
     * @param eventName 事件名称
     */
    private _buildHandler(eventName: string): any {
        return (e: any) => {
            const method = this._handler && this._handler[eventName];
            method && method(this, e);
        };
    }
}
