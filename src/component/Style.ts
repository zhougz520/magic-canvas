import * as React from 'react';

export const StageStyle = (offset: { top: number, left: number }) => {
    return {
        position: 'absolute',
        top: `${offset.top}px`,
        left: `${offset.left}px`,
        right: '240px',
        bottom: '35px',
        margin: 'auto',
        overflow: 'auto',
        backgroundColor: '#f3f3f3',
        display: 'block',
        border: '1px solid #108ee9'
    } as React.CSSProperties;
};
