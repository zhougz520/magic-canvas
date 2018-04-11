import * as React from 'react';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    data: any;
    zIndex: number;
    repaintSelected?: () => void;
    selectionChanging?: (cid: string, e: any) => void;

    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);
}
