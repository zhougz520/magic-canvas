import * as React from 'react';

export interface IChoiceBoxProps {
    data: IChoiceBoxData;
}

export interface IChoiceBoxData {
    pointX: number;
    pointY: number;
    offset: { x: number, y: number };
    fill: string;
    fillOpacity: number;
    stroke: string;
    strokeWidth: number;
}

const createChoiceBox = (data: IChoiceBoxData) => {
    const { pointX, pointY, offset } = data;
    if (offset.x < 0) {
        data.pointX = pointX + offset.x;
        data.offset.x = Math.abs(offset.x);
    }
    if (offset.y < 0) {
        data.pointY = pointY + offset.y;
        data.offset.y = Math.abs(offset.y);
    }

    return data;

};

export const ChoiceBox = (props: IChoiceBoxProps) => {
    const data = createChoiceBox(props.data);
    const { pointX, pointY, offset, fill, stroke, fillOpacity, strokeWidth } = data;

    return (
        <React.Fragment>
            <rect
                x={pointX + 0.5}
                y={pointY + 0.5}
                width={offset.x}
                height={offset.y}
                style={{ fill, fillOpacity, stroke, strokeWidth }}
            />
        </React.Fragment>
    );
};
