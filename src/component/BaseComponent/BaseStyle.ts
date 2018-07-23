import * as React from 'react';

import { PositionState } from './model/PositionState';
import { SizeState } from './model/SizeState';

export const BaseStyle = (
    position: PositionState,
    size: SizeState,
    zIndex: number,
    hasBorder: boolean = true,
    isCanSelected: boolean = true
): React.CSSProperties => {
    const styleObj: React.CSSProperties = {
        overflow: 'hidden',
        transition: 'none',
        position: 'absolute',
        border: hasBorder ? '1px solid' : undefined,
        outline: 'none',
        width: size.getWidth(),
        height: size.getHeight(),
        top: position.getTop(),
        left: position.getLeft(),
        userSelect: 'none',
        pointerEvents: isCanSelected ? 'auto' : 'none',
        zIndex
    };

    return styleObj;
};
