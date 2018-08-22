import * as React from 'react';
import { ISize, IPosition } from '../../BaseComponent';

export interface IImageLineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    rectSize: ISize;                // 放大区域大小
    rectPosition: IPosition;        // 放大区域位置（相对父组件位置）
}

export class ImageLine extends React.PureComponent<IImageLineProps, any> {
    render() {
        const { x1, y1, x2, y2, rectSize, rectPosition } = this.props;

        return (
            <g transform="translate(0.5,0.5)">
                <rect
                    x={rectPosition.left}
                    y={rectPosition.top}
                    width={rectSize.width}
                    height={rectSize.height}
                    rx={3}
                    ry={3}
                    fill="#bbbbbb"
                    fillOpacity="0.10"
                    stroke="#bbbbbb"
                    strokeWidth="1"
                    pointerEvents="none"
                />
                <path
                    d={'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2}
                    fill="none"
                    stroke="#bbbbbb"
                    strokeMiterlimit="10"
                />
            </g>
        );
    }
}
