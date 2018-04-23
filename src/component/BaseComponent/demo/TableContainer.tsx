import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../index';
import TableDemo from '../../MapComponent/demo/TableDemo';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {
}

export interface IDemoState extends IBaseState {
    demoState: string;
}
export default class Container extends BaseComponent<IDemoProps, IDemoState> {
    public com: HTMLElement | null = null;

    public render() {

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
                // onMouseDown={this.fireSelectChange}
            >
                <TableDemo  />
            </div>
        );
    }
}
