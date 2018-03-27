import * as React from 'react';

import { PositionState } from './model/PositionState';
import { SizeState } from './model/SizeState';

export const BaseStyle = (position: PositionState, size: SizeState): React.CSSProperties => {
    const styleObj: React.CSSProperties = {
        overflow: 'auto',
        position: 'absolute',
        border: '1px solid',
        outline: 'none',
        width: size.getWidth(),
        height: size.getHeight(),
        top: position.getTop(),
        left: position.getLeft()
    };

    return styleObj;
};
