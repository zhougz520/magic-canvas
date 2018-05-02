import * as React from 'react';
import { IComponent } from './IComponent';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    data: any;
    zIndex: number;
    repaintSelected: () => void;
    repaintCanvas: (pointX: number, pointY: number) => void;
    selectionChanging: (cid: string, isCanCtrl: boolean) => void;
    dbClickToBeginEdit?: () => void;
    clearSelected: () => void;
    getComponent: (cid: string) => IComponent | null;

    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);
}
