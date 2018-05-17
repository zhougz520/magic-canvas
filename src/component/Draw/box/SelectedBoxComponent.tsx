import * as React from 'react';
import { countAnchorPoint } from '../../util';
import { IReactData } from '../model/types';

export interface ISelectedProps {
    key: string;
    cid: string;
    type: string;
    data: IReactData;
}

const createSelected = (props: ISelectedProps) => {
    const { pointX, pointY, width, height, anchorFill, stroke, strokeWidth, borderOffset } = props.data;
    const anchorList = countAnchorPoint(props.cid, props.type,
        pointX, pointY, width, height, undefined, borderOffset);

    const rectList: any[] = [];
    rectList.push(<rect key="Selected" x={pointX} y={pointY} width={width - borderOffset} height={height - borderOffset} fill="none" style={{ stroke, strokeWidth }} />);
    anchorList.map((anchor) => {
        rectList.push(
            <rect
                key={anchor.key}
                x={anchor.x - anchor.offset}
                y={anchor.y - anchor.offset}
                width={anchor.offset * 2}
                height={anchor.offset * 2}
                fill={anchorFill}
                style={{ stroke, strokeWidth, pointerEvents: 'none', cursor: anchor.cursor }}
            />);
    });

    return rectList;
};

export const Selected = (props: ISelectedProps) => {
    const rectList = createSelected(props);

    return (
        <React.Fragment>
            {rectList}
        </React.Fragment>
    );
};
