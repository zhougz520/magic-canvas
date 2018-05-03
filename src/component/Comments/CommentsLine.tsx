import * as React from 'react';

export interface ICommentsLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class CommentsLine extends React.PureComponent<ICommentsLineProps, any> {
    render() {
        const { x1, y1, x2, y2 } = this.props;

        return (
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#108ee9" strokeWidth="1" />
        );
    }
}
