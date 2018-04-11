import * as React from 'react';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IMapProps {
    data: any;
    repaintSelected?: () => void;
    selectionChanging?: (cid: string, e: any) => void;

    // 组件获得焦点的时候触发画布上的对应事件，通知编辑框准备开始输入
    onComFocus?: (cid: string) => void;

    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);
}
