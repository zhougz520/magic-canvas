import * as React from 'react';
import { RichEdit } from '../RichEdit';

import { BaseState, IComponent, convertFromDataToBaseState, IComData } from '../BaseComponent';
import { ICanvasState, IComponentList } from './ICanvasState';
import { ICanvasProps } from './ICanvasProps';
import { ICanvasComponent } from './ICanvasComponent';
import { CanvasStyle, ContainerStyle } from './model/CanvasStyle';

import { CanvasUtil } from './utils/CanvasUtil';
import { ComponentsUtil } from './utils/ComponentsUtil';
import { DrawUtil } from './utils/DrawUtil';
import { MouseAndKeyUtil } from './utils/MouseAndKeyUtil';
import { PositionUtil } from './utils/PositionUtil';
import { RichEditUtil } from './utils/RichEditUtil';
import { CanvasGlobalParam } from './utils/CanvasGlobalParam';

import { HandleModes } from './handlers/HandleModes';
import { HandlerMap } from './handlers/canvas/HandlerMap';
import { pageActions } from './command/pageActions';

// import { StackUtil } from '../utils/StackUtil';
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

    /**
     * 画布的工具包
     */
    public _canvasUtil: CanvasUtil;
    public _componentsUtil: ComponentsUtil;
    public _drawUtil: DrawUtil;
    public _mouseAndKeyUtil: MouseAndKeyUtil;
    public _positionUtil: PositionUtil;
    public _richEditUtil: RichEditUtil;
    public _canvasGlobalParam: CanvasGlobalParam;

    /**
     * 把事件路由到处理程序
     */
    public _handler: any;
    public _onDocMouseMove: any = this._buildHandler('onDocMouseMove');
    public _onDocMouseUp: any = this._buildHandler('onDocMouseUp');
    public _onDocMouseLeave: any = this._buildHandler('onDocMouseLeave');
    public _onConMouseDown: any = this._buildHandler('onConMouseDown');
    public _onConMouseMove: any = this._buildHandler('onConMouseMove');
    public _onConKeyDown: any = this._buildHandler('onConKeyDown');
    public _onConKeyUp: any = this._buildHandler('onConKeyUp');
    public _onCanDrop: any = this._buildHandler('onCanDrop');
    public _onCanDragOver: any = this._buildHandler('onCanDragOver');

    /**
     * 全局变量
     */
    public _maxZIndex: number = 0;                          // 当前最大z-Index
    public _minZIndex: number = 0;                          // 当前最小z-Index
    public _maxComIndex: number = 0;                        // 当前最大组件index
    public _newComponentCid: string | null = null;          // 新添加的组件cid，用于选中新添加组件

    /**
     * 由于使用的时PureComponent,所有不变的数据直接放在state中,变化的数据放过在CanvasStae中
     * @param props ICanvasProps
     */
    constructor(props: ICanvasProps) {
        super(props);

        /**
         * 初始化画布工具包
         */
        this._canvasUtil = new CanvasUtil(this);
        this._componentsUtil = new ComponentsUtil(this);
        this._drawUtil = new DrawUtil(this);
        this._mouseAndKeyUtil = new MouseAndKeyUtil(this);
        this._positionUtil = new PositionUtil(this);
        this._richEditUtil = new RichEditUtil(this);
        this._canvasGlobalParam = new CanvasGlobalParam();

        // 把props的components的数据转译为baseState
        let componentList: OrderedSet<IComponentList> = OrderedSet();
        this.props.components.map(
            (component) => {
                const comData: IComData = this._componentsUtil.convertComponentToData(component);
                const baseState: BaseState = convertFromDataToBaseState(comData);

                componentList = componentList.add({
                    cid: comData.id,
                    comPath: comData.comPath,
                    baseState,
                    childData: comData.p
                });
            }
        );

        this.state = {
            anchor: null,
            componentList,
            undoStack: Stack(),
            redoStack: Stack()
        };

        // 绑定操作动作（模仿.net partial）
        pageActions.bind(this);
    }

    getEditor = (): RichEdit => {
        return (this.editor as RichEdit);
    }

    /**
     * 根据组件cid获取组件对象
     */
    getComponent = (cid: string): IComponent | null => {
        const ref = this.refs[`c.${cid}`] as any;

        return (ref as IComponent) || null;
    }

    /**
     * 根据组件cid找到组件对象
     */
    findComponent = (cid: string): IComponent | null => {
        const cids: string[] = cid.split('.');
        let currRefs: any = this.refs;
        let ref: any = null;
        let currCid: string = 'c';
        cids.forEach((currId) => {
            currCid += '.' + currId;
            ref = currRefs[`${currCid}`] as any;
            // TODO Cannot read property 'refs' of undefined，点appGrid中的子组件报错
            currRefs = currRefs[`${currCid}`].refs as any;
        });

        return (ref as IComponent) || null;
    }

    /**
     * 组件选中，画布不要记录组件的位置与大小信息，否则同步信息很乱
     * @param cid 组件ID
     */
    selectionChanging = (cid: string, isCanCtrl: boolean = true): void => {
        // 选中组件就把焦点给到编辑框，随时准备输入
        if (this.editor) {
            this.editor.setFocus();
        }

        // 如果是编辑模式：切换选中或者点击当前组件，结束编辑状态。
        if (this._canvasGlobalParam.getIsRichEditMode() === true) {
            this._richEditUtil.endEdit();
            this._canvasGlobalParam.setIsRichEditMode(false);
        }

        const com = this.findComponent(cid);
        // 设置当前选中是否能够进行拖拽和拖放操作
        this._canvasGlobalParam.setIsCanCtrl(isCanCtrl);
        if (com) {
            this._drawUtil.selectedComponent(cid, com, false);
        }
    }

    /**
     * 执行命令
     * @param cmd 命令参数：{ t: e.addComments, d: {key: xxx, value: xxx, type: xxx, name: xxx} }
     */
    executeCommand(cmd: any) {
        // 解析命令来源
        // eg：e.addComments
        const cmdParams = cmd.t.split('.');
        if (cmdParams[0] === 'e') {
            (this as any)[cmdParams[1]](cmd.d);
        }
    }

    // 给canvas编辑中的组件设置propertyTool中的属性
    executeProperties(pKey: string, pValue: any) {
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
    getSelectedProperties(currentSelectedComponents: Map<string, any>)
        : Array<{pTitle: string, pKey: string, pValue: any, pType: string}> | undefined {
        let propertyResult: Array<{pTitle: string, pKey: string, pValue: any, pType: string}> = [];
        // 多个选中的组件 则获取共同的属性
        if (currentSelectedComponents.size > 1) {
            const components = currentSelectedComponents.toArray();
            for (let i = 0; i < currentSelectedComponents.size; i++) {
                const property = components[i].getPropertiesToProperty();
                if (i === 0) {
                    propertyResult = property;
                } else {
                    for (let x = propertyResult.length - 1; x > -1 ; x--) {
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

    componentDidMount() {
        // 设置事件模式
        this.setMode('canvas');
        // 初始化事件监听
        this.initEventListener();
        // 设置_maxZIndex、_minZIndex
        this._canvasUtil.resetZIndexAndComIndex(true);
    }

    componentDidUpdate(prevProps: ICanvasProps, prevState: ICanvasState) {
        // 如果有新拖入的组件，选中新组件
        if (this._newComponentCid !== null) {
            this.selectionChanging(this._newComponentCid);
            // 清除新添加组件记录
            this._newComponentCid = null;
        }

        // 组件有改变时，重新设置_maxZIndex、_minZIndex
        if (prevState.componentList !== this.state.componentList) {
            this._canvasUtil.resetZIndexAndComIndex(true);
        }
    }

    render() {
        const { componentPosition, canvasSize } = this.props;
        const canvasOffset = componentPosition.canvasOffset;
        const children = this._componentsUtil.getChildrenComponent(this.state.componentList);
        const cursor = this.state.anchor ? this.state.anchor.cursor : 'default';

        return (
            <div
                ref={(handler) => this.container = handler}
                className="container"
                style={{ ...ContainerStyle(canvasSize), cursor }}
            >
                <RichEdit
                    ref={(handler) => this.editor = handler}
                    componentPosition
                />
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
            </div>
        );
    }

    /**
     * 初始化画布事件监听
     */
    public initEventListener = (): void => {
        document.addEventListener('mousemove', this._onDocMouseMove);
        document.addEventListener('mouseup', this._onDocMouseUp);
        document.addEventListener('mouseleave', this._onDocMouseLeave);
        if (this.container) {
            this.container.addEventListener('mousedown', this._onConMouseDown);
            this.container.addEventListener('mousemove', this._onConMouseMove);
            this.container.addEventListener('keydown', this._onConKeyDown);
            this.container.addEventListener('keyup', this._onConKeyUp);
        }
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