import * as React from 'react';
import {
    ISize,
    IPostion
} from './types';
import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';

export class BaseComponent<P extends IBaseProps, S extends IBaseState>
    extends React.PureComponent<P, S> implements IComponent {
    constructor(props: P, context?: any) {
        super(props, context);

        this.state = {
            selected: true,
            dragging: false
        } as Readonly<S>;
    }

    public getSize = (): ISize => {
        return {
            width: 789,
            height: 1234
        };
    }

    public getPostion = (): IPostion => {
        return {
            left: 963214523
        };
    }

    protected testChanging = () => {
        const { selectionChanging } = this.props;
        const { selected } = this.state;

        const newSelected = !selected;

        if (undefined !== selectionChanging) {
            selectionChanging(newSelected, 123);
        }

        this.setState({
            selected: newSelected
        });
    }

}
