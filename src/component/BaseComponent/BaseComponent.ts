import * as React from 'react';

import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';

import { BaseState } from './model/BaseState';
import { ContentState } from './model/ContentState';
import { SizeState } from './model/SizeState';
import { PositionState } from './model/PositionState';
import { ISize, IPosition } from './index';
import * as Anchor from '../util/AnchorPoint';

export class BaseComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {
    constructor(props: P, context?: any) {
        super(props, context);

        const contentState: ContentState = ContentState.create({
            isSelected: false,
            sizeState: SizeState.create({ width: props.data.w, height: props.data.h }),
            // tslint:disable-next-line:max-line-length
            positionState: PositionState.create({ left: props.data.l, right: props.data.r, top: props.data.t, bottom: props.data.b }),
            richChildNode: null
        });
        this.state = {
            baseState: BaseState.createWithContent(contentState)
        } as Readonly<S>;
    }

    /**
     * 获取组件size
     * 返回：ISize类型的对象{width: 10, height: 10}
     */
    public getSize = (): ISize => {
        const sizeState = this.getSizeState();

        return {
            width: sizeState.getWidth(),
            height: sizeState.getHeight()
        };
    }

    /**
     * 设置组件size
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
            left: positionState.getLeft(),
            right: positionState.getRight(),
            top: positionState.getTop(),
            bottom: positionState.getBottom()
        };
    }

    /**
     * 设置组件Position
     * @param Position IPosition类型的对象{left: 10, right: 10, top: 10, bottom: 10}
     */
    public setPosition = (Position: IPosition): void => {
        const newPositionState: PositionState = PositionState.create(Position);

        this.setPositionState(newPositionState);
    }

    /**
     * 获取组件是否选中
     * 返回：true(选中)|false(未选中)
     */
    public getIsSelected = (): boolean => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getCurrentContent().getIsSelected();
    }

    /**
     * 设置组件是否选中
     * @param isSelected true(选中)|false(未选中)
     */
    public setIsSelected = (isSelected: boolean): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            isSelected
        }) as ContentState;
        const newBaseState = BaseState.push(oldBaseState, newContent);

        this.setBaseState(newBaseState);
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
     * 获取鼠标处于该组件8个点的具体方位
     */
    public getPointerAnchor = (currentX: number, currentY: number): Anchor.IAnchor | null => {
        // 计算当前点击事件的触发位置
        // const pointer = {x: e.pageX, y: e.pageY};
        const positionState = this.getPositionState();
        const sizeState = this.getSizeState();
        const anchorList = Anchor.countAnchorPoint(
            positionState.getLeft(), positionState.getTop(), sizeState.getWidth(), sizeState.getHeight());

        return Anchor.findAnchorPoint(currentX, currentY, anchorList);
    }

    /**
     * 修改组件的大小
     */
    public stretchComponent = (position: IPosition, size: ISize) => {
        this.setPosition(position);
        this.setSize(size);
    }

    /**
     * 获取组件的baseState
     */
    protected getBaseState = (): BaseState => {
        const baseState: BaseState = this.state.baseState;

        return baseState;
    }

    /**
     * 设置组件的baseState
     * @param newBaseState 构建好的新的baseState
     */
    protected setBaseState = (newBaseState: BaseState): void => {
        this.setState({
            baseState: newBaseState
        });
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
        const newBaseState: BaseState = BaseState.push(oldBaseState, newContent);

        this.setState({
            baseState: newBaseState
        });
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
        const newBaseState: BaseState = BaseState.push(oldBaseState, newContent);

        this.setState({
            baseState: newBaseState
        });
    }

    /**
     * 组件自己不要处理选中状态，交有画布处理，因为选中状态由键盘和鼠标事件组成，
     * 每个组件自己记录，还要判断键盘事件，比较复杂，且选中状态对组件身意义不大，故交由画布决定
     * @param cid 组件ref标识
     */
    protected fireSelectChange = (cid: string, e: any): void => {
        // 阻止点击事件冒泡到画布上
        e.stopPropagation();
        e.preventDefault();

        if (this.props.selectionChanging) {
            this.props.selectionChanging(cid, e);
        }
    }

}
