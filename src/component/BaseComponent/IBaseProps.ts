import * as React from 'react';
import * as Anchor from '../util/AnchorPoint';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);

    selectionChanging?: (cid: string, e: any) => void;

    data: any;
}
