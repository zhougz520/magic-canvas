import * as React from 'react';

export const CanvasStyle = (pos: { top: number, left: number, right: number, bottom: number }) => {
    return {
        position: 'absolute',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        right: `${pos.right}px`,
        bottom: `${pos.bottom}px`,
        margin: 0,
        padding: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,.2)',
        backgroundColor: '#fff',
        zIndex: 0
    } as React.CSSProperties;
};

export const ContainerStyle = (size: { width: number, height: number }): React.CSSProperties => {
    return {
        position: 'absolute',
        width: `${size.width}px`,
        height: `${size.height}px`,
        left: 0,
        right: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden'
    } as React.CSSProperties;
};
