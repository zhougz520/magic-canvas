import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../index';
import BtnDemo from '../../MapComponent/demo/BtnDemo';

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
                    <BtnDemo
                        key={`c.${com.p.id}`}
                        {...com.p}
                        selectComChange={this.selectComChange}
                        selectCom={this.selectComChange}
                        selectedId={com.p.id}
                        data={com.p}
                        // tslint:disable-next-line:jsx-no-string-ref
                        ref={`c.${com.p.id}`}
                        updateProps={this.fireSelectChange}
                        fireSelectChildChange={this.fireSelectChildChange}
                    />);
            });
        }

        // 汇总style
        const currStyle = Object.assign(
            BaseStyle(
                this.getPositionState(),
                this.getSizeState(),
                this.getHierarchy()
            ),
            {
                overflow: 'auto'
            }
        );

        return (
            <div
                ref={(handler: HTMLElement | null) => this.com = handler}
                style={currStyle}
            >
                <div
                    onMouseDown={this.fireSelectChange}
                    style={{ backgroundColor: '#F0F0FF' }}
                >
                    {this.getCid() + '.'} - {richChildNode}
                </div>
                {children}
            </div>
        );
    }
}
