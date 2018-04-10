import * as React from 'react';
import { MapComponent, IMapProps, IMapState } from '../index';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IMapProps {
    fireSelect: (cid: string, e: any) => void;
    value?: string;
}

export interface IDemoState extends IMapState {
    demoState: string;
}

export default class BtnDemo extends MapComponent<IDemoProps, IDemoState> {
    static defaultProps = {
        value: 'test'
    };

    public com: HTMLElement | null = null;
    public render() {
        const { value } = this.props;

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                tabIndex={0}
                onMouseDown={this.onSelectChange}
                draggable
            >
                <button type="primary" style={{ width: '100%', height: '100%' }} >{value}</button>
            </div>
        );
    }

    private onSelectChange = (e: any) => {
        if (this.props.fireSelect) {
            this.props.fireSelect(e, this.getCid());
        }
    }
}
