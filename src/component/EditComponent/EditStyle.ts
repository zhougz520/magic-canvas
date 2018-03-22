import * as React from 'react';

export const EditStyle = (position: any, size: any): React.CSSProperties => {
    const styleObj: React.CSSProperties = {
        borderColor: 'black',
        borderStyle: 'solid',
        display: 'inline-block',
        position: 'absolute',
        overflow: 'visible',
        wordWrap: 'normal',
        borderWidth: 1,
        minWidth: '1px',
        minHeight: '1em',
        resize: 'none',
        padding: '0px',
        margin: '0px',
        lineHeight: 1.2,
        textAlign: 'center',
        transformOrigin: '0px 0px 0px',
        transform: 'scale(1, 1) translate(-50%, -50%)',
        zIndex: 1000,

        maxWidth: size.width,
        top: position.top + size.height / 2,
        left: position.left + size.width / 2
    };

    return styleObj;
};
