import { ISize } from './model/SizeState';
import { IPosition } from './model/PositionState';
import { ContentState, ComponentType } from './model/ContentState';
import { BaseState } from './model/BaseState';
import { EditType, IRichEditOption } from './model/types';

import { IAnchor } from '../util';
import { Map } from 'immutable';

/**
 * BaseComponent提供的方法接口
 */
export interface IComponent {

    com: any;
    /**
     * 获取、设置组件的baseState
     */
    getBaseState: () => BaseState;
    setBaseState: (baseState: BaseState) => void;

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

    /**
     * 获取、设置customState
     */
    getCustomState: () => any;
    setCustomState: (newCustomState: any) => void;

    getCommentsMap: () => Map<any, any>;
    setCommentsMap: (newCommentsMap: Map<any, any>) => void;

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
    getPointerAnchor: (currentX: number, currentY: number) => IAnchor | null;
    getBoundaryPoint: () => { pointX: number, pointY: number };

    /**
     * 获取组件标识cid
     */
    getCid: () => string;

    /**
     * 获取组件类型
     */
    getComType: () => ComponentType | null;

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

    /**
     * 获取组件富文本编辑模式
     * 返回值：富文本、普通文本、多行文本、无文本编辑
     */
    getRichEditType: () => EditType;

    /**
     * 获取现实富文本编辑器的一些选项
     * { position, size }
     */
    getRichEditOption: () => IRichEditOption;

    /**
     * 隐藏可编辑部分
     * 呼出富文本编辑器时隐藏组件中被编辑部分
     */
    hiddenEditorDom: (isHidden: boolean) => void;

    getPropertiesToProperty: () =>  Array<{pTitle: string, pKey: string, pValue: any, pType: string}>;

    setPropertiesFromProperty: (pKey: string, pValue: any) => void;

    getPropertiesToCommand: () => Array<{pTitle: string, pKey: string, pValue: any, pType: string}>;

    setPropertiesFromCommand: (pKey: string, pValue: any) => void;

    getComponentSettableCommands: () => string[];

}
