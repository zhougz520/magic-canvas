import * as React from 'react';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);

    selectionChanging?: (cid: string, e: any) => void;

    repairSelected?: () => void;

    // 组件获得焦点的时候触发画布上的对应事件，通知编辑框准备开始输入
    onComFocus?: (cid: string, e: any) => void;

    data: any;
}
