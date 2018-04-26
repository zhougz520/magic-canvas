import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../BaseComponent';

import './sass/Comments.scss';

export default class Comments extends BaseComponent<IBaseProps, IBaseState> {
    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(null)
        };
    }

    render() {
        const richChildNode = this.getRichChildNode();

        return (
            <div
                className="comments"
                onMouseDown={this.fireSelectChange}
                // tslint:disable-next-line:max-line-length
                style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy())}
                dangerouslySetInnerHTML={{__html: richChildNode}}
            />
        );
    }
}
