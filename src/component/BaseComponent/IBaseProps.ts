import * as React from 'react';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);

    selectionChanging?: (cid: string, e: any) => void;

    repairSelected?: () => void;

    data: any;
}
