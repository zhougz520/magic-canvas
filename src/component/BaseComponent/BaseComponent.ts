import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';

import { BaseState } from './model/BaseState';
import { ContentState, ComponentType } from './model/ContentState';
import { SizeState, ISize } from './model/SizeState';
import { PositionState, IPosition } from './model/PositionState';

import { BoxType, IAnchor, countAnchorPoint, findAnchorPoint } from '../util';
import { Stack, Map } from 'immutable';

/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class BaseComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {

    com: any = null;

    // TODO 基类中不写构造器
    constructor(props: P, context?: any) {
        super(props, context);

        // TODO 优化代码
        const propsBaseState = props.baseState;
        if (propsBaseState !== null && propsBaseState !== undefined) {
            this.state = {
                baseState: propsBaseState
            } as Readonly<S>;
        } else {
            this.state = {
                baseState: this.initBaseStateWithCustomState()
            } as Readonly<S>;
        }

    }

    componentWillUnmount() {
        // TODO Comments优化代码
        const commentsMap = this.getCommentsMap();
        if (commentsMap.size > 0) {
            commentsMap.map(
                (value, key) => {
                    const comments = this.props.getComponent(key);
                    if (comments) {
                        const oldLineList = comments.getCustomState();
                        const newLineList: Map<string, any> = oldLineList.delete(
                            this.getCid()
                        );
                        comments.setCustomState(newLineList);
                    }
                }
            );
        }
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
        }, this.callBackForZIndex);
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

        this.setBaseState(newBaseState);
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

        this.setBaseState(newBaseState);
    }

    /**
     * 获取组件的批注集合
     */
    public getCommentsMap = (): Map<any, any> => {
        const baseState: BaseState = this.getBaseState();
        const commentsMap: Map<any, any> = baseState.getCurrentContent().getCommentsMap();

        return commentsMap;
    }

    /**
     * 设置组件的批注集合
     * @param newCommentsMap 新的批注集合
     */
    public setCommentsMap = (newCommentsMap: Map<any, any>): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            commentsMap: newCommentsMap
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

        this.setState({ baseState: newBaseState });
    }

    /**
     * 获取鼠标处于该组件8个点的具体方位
     */
    public getPointerAnchor = (currentX: number, currentY: number): IAnchor | null => {
        // 计算当前点击事件的触发位置
        const positionState = this.getPositionState();
        const sizeState = this.getSizeState();
        const anchorList = countAnchorPoint(this.getCid(), this.getType(),
            positionState.getLeft(), positionState.getTop(), sizeState.getWidth(), sizeState.getHeight());

        return findAnchorPoint(currentX, currentY, anchorList);
    }

    /**
     * 获取组件的样式表
     * @param com 组件对象
     */
    public getStyle = (com: any): CSSStyleDeclaration => {
        const style = window.getComputedStyle(ReactDOM.findDOMNode(com));

        return style;
    }

    /**
     * 获取组件的属性，传给属性工具条
     */
    public getPropertiesToProperty = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}> => {
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
    public getPropertiesToCommand = (): Array<{pTitle: string, pKey: string, pValue: any, pType: string}> => {
        return  [{
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
     * map控件选中
     * @param id 组件id
     */
    public selectComChange = (id: string) => {
        this.setState({
            selectedId: id
        });
        this.fireSelectChildChange(null);
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
        const baseState: BaseState = this.props.baseState;

        let newBaseState: BaseState = baseState;
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
        }, this.callBackForSizeAndPosition);
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
        }, this.callBackForSizeAndPosition);
    }

    // render后的回调函数
    protected callBackForSizeAndPosition = (): void => {
        // 通知画布重绘组件的选中框
        this.props.repaintSelected();
        // 计算边界调整画布的大小
        const boundary = this.getBoundaryPoint();
        this.props.repaintCanvas(boundary.pointX, boundary.pointY);

        // TODO Comments优化代码
        // if (this.getComType() === 'Comments') {
        //     const position = this.getPosition();
        //     const oldLineList: Map<string, any> = this.getCustomState();
        //     let newLineList: Map<string, any> = Map();
        //     oldLineList.map(
        //         (value: any, key: string) => {
        //             newLineList = newLineList.set(
        //                 key, {x1: value.x1, y1: value.y1, x2: position.left, y2: position.top}
        //             );
        //         }
        //     );
        //     this.setCustomState(newLineList);
        // } else {
        //     const position = this.getPosition();
        //     const size = this.getSize();
        //     const commentsMap = this.getCommentsMap();
        //     if (commentsMap.size > 0) {
        //         commentsMap.map(
        //             (value, key) => {
        //                 const comments = this.props.getComponent(key);
        //                 if (comments) {
        //                     const oldLineList = comments.getCustomState();
        //                     const newLineList: Map<string, any> = oldLineList.update(
        //                         this.getCid(), (val: any) => ({x1: position.left + size.width, y1: position.top, x2: oldLineList.get(this.getCid()).x2, y2: oldLineList.get(this.getCid()).y2})
        //                     );
        //                     comments.setCustomState(newLineList);
        //                 }
        //             }
        //         );
        //     }
        // }
    }

    protected callBackForZIndex = (): void => {
        this.props.resetMaxAndMinZIndex();
    }

    /**
     * 组件自己不要处理选中状态，交有画布处理，因为选中状态由键盘和鼠标事件组成，
     * 每个组件自己记录，还要判断键盘事件，比较复杂，且选中状态对组件身意义不大，故交由画布决定
     * @param cid 组件ref标识
     */
    protected fireSelectChange = (e: any, cid: string = this.getCid()): void => {
        // e.stopPropagation();
        if (this.props.selectionChanging) {
            this.props.selectionChanging(cid, true);
        }
        // 取消子控件选中
        this.selectComChange('');
        e.preventDefault();
    }

    /**
     * 往外传子控件的cid
     * @param cid 组件ref标识
     */
    protected fireSelectChildChange = (e: any, cid: string = this.getCid()): void => {
        if (e) {
            if (this.props.selectionChanging) {
                this.props.selectionChanging(cid, false);
            }
            e.preventDefault();
        }
    }

    protected doDbClickToEdit = (): void => {
        if (this.props.dbClickToBeginEdit) {
            this.props.dbClickToBeginEdit();
        }
    }

}
