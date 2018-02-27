import * as React from 'react';

import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';

import { BaseState } from './model/BaseState';
import { SizeState } from './model/SizeState';
import { PostionState } from './model/PostionState';

export class BaseComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {
    constructor(props: P, context?: any) {
        super(props, context);

        this.state = {
            baseState: BaseState.createWithSizeAndPostion(
                SizeState.create({ width: props.w, height: props.h }),
                PostionState.create({ left: 0, right: 0, top: 0, bottom: 0 })
            )
        } as Readonly<S>;
    }

    public getBaseState = (): BaseState => {
        const baseState: BaseState = this.state.baseState;

        return baseState;
    }

    public setBaseState = (newBaseState: BaseState): void => {
        this.setState({
            baseState: newBaseState
        });
    }

    public getSizeState = (): SizeState => {
        const baseState: BaseState = this.getBaseState();
        const sizeState: SizeState = baseState.getSizeState();

        return sizeState;
    }

    public setSizeState = (newSizeState: SizeState): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newBaseState: BaseState = BaseState.set(oldBaseState, newSizeState);

        this.setState({
            baseState: newBaseState
        });
    }

    public getPostionState = (): PostionState => {
        const baseState: BaseState = this.getBaseState();
        const postionState: PostionState = baseState.getPostionState();

        return postionState;
    }

    public setPostionState = (newPostionState: PostionState): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newBaseState: BaseState = BaseState.set(oldBaseState, newPostionState);

        this.setState({
            baseState: newBaseState
        });
    }

    protected testChanging = (): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const isSelected: boolean = oldBaseState.getIsSelected();

        const newBaseState: BaseState = BaseState.set(oldBaseState, { isSelected: !isSelected });

        this.setState({
            baseState: newBaseState
        });
    }

}
