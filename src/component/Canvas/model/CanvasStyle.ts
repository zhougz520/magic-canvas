import * as React from 'react';
import { PageMode } from '../../Stage';

const a4Size: { width: number; height: number } = { width: 1675, height: 1187 };

export const CanvasStyle = (
    pos: { top: number, left: number, right: number, bottom: number },
    pageMode: PageMode
) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = a4Size.width;
    canvas.height = a4Size.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 7]);
    ctx.strokeStyle = '#d9d9d9';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(a4Size.width, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, a4Size.height);
    ctx.stroke();
    const dataUrl: string = canvas.toDataURL();

    return {
        position: 'absolute',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        right: `${pos.right}px`,
        bottom: `${pos.bottom}px`,
        margin: 0,
        padding: 0,
        backgroundColor: '#fff',
        backgroundImage: pageMode === 'Edit' ? `url(${dataUrl})` : undefined,
        backgroundPosition: pageMode === 'Edit' ? '-1px -1px' : undefined,
        zIndex: 0
    } as React.CSSProperties;
};

export const ContainerStyle = (size: { width: number, height: number }): React.CSSProperties => {
    return {
        zIndex: 0,
        position: 'absolute',
        width: `${size.width}px`,
        height: `${size.height}px`,
        left: 0,
        right: 0,
        margin: 0,
        padding: 0,
        overflow: 'visible'
    } as React.CSSProperties;
};
