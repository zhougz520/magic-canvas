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
    const { pointX, pointY, width, height, stroke, strokeWidth, borderOffset } = props.data;
    const svgWidth: number = width - borderOffset;
    const svgHeight: number = height - borderOffset;
    const anchorList = countAnchorPoint(
        props.cid,
        props.type,
        pointX,
        pointY,
        svgWidth,
        svgHeight,
        undefined
    );

    const rectList: any[] = [];
    rectList.push(<rect transform="translate(0.5,0.5)" key="Selected" x={pointX} y={pointY} width={svgWidth} height={svgHeight} fill="none" style={{ stroke, strokeWidth, strokeDasharray: '2.5,2.5' }} />);
    anchorList.map((anchor) => {
        rectList.push(
            <image
                key={anchor.key}
                x={anchor.x - anchor.offset}
                y={anchor.y - anchor.offset}
                width={anchor.offset * 2}
                height={anchor.offset * 2}
                // tslint:disable-next-line:max-line-length
                xlinkHref="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzAwN2RmYyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+"
            />
        );
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
