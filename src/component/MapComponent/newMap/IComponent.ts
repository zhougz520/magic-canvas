import { IPropertyGroup } from '../../UniversalComponents';
import { IPosition, IRichEditOption } from '../../BaseComponent';

import { OrderedSet } from 'immutable';

/**
 * BaseComponent提供的方法接口
 */
export interface IComponent {
    /**
     * 获取组件的属性，传给属性栏
     */
    getPropertiesToProperty: () =>  OrderedSet<IPropertyGroup>;
    setPropertiesFromProperty: (pKey: string, pValue: any, callback?: () => void) => void;

    /**
     * 隐藏可编辑文本Dom
     */
    hiddenEditorDom: (isHidden: boolean) => void;

    /**
     * 获取文本编辑框位置
     */
    getRichEditOption: (comPosition: IPosition) => IRichEditOption;

    /**
     * 获取组件文本
     */
    getRichChildNode: () => any;

    /**
     * 构建要设置的文本属性对象
     */
    buildRichChildNode: (value: any) => any;
}
