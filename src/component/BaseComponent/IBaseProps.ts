import * as React from 'react';
import { IComponent } from './IComponent';
import { BaseState } from './model/BaseState';
import { OperationType, IComponentList, InitType } from '../Canvas';
import { PageMode, ICompos } from '../Stage';

import { List } from 'immutable';

/**
 * 构建BaseComponent的Props
 * 传递给State进行修改
 */
export interface IBaseProps {
    // 页面模式
    pageMode: PageMode;
    // 子组件数据：component.p
    childData: any;
    // 组件的baseState，用来初始化
    baseState: BaseState;
    // 组件路径
    comPath: string;
    // 组件初始化类型
    initType: InitType;
    // 画布偏移量
    componentPosition: ICompos;
    // 改动组件大小的时候，调用画布的重绘选中框
    repaintSelected: () => void;
    // 改动组件位置的时候，调用画布的重置画布大小
    repaintCanvas: (pointX: number, pointY: number) => void;
    // 选中组件
    selectionChanging: (cid: string) => void;
    // 双击修改
    dbClickToBeginEdit?: (cid: string) => void;
    // 通过cid获取画布上其他组件
    getComponent: (cid: string) => IComponent | null;
    // z-Index改变时，调用画布重算最大最小z-Index
    resetMaxAndMinZIndex: () => void;
    // 设置画布撤销栈
    setCanvasUndoStack: (timeStamp: number, operationType: OperationType, componentList: List<IComponentList>) => void;

    componentRef?: (ref: React.ReactNode | null) => (void | React.ReactNode);
}
