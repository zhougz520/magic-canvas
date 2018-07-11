import * as React from 'react';
import { IEditStyle } from './types';

export const EditStyle = (config: IEditStyle): React.CSSProperties => {
    const styleObj: React.CSSProperties = {
        top: config.top,
        left: config.left,
        width: config.width,
        height: config.height,
        position: 'absolute'
    };

    return styleObj;
};
