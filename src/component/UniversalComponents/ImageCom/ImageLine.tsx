import * as React from 'react';

export interface IImageLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class ImageLine extends React.PureComponent<IImageLineProps, any> {
    render() {
        const { x1, y1, x2, y2 } = this.props;

        return (
            <g transform="translate(0.5,0.5)">
                <circle cx={x2} cy={y2} r="2" stroke="#cbcaca" stroke-width="1" fill="#cbcaca" />
                <path
                    d={'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2}
                    fill="none"
                    stroke="#cbcaca"
                    strokeMiterlimit="10"
                />
            </g>
        );
    }
}
