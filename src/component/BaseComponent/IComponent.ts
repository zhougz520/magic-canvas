import { ISize } from './model/SizeState';
import { IPosition } from './model/PositionState';
import { IBaseProps } from './IBaseProps';
import { ContentState } from './model/ContentState';
import { BaseState } from './model/BaseState';
import { EditType, IRichEditOption, ICommentsList, ComponentType, IFont } from './model/types';
import { IReactData, IBaseData } from '../Draw';
import { IPropertyGroup } from '../UniversalComponents';
import { IContextMenuItems } from '../Stage';

import { IAnchor } from '../util';
import { List, OrderedSet } from 'immutable';

/**
 * BaseComponent提供的方法接口
 */
export interface IComponent {
    /**
     * 获取组件的baseProps
     */
    getBaseProps: () => IBaseProps;

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

    /**
     * 获取、设置组件的批注锚点
     */
    getCommentsList: () => List<ICommentsList>;
    setCommentsList: (newCommentsList: List<ICommentsList>) => void;

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
     * 获取、设置组件层级
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
     * 获取默认文字样式
     */
    getFont: () => IFont;

    /**
     * 获取富文本编辑器的一些选项
     * { position, size }
     */
    getRichEditOption: () => IRichEditOption;

    /**
     * 隐藏可编辑部分
     * 呼出富文本编辑器时隐藏组件中被编辑部分
     */
    hiddenEditorDom: (isHidden: boolean) => void;

    /**
     * 是否可以双击修改
     */
    isDbClickToEdit: () => boolean;

    /**
     * 是否可以被选中，主要用于框选判断
     */
    isCanSelected: () => boolean;

    /**
     * 是否可以移动
     */
    isCanMove: () => boolean;

    /**
     * 是否可以挤开其他组件
     */
    isCanPushOpenOtherComponent: () => boolean;

    /**
     * 获取组件的右键菜单
     */
    getContextMenuItems: () => IContextMenuItems[];

    /**
     * 选中框属性
     */
    selectedFrameData: () => IReactData;

    /**
     * 低效果拖动框属性
     */
    stretchFrameData: (item: IBaseData) => IReactData;

    /**
     * 获取组件的属性，传给属性工具条
     */
    getPropertiesToProperty: () =>  OrderedSet<IPropertyGroup>;
    setPropertiesFromProperty: (pKey: string, pValue: any) => void;
}
