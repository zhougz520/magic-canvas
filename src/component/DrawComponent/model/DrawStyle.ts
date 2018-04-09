import * as React from 'react';

export const DrawStyle = (canvasSize: { width: number, height: number }): React.CSSProperties => {
    return {
        zIndex: 2,
        position: 'absolute',
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
        pointerEvents: 'none',
        left: 0,
        top: 0
    } as React.CSSProperties;
};
