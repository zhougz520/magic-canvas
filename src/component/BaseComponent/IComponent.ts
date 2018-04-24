import { ISize } from './model/SizeState';
import { IPosition } from './model/PositionState';
import * as Anchor from '../util/AnchorPoint';
import { ContentState } from '.';
import { ComponentProperty } from '../config';

/**
 * BaseComponent提供的方法接口
 */
export interface IComponent {
    /**
     * 获取、设置size属性
     */
    getSize: () => ISize;
    setSize: (size: ISize) => void;

    /**
     * 获取、设置position属性
     */
    getPosition: () => IPosition;
    setPosition: (position: IPosition) => void;

    /**
     * 获取、设置richChildNode
     */
    getRichChildNode: () => any;
    setRichChildNode: (richChildNode: any) => void;

    getCustomState: () => any;
    setCustomState: (newCustomState: any) => void;

    /**
     * 重做、撤销
     */
    redo: () => void;
    undo: () => void;

    /**
     * 手动设置堆栈
     */
    setUndoStack: () => void;

    /**
     * 组件层级
     */
    setHierarchy: (zIndex: number) => void;
    getHierarchy: () => number;

    /**
     * 定位鼠标点击的部位
     */
    getPointerAnchor: (currentX: number, currentY: number) => Anchor.IAnchor | null;
    getBoundaryPoint: () => { pointX: number, pointY: number };

    /**
     * 获取组件标识cid
     */
    getCid: () => string;

    /**
     * 获取组件类型
     */
    getType: () => string;

    /**
     * 获取组件的临时状态
     */
    getTempContentState: () => ContentState;

    /**
     * 获取组件样式表
     */
    getStyle: (com: any) => CSSStyleDeclaration;

    getProperties: () =>  ComponentProperty;

    setProperties: (cId: string, pProperty: {pName: string, pValue: any, pType: string}) => void;

    getComponentProperties: () => ComponentProperty;

    setComponentProperties: (cId: string, pProperty: {pName: string, pValue: any, pType: string}) => void;

}
