import * as React from 'react';

export interface IEditStyle {
    maxWidth: number;
    top: number;
    left: number;
    style: CSSStyleDeclaration | null;
}

export const EditStyle = (config: IEditStyle): React.CSSProperties => {
    const styleObj: React.CSSProperties = {
        minHeight: '1em',
        lineHeight: '1.2',
        zIndex: 10000,
        textAlign: 'center',
        outline: 'none',
        whiteSpace: 'normal',
        transformOrigin: '0px 0px 0px',
        transform: 'scale(1, 1) translate(-50%, -50%)',
        maxWidth: config.maxWidth,
        top: config.top,
        left: config.left,
        font: config.style === null ? null : config.style.font,
        color: config.style === null ? null : config.style.color,
        backgroundColor: config.style === null ? null : config.style.backgroundColor,
        borderColor:  config.style === null ? null : config.style.borderColor,

        borderStyle: 'solid',
        display: 'inline-block',
        position: 'fixed',
        overflow: 'visible',
        wordWrap: 'normal',
        borderWidth: 0,
        minWidth: '1px',
        resize: 'none',
        padding: '0px',
        margin: '0px'
    };

    return styleObj;
};
