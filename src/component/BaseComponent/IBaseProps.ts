import * as React from 'react';

/**
 * TODO：注释
 */
export interface IBaseProps {
    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);
    /**
     * 当使用鼠标点击时，触发正在选中或正在取消选中的事件
     */
    selectionChanging?: (newState: boolean, keyStatus: any) => boolean;
}
