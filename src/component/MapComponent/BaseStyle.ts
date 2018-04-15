import * as React from 'react';

export const BaseStyle = (zIndex: number): React.CSSProperties => {
    const styleObj: React.CSSProperties = {
        overflow: 'hidden',
        position: 'absolute',
        border: '1px solid',
        outline: 'none'
    };

    return styleObj;
};
