import * as React from 'react';
import * as BaseComponent from './index';

export interface IDemoProps extends BaseComponent.IBaseProps {
    demoProp: string;
}

export interface IDemoState extends BaseComponent.IBaseState {
    demoState: string;
}

export class Demo extends BaseComponent.BaseComponent<IDemoProps, IDemoState> {
    public render() {
        const { demoProp } = this.props;

        return (
            <div
                style={{ backgroundColor: '#F0F0FF' }}
                onClick={this.click}
            >
                {demoProp}
            </div>
        );
    }

    private click = () => {
        this.testChanging();
    }
}
