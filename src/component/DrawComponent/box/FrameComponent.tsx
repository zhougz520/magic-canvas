import * as React from 'react';
import * as Anchor from '../../util/AnchorPoint';

export interface IFrameProps {
    key: string;
    cid: string;
    data: IReactData;
}

export interface IReactData {
    pointX: number;
    pointY: number;
    width: number;
    height: number;
    anchorFill: string;
    stroke: string;
    strokeWidth: number;
}

const createFrame = (props: IFrameProps) => {
    const { pointX, pointY, width, height, anchorFill, stroke, strokeWidth } = props.data;
    const anchorList = Anchor.countAnchorPoint(props.cid, pointX, pointY, width, height);

    const rectList: any[] = [];
    // tslint:disable-next-line:max-line-length
    rectList.push(<rect key="frame" x={pointX} y={pointY} width={width} height={height} fill="none" style={{ stroke, strokeWidth }} />);
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

export const Frame = (props: IFrameProps) => {
    const rectList = createFrame(props);

    return (
        <React.Fragment>
            {rectList}
        </React.Fragment>
    );
};
