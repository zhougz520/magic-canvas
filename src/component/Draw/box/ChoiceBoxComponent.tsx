import * as React from 'react';

export interface IChoiceBoxProps {
    data: IChoiceBoxData;
}

export interface IChoiceBoxData {
    pointX: number;
    pointY: number;
    offset: { x: number, y: number };
    style: React.CSSProperties;
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
    const { pointX, pointY, offset, style } = data;

    return (
        <React.Fragment>
            <rect
                transform="translate(0.5,0.5)"
                x={pointX}
                y={pointY}
                width={offset.x}
                height={offset.y}
                style={style}
            />
        </React.Fragment>
    );
};
