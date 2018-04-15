import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../index';
import BtnChildDemo from '../../MapComponent/demo/BtnChildDemo';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
}

export interface IDemoState extends IBaseState {
    demoState: string;
}

export default class Container extends BaseComponent<IDemoProps, IDemoState> {
    public com: HTMLElement | null = null;

    public render() {
        const richChildNode = this.getRichChildNode();
        const { p } = this.props.data;
        const children: any = [];
        if (p !== undefined && p.components.length > 0) {
            p.components.forEach((com: any) => {
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
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
            >
                <div
                    style={{ backgroundColor: '#F0F0FF' }}
                >
                    {this.getCid() + '.'} - {richChildNode}
                </div>
                {children}
            </div>
        );
    }
}
