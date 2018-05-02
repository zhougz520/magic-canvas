import * as React from 'react';
import { BaseComponent, IBaseProps, IBaseState, BaseStyle } from '../BaseComponent';
import { CommentsLine } from './CommentsLine';
import { Map } from 'immutable';

import './sass/Comments.scss';

export default class Comments extends BaseComponent<IBaseProps, IBaseState> {
    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(props.data.lineList)
        };
    }

    render() {
        const rectList: JSX.Element[] = [];
        const richChildNode = this.getRichChildNode();

        // TODO Comments优化代码
        const lineList: Map<string, any> = this.getCustomState();
        lineList.map(
            (value, key) => {
                const { x1, y1, x2, y2 } = value;
                rectList.push(
                    <CommentsLine key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
                );
            }
        );

        return (
            <React.Fragment>
                <div
                    className="comments"
                    onMouseDown={this.fireSelectChange}
                    style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                    dangerouslySetInnerHTML={{__html: richChildNode}}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="100%"
                    height="100%"
                    pointerEvents="none"
                    style={{position: 'absolute', zIndex: this.getHierarchy()}}
                >
                    {rectList}
                </svg>
            </React.Fragment>
        );
    }
}
