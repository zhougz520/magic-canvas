import * as React from 'react';
import { PureComponent } from 'react';

export interface IDemoProps {
    fireSelect: (cid: string, e: any) => void;
    data: {};
}

export default class BtnChildDemo extends PureComponent<IDemoProps, any> {
    static defaultProps = {
        txt_v: 'test'
    };

    public com: HTMLElement | null = null;

    constructor(props: IDemoProps, context?: any) {
        super(props, context);
        this.state = {
            ...this.props.data
        } as Readonly<any>;
    }

    public render() {
        const { txt_v } = this.state;

        return (
            <div
                style={{ marginLeft: 30 }}
                ref={(handler: HTMLElement | null) => this.com = handler}
                // onMouseDown={this.onFireSelect}
                draggable
                onClick={this.onTextChange}
            >
                <button type="primary" style={{ width: '100%', height: '100%' }} >{txt_v}</button>
            </div>
        );
    }

    private onTextChange: any = () => {
        this.setState({
            txt_v : 'AAA'
        });
    }

    // private onFireSelect = (e: any) => {
    //     const { id } = this.state;
    //     const { fireSelect } = this.props;

    //     fireSelect(e, id);
    // }
}
