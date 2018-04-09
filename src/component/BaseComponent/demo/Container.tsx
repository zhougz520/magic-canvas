import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../index';
import BtnDemo from '../../MapComponent/demo/BtnDemo'

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
        if(p!=undefined && p.components.length>0){
            p.components.forEach((com: any) => {
                children.push(<BtnDemo key={`c.${com.p.id}`} data={com.p} ref={`c.${com.p.id}`} fireSelect={this.fireSelectChange} />);
            });
        }

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
                tabIndex={0}
                onFocus={this.onFocus}
            >
                <div
                    style={{ backgroundColor: '#F0F0FF' }}
                >
                    {this.getCid() + '.'} - {richChildNode}
                </div>
                {
                    children
                }
            </div>
        );
    }

    // TODO onFocus、onBlur方法需完善
    private onFocus = (e: any): void => {
        this.onComFocus(this.getCid(), e);
    }
}
