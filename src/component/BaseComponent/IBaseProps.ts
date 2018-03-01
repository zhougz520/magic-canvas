import * as React from 'react';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);

    /**
     * 位置属性，与原型V2.0保持相同
     * 当值为-1时，不设置对应样式
     */
    t: number;
    l: number;
    r: number;
    b: number;

    /**
     * 大小属性，与原型V2.0保持相同
     * 当值为-1时，不设置对应样式
     */
    w: number;
    h: number;

    /**
     * 组件内数据集
     */
    data: any;
}
