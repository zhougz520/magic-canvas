import * as React from 'react';
import { PureComponent } from 'react';
import { IMapProps } from '../index';

export interface IDemoProps extends IMapProps {
    fireSelect: (cid: string, e: any) => void;
    value?: string;
    data: {};
}

export default class BtnChildDemo extends PureComponent<IDemoProps, any> {
    static defaultProps = {
        value: 'test'
    };

    public com: HTMLElement | null = null;

    constructor(props: IDemoProps, context?: any) {
        super(props, context);
        this.state = {
            ...this.props
        } as Readonly<any>;
    }

    public render() {
        const { fireSelect, value } = this.state;

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                onMouseDown={fireSelect}
                draggable
                onClick={this.onTextChange}
            >
                <button type="primary" style={{ width: '100%', height: '100%' }} >{value}</button>
            </div>
        );
    }

    private onTextChange: any = () => {
        this.setState({
            value : 'AAA'
        });
    }
}
