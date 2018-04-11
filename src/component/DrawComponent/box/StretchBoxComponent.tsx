import * as React from 'react';
import * as Anchor from '../../util/AnchorPoint';
import { IReactData } from '../model/types';

export interface IStretchProps {
    key: string;
    cid: string;
    data: IReactData;
    anchorKey: string;
}

const createStretch = (props: IStretchProps) => {
    const { anchorKey } = props;
    const { pointX, pointY, width, height, anchorFill, stroke, strokeWidth, borderOffset } = props.data;
    const anchorList = Anchor.countAnchorPoint(props.cid, pointX, pointY, width, height, undefined, borderOffset);

    const rectList: any[] = [];
    // tslint:disable-next-line:max-line-length
    rectList.push(<rect key="Stretch" x={pointX} y={pointY} width={width - borderOffset} height={height - borderOffset} fill="none" style={{ stroke, strokeWidth, strokeDasharray: '5,5' }} />);
    anchorList.map((anchor) => {
        if (anchor.key === anchorKey) {
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
        }
    });

    return rectList;
};

export const Stretch = (props: IStretchProps) => {
    const rectList = createStretch(props);

    return (
        <React.Fragment>
            {rectList}
        </React.Fragment>
    );
};
