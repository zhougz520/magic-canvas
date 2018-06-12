import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';

import { BaseState } from './model/BaseState';
import { ContentState } from './model/ContentState';
import { SizeState, ISize } from './model/SizeState';
import { PositionState, IPosition } from './model/PositionState';
import { EditType, IRichEditOption, CallBackType, ICommentsList, ComponentType } from './model/types';

import { BoxType, IAnchor, countAnchorPoint, findAnchorPoint } from '../util';
import { OperationType, IComponentList, InitType } from '../Canvas';
import { IReactData, IBaseData } from '../Draw';
import { Stack, List } from 'immutable';

/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class BaseComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {

    componentDidMount() {
        const currMaskLayer = document.getElementById(this.getCid());
        if (currMaskLayer !== null) {
            currMaskLayer.style.width = this.getSize().width + 'px';
            currMaskLayer.style.height = this.getSize().height + 'px';
        }
    }

    componentDidUpdate(prevProps: IBaseProps, prevState: IBaseState) {
        const currentContent: ContentState = this.state.baseState.getCurrentContent();
        const prevContent: ContentState = prevState.baseState.getCurrentContent();

        if (
            currentContent.getPositionState().equals(prevContent.getPositionState()) === false
        ) {
            // 如果有批注，更新批注的位置
            const commentsList: List<ICommentsList> = this.getCommentsList();
            const componentPosition: IPosition = this.getPosition();
            commentsList.map(
                (comments: ICommentsList) => {
                    const relativePosition: IPosition = comments.relativePosition;
                    const commentsRectPosition: IPosition = {
                        top: componentPosition.top + relativePosition.top,
                        left: componentPosition.left + relativePosition.left
                    };

                    const commentsRect: IComponent | null = this.props.getComponent(comments.cid);
                    if (commentsRect !== null) {
                        commentsRect.setPosition(commentsRectPosition);
                    }
                }
            );
        }
    }

    /**
     * 获取组件路径
     */
    public getBaseProps = (): IBaseProps => {
        return this.props;
    }

    /**
     * 获取组件的baseState
     */
    public getBaseState = (): BaseState => {
        const baseState: BaseState = this.state.baseState;

        return baseState;
    }

    /**
     * 设置组件的baseState
     * @param newBaseState 构建好的新的baseState
     */
    public setBaseState = (newBaseState: BaseState): void => {
        this.setState({
            baseState: newBaseState
        });
    }

    /**
     * 获取组件size
     * 返回：ISize类型的对象{width: 10, height: 10}
     */
    public getSize = (): ISize => {
        const sizeState: SizeState = this.getSizeState();

        return {
            width: sizeState.getWidth(),
            height: sizeState.getHeight()
        };
    }

    /**
     * 设置组件size
     * 注意：设置结束后请手动调用setUndoStack方法增加撤销栈
     * @param size ISize类型的对象{width: 10, height: 10}
     */
    public setSize = (size: ISize): void => {
        const newSizeState: SizeState = SizeState.create(size);

        this.setSizeState(newSizeState);
    }

    /**
     * 获取组件Position
     * 返回：IPosition类型的对象{left: 10, right: 10, top: 10, bottom: 10}
     */
    public getPosition = (): IPosition => {
        const positionState: PositionState = this.getPositionState();

        return {
            top: positionState.getTop(),
            left: positionState.getLeft()
        };
    }

    /**
     * 设置组件Position
     * 注意：设置结束后请手动调用setUndoStack方法增加撤销栈
     * @param Position IPosition类型的对象{left: 10, right: 10, top: 10, bottom: 10}
     */
    public setPosition = (Position: IPosition): void => {
        const newPositionState: PositionState = PositionState.create(Position);

        this.setPositionState(newPositionState);
    }

    /**
     * 获取组件标识cid
     */
    public getCid = (): string => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getCurrentContent().getCid();
    }

    /**
     * 获取组件类型
     */
    public getComType = (): ComponentType | null => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getCurrentContent().getComType();
    }

    /**
     * 获取组件的选中框类型，成员函数
     */
    public getType(): string {
        return BoxType.Base;
    }

    /**
     * 获取组件的边界点
     */
    public getBoundaryPoint = () => {
        const size = this.getSize();
        const position = this.getPosition();

        return {
            pointX: position.left + size.width,
            pointY: position.top + size.height
        };
    }

    /**
     * 获取组件的临时状态
     */
    public getTempContentState = (): ContentState => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getTempContentState();
    }

    /**
     * 获取组件的zIndex
     */
    public getHierarchy = (): number => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getCurrentContent().getZIndex();
    }

    /**
     * 设置组件的层级
     */
    public setHierarchy = (zIndex: number) => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            zIndex
        }) as ContentState;
        const newBaseState = BaseState.push(oldBaseState, newContent);

        this.setState({
            baseState: newBaseState
        }, () => this.callBackForRender('ZIndex'));
    }

    /**
     * 获取组件富文本内容
     * 返回：带格式的富文本内容（html）
     */
    public getRichChildNode = (): any => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getCurrentContent().getRichChildNode();
    }

    /**
     * 设置组件富文本内容
     * @param richChildNode 带格式的富文本内容（html）
     */
    public setRichChildNode = (richChildNode: any): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            richChildNode
        }) as ContentState;
        const newBaseState = BaseState.push(oldBaseState, newContent);

        this.setState({
            baseState: newBaseState
        }, () => this.callBackForRender('Rich'));
    }

    /**
     * 获取组件自定义state
     */
    public getCustomState = (): any => {
        const baseState: BaseState = this.getBaseState();
        const customState: any = baseState.getCurrentContent().getCustomState();

        return customState;
    }

    /**
     * 设置组件自定义state
     */
    public setCustomState = (newCustomState: any): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            customState: newCustomState
        }) as ContentState;
        const newBaseState = BaseState.push(oldBaseState, newContent);

        this.setState({
            baseState: newBaseState
        }, () => this.callBackForRender('Custom'));
    }

    /**
     * 获取组件的批注集合
     */
    public getCommentsList = (): List<ICommentsList> => {
        const baseState: BaseState = this.getBaseState();
        const commentsList: List<ICommentsList> = baseState.getCurrentContent().getCommentsList();

        return commentsList;
    }

    /**
     * 设置组件的批注集合
     * @param newCommentsList 新的批注集合
     */
    public setCommentsList = (newCommentsList: List<ICommentsList>): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            commentsList: newCommentsList
        }) as ContentState;
        const newBaseState = BaseState.push(oldBaseState, newContent);

        this.setBaseState(newBaseState);
    }

    /**
     * 重做
     */
    public redo = (): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newBaseState: BaseState = BaseState.redo(oldBaseState);

        this.setBaseState(newBaseState);
    }

    /**
     * 撤销
     */
    public undo = (): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newBaseState: BaseState = BaseState.undo(oldBaseState);

        this.setBaseState(newBaseState);
    }

    /**
     * 手动设置堆栈
     */
    public setUndoStack = (): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const currentContent: ContentState = oldBaseState.getCurrentContent();
        // tempContentState记录的线性调整开始前的ContentState
        const tempContentState: ContentState = oldBaseState.getTempContentState();
        const undoStack: Stack<ContentState> = oldBaseState.getUndoStack().push(tempContentState);

        const newBaseState: BaseState = BaseState.set(oldBaseState, {
            currentContent,
            tempContentState: currentContent,
            undoStack,
            redoStack: Stack()
        });

        this.setState({
            baseState: newBaseState
        }, () => this.callBackForRender('Stack'));
    }

    /**
     * 获取鼠标处于该组件8个点的具体方位
     */
    public getPointerAnchor = (currentX: number, currentY: number): IAnchor | null => {
        // 计算当前点击事件的触发位置
        const positionState = this.getPositionState();
        const sizeState = this.getSizeState();
        const anchorList = countAnchorPoint(
            this.getCid(),
            this.getType(),
            positionState.getLeft(),
            positionState.getTop(),
            sizeState.getWidth(),
            sizeState.getHeight()
        );

        return findAnchorPoint(currentX, currentY, anchorList);
    }

    /**
     * 获取组件的样式表
     * @param com 组件对象
     */
    public getStyle = (com: any): CSSStyleDeclaration => {
        const style = window.getComputedStyle(ReactDOM.findDOMNode(com) as Element);

        return style;
    }

    /**
     * 定义组件的富文本编辑方式，默认为无编辑
     */
    public getRichEditType = (): EditType => {
        return 'none';
    }

    /**
     * 获取富文本编辑器的一些选项
     * { position, size }
     */
    public getRichEditOption = (): IRichEditOption => {
        return {
            position: this.getPosition(),
            size: this.getSize()
        };
    }

    /**
     * 隐藏可编辑部分，由组件自己重写
     * 呼出富文本编辑器时隐藏组件中被编辑部分
     */
    public hiddenEditorDom = (isHidden: boolean): void => {
        return;
    }

    /**
     * 是否可以双击修改
     * 默认：否，组件自己重写
     */
    public isDbClickToEdit = (): boolean => {
        return false;
    }

    /**
     * 组件是否可以被选中
     * 默认：是，组件自己重写
     */
    public isCanSelected = (): boolean => {
        return true;
    }

    /**
     * 组件是否可以移动
     * 默认：是，组件自己重写
     */
    public isCanMove = (): boolean => {
        return true;
    }

    /**
     * 是否可以挤开其他组件
     * 默认：否，组件自己重写
     */
    public isCanPushOpenOtherComponent = (): boolean => {
        return false;
    }

    /**
     * 选中框属性
     * 组件可以重写
     */
    public selectedFrameData = (): IReactData => {
        return {
            pointX: this.getPosition().left + this.props.componentPosition.canvasOffset.left,
            pointY: this.getPosition().top + this.props.componentPosition.canvasOffset.top,
            width: this.getSize().width + 1,
            height: this.getSize().height + 1,
            anchorFill: '#fff',
            stroke: '#108ee9',
            strokeWidth: 1,
            borderOffset: this.props.componentPosition.borderOffset.border * 2
        };
    }

    /**
     * 低效果拖动框属性
     * 组件可以重写
     */
    public stretchFrameData = (item: IBaseData): IReactData => {
        return {
            pointX: item.position.left + this.props.componentPosition.canvasOffset.left,
            pointY: item.position.top + this.props.componentPosition.canvasOffset.top,
            width: item.size.width + 1,
            height: item.size.height + 1,
            anchorFill: '#fff',
            stroke: '#108ee9',
            strokeWidth: 1,
            borderOffset: this.props.componentPosition.borderOffset.border * 2
        };
    }

    /**
     * 获取组件的属性，传给属性工具条
     */
    public getPropertiesToProperty = (): Array<{ pTitle: string, pKey: string, pValue: any, pType: string }> => {
        return [{
            pTitle: '',
            pKey: '',
            pValue: '',
            pType: 'text'
        }];
    }

    /**
     * 获取属性工具条的单条属性，传给组件并设置组件
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any) => {
        // const num: number = 1 + 1;
    }

    /**
     * 获取组件的属性，传给命令工具条
     */
    public getPropertiesToCommand = (): Array<{ pTitle: string, pKey: string, pValue: any, pType: string }> => {
        return [{
            pTitle: '',
            pKey: '',
            pValue: '',
            pType: 'text'
        }];
    }

    /**
     * 获取命令工具条的单条属性，传给组件并设置组件
     */
    public setPropertiesFromCommand = (pKey: string, pValue: any) => {
        // const num: number = 1 + 1;
    }

    /**
     * 获取基础组件的可设置文本命令
     */
    public getComponentSettableCommands = (): string[] => {
        return ['Color', 'fontStyle', 'textDecoration', 'fontSize', 'fontWeight', 'textAlign'];
    }

    /**
     * 初始化BaseSate
     * @param customState 组件自定义State
     */
    protected initBaseStateWithCustomState(customState: any = null, richChildNode: any = null): BaseState {
        const initType: InitType = this.props.initType;
        const baseState: BaseState = this.props.baseState;

        let newBaseState: BaseState = baseState;
        switch (initType) {
            case 'Init':
                newBaseState = baseState;
                break;
            case 'Add':
                let newContentState: ContentState = baseState.getCurrentContent();
                if (customState !== null) {
                    newContentState = newContentState.merge(
                        {
                            customState
                        }
                    ) as ContentState;
                }
                if (richChildNode !== null) {
                    newContentState = newContentState.merge(
                        {
                            richChildNode
                        }
                    ) as ContentState;
                }

                newBaseState = BaseState.createWithContent(newContentState);
                break;
            case 'Stack':
                newBaseState = baseState;
                break;
        }

        return newBaseState;
    }

    /**
     * 获取组件sizeState
     */
    protected getSizeState = (): SizeState => {
        const baseState: BaseState = this.getBaseState();
        const sizeState: SizeState = baseState.getCurrentContent().getSizeState();

        return sizeState;
    }

    /**
     * 设置组件的sizeState
     * @param newSizeState 构建好的新的sizeState
     */
    protected setSizeState = (newSizeState: SizeState): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            sizeState: newSizeState
        }) as ContentState;

        // 不自动设置撤销栈，由画布手动设置
        const newBaseState: BaseState = BaseState.push(oldBaseState, newContent, false);

        this.setState({
            baseState: newBaseState
        }, () => this.callBackForRender('Size'));
    }

    /**
     * 获取组件的PositionState
     */
    protected getPositionState = (): PositionState => {
        const baseState: BaseState = this.getBaseState();
        const positionState: PositionState = baseState.getCurrentContent().getPositionState();

        return positionState;
    }

    /**
     * 设置组件的PositionState
     * @param newPositionState 构建好的新的PositionState
     */
    protected setPositionState = (newPositionState: PositionState): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            positionState: newPositionState
        }) as ContentState;

        // 不自动设置撤销栈，由画布手动设置
        const newBaseState: BaseState = BaseState.push(oldBaseState, newContent, false);

        this.setState({
            baseState: newBaseState
        }, () => this.callBackForRender('Position'));
    }

    /**
     * 设置Size、Position后回调函数
     */
    protected callBackForSizeAndPosition = (): void => {
        // 通知画布重绘组件的选中框
        this.props.repaintSelected();
        // 计算边界调整画布的大小
        const boundary = this.getBoundaryPoint();
        this.props.repaintCanvas(boundary.pointX, boundary.pointY);
    }

    /**
     * 设置ZIndex后回调函数
     */
    protected callBackForZIndex = (): void => {
        this.props.resetMaxAndMinZIndex();
    }

    /**
     * setState后回掉总入口
     */
    protected callBackForRender = (type: CallBackType): void => {
        switch (type) {
            case 'Size':
                this.callBackForSizeAndPosition();
                break;
            case 'Position':
                this.callBackForSizeAndPosition();
                break;
            case 'ZIndex':
                this.callBackForZIndex();
                this.setCanvasUndoStack();
                break;
            case 'Rich':
                this.setCanvasUndoStack();
                break;
            case 'Custom':
                this.setCanvasUndoStack();
                break;
            case 'Stack':
                this.setCanvasUndoStack();
                break;
        }
    }

    /**
     * 组件自己不要处理选中状态，交有画布处理，因为选中状态由键盘和鼠标事件组成，
     * 每个组件自己记录，还要判断键盘事件，比较复杂，且选中状态对组件身意义不大，故交由画布决定
     * @param cid 组件ref标识
     */
    protected fireSelectChange = (e: any): void => {
        // 获取当前控件ID
        const cid = this.getCid();
        if (this.props.selectionChanging) {
            this.props.selectionChanging(cid);
        }
        e.preventDefault();
    }

    /**
     * 双击修改
     */
    protected doDbClickToEdit = (e: any, cid: string = this.getCid()): void => {
        if (this.props.dbClickToBeginEdit) {
            this.props.dbClickToBeginEdit(cid);
        }
        e.preventDefault();
    }

    /**
     * 设置画布撤销栈
     */
    protected setCanvasUndoStack = (): void => {
        if (this.props.setCanvasUndoStack) {
            const timeStamp: number = Date.parse(new Date().toString());
            const operationType: OperationType = 'modify';
            const componentList: List<IComponentList> = List().push({
                cid: this.getCid(),
                comPath: this.props.comPath,
                baseState: this.getBaseState(),
                childData: this.props.childData,
                initType: 'Stack'
            }) as List<IComponentList>;

            this.props.setCanvasUndoStack(
                timeStamp,
                operationType,
                componentList
            );
        }
    }
}
