import * as React from 'react';

export const CanvasStyle = (pos: { top: number, left: number }) => {
    return {
        position: 'absolute',
        width: '1027px',
        height: '668px',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        bottom: `${pos.top}px`,
        margin: 0,
        padding: 0,
        overflow: 'auto',
        boxShadow: '0 2px 8px rgba(0,0,0,.2)',
        backgroundColor: '#fff',
        zIndex: 0
    } as React.CSSProperties;
};

export const ContainerStyle: React.CSSProperties = {
    position: 'absolute',
    // width: '1123px',
    // height: '764px',
    width: '100%',
    height: '100%',
    left: 0,
    right: 0,
    margin: 'auto',
    padding: 0
};