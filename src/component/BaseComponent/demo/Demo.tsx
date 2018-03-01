import * as React from 'react';
import { BaseComponent, BaseState, IBaseProps, IBaseState } from '../index';

export interface IDemoProps extends IBaseProps {
    demoProp: string;
}

export interface IDemoState extends IBaseState {
    demoState: string;
}

export class Demo extends BaseComponent<IDemoProps, IDemoState> {
    // constructor(props: IDemoProps) {
    //     super(props);
    // }

    public render() {
        const { demoProp } = this.props;

        const richChildNode = this.getRichChildNode();

        return (
            <div>
                <div
                    style={{ backgroundColor: '#F0F0FF' }}
                    onClick={this.click}
                >
                    {demoProp + '.'} - {richChildNode}
                </div>
                <button onClick={this.click}>DemoClick(console)</button>
            </div>
        );
    }

    private click = () => {
        const baseState: BaseState = this.getBaseState();
        // tslint:disable-next-line:no-console
        console.log(baseState);
    }
}
