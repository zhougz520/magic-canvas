import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState } from '../index';

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

        return (
            <div>
                <div
                    style={{ backgroundColor: '#F0F0FF' }}
                >
                    {demoProp}
                </div>
                <button onClick={this.click}>DemoClick</button>
            </div>
        );
    }

    private click = () => {
        this.testChanging();
    }
}
