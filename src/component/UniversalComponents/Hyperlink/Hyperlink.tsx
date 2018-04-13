import * as React from 'react';
import { BaseComponent, IBaseState, IBaseProps, BaseStyle} from '../../..';
import { HyperlinkState } from './HyperlinkState';

// tslint:disable-next-line:no-empty-interface
export interface IDemoProps extends IBaseProps {

}

export default class Hyperlink extends BaseComponent<IDemoProps, IBaseState> {
    private com: any = null;
    constructor(props: IDemoProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new HyperlinkState())
        } as Readonly<IBaseState>;
    }
    render() {
        return (
            <div
                onMouseDown={this.fireSelectChange}
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                ref={(handler) => this.com = handler}
            >
                <a
                    href={this.getCustomState().getHerf()}
                >
                {this.getCustomState().getContent()}
                </a>
            </div>
        );
    }

}
