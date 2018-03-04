import * as React from 'react';

import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';

import { BaseState } from './model/BaseState';
import { ContentState } from './model/ContentState';
import { SizeState } from './model/SizeState';
import { PostionState } from './model/PostionState';
import { ISize, IPostion } from './model/types';

export class BaseComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {
    constructor(props: P, context?: any) {
        super(props, context);

        const contentState: ContentState = ContentState.create({
            isSelected: false,
            sizeState: SizeState.create({ width: props.w, height: props.h }),
            postionState: PostionState.create({ left: props.l, right: props.r, top: props.t, bottom: props.b }),
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
     * 获取组件postion
     * 返回：IPostion类型的对象{left: 10, right: 10, top: 10, bottom: 10}
     */
    public getPostion = (): IPostion => {
        const postionState: PostionState = this.getPostionState();

        return {
            left: postionState.getLeft(),
            right: postionState.getRight(),
            top: postionState.getTop(),
            bottom: postionState.getBottom()
        };
    }

    /**
     * 设置组件postion
     * @param postion IPostion类型的对象{left: 10, right: 10, top: 10, bottom: 10}
     */
    public setPostion = (postion: IPostion): void => {
        const newPostionState: PostionState = PostionState.create(postion);

        this.setPostionState(newPostionState);
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
     * 获取组件的postionState
     */
    protected getPostionState = (): PostionState => {
        const baseState: BaseState = this.getBaseState();
        const postionState: PostionState = baseState.getCurrentContent().getPostionState();

        return postionState;
    }

    /**
     * 设置组件的postionState
     * @param newPostionState 构建好的新的postionState
     */
    protected setPostionState = (newPostionState: PostionState): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            postionState: newPostionState
        }) as ContentState;
        const newBaseState: BaseState = BaseState.push(oldBaseState, newContent);

        this.setState({
            baseState: newBaseState
        });
    }

}
