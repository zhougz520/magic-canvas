import * as React from 'react';
import { MapComponent, IMapProps, IMapState } from '../index';
import BtnChildDemo from './BtnChildDemo';
// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IMapProps {
    fireSelect: (cid: string, e: any) => void;
    value?: string;
    data: any;
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
        const { data } = this.props;
        const children: any = [];
        if (data.components.length > 0) {
            data.components.forEach((com: any) => {
                children.push(
                    <BtnChildDemo
                        key={`c.${com.p.id}`}
                        data={com.p}
                        // tslint:disable-next-line:jsx-no-string-ref
                        ref={`c.${com.p.id}`}
                        fireSelect={this.fireSelectChange}
                    />);
            });
        }

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                onMouseDown={this.onSelectChange}
                draggable
            >
            {children}
            </div>
        );
    }

    private onSelectChange = (e: any) => {
        if (this.props.fireSelect) {
            this.props.fireSelect(e, this.getCid());
        }
    }
}
