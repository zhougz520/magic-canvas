import * as React from 'react';

export interface ICommentsLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
}

export class CommentsLine extends React.PureComponent<ICommentsLineProps, any> {
    render() {
        const { x1, y1, x2, y2, color } = this.props;

        return (
            <path
                transform="translate(0.5,0.5)"
                d={'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2}
                fill="none"
                stroke={color}
                strokeMiterlimit="10"
            />
        );
    }
}
