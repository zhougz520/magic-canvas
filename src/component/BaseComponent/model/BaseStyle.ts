import * as React from 'react';
import {PostionState, SizeState} from '../index';

export const BaseStyle = (position: PostionState, size: SizeState): React.CSSProperties => {
    const styleObj: React.CSSProperties = {
        overflow: 'auto',
        position: 'absolute',
        border: '1px solid',
        width: size.getWidth(),
        height: size.getHeight(),
        top: position.getTop(),
        left: position.getLeft()
    };

    return styleObj;
};
