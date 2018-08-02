import * as React from 'react';

import { IBaseProps } from './IBaseProps';
import { IBaseState } from './IBaseState';
import { IComponent } from './IComponent';

import { IPropertyGroup } from '../../UniversalComponents';
import { IPosition, IRichEditOption, IFont } from '../../BaseComponent';

import { OrderedSet } from 'immutable';

/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class MapComponent<P extends IBaseProps, S extends IBaseState>
    extends React.Component<P, S> implements IComponent {

    public editCom: HTMLElement | null = null;
    public defaultFont: IFont = {
        textAlign: 'left',
        fontColor: '#222',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        textDecoration: 'none'
    };

    shouldComponentUpdate(nextProps: any, nextState: any) {
        if (
            JSON.stringify(this.props) === JSON.stringify(nextProps) &&
            JSON.stringify(this.state) === JSON.stringify(nextState)
        ) {
            return false;
        }

        return true;
    }

    /************************************* begin 富文本 ****************************************/
    /**
     * 隐藏可编辑文本Dom
     */
    public hiddenEditorDom = (isHidden: boolean): void => {
        this.setState({
            hidden: isHidden
        });
    }

    /**
     * 获取文本编辑框位置
     */
    public getRichEditOption = (comPosition: IPosition): IRichEditOption => {
        const childCom: HTMLElement = (this.editCom as HTMLElement);

        const position: IPosition = {
            top: comPosition.top + childCom.offsetTop,
            left: comPosition.left + childCom.offsetLeft
        };
        const size: any = {
            width: undefined,
            height: childCom.offsetHeight
        };
        const font: IFont = this.defaultFont;

        return { position, size, font };
    }

    /**
     * 获取组件文本
     * 各组件自己重写
     */
    public getRichChildNode = (): any => {
        return '';
    }

    /**
     * 构建要设置的文本属性对象
     * 各组件自己重写
     */
    public buildRichChildNode = (value: any): any => {
        return {};
    }
    /************************************* end 富文本 ****************************************/

    /************************************* begin 属性设置 ****************************************/
    /**
     * 获取组件的属性，传给属性栏
     * 默认：空，组件自己重写
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        return OrderedSet();
    }

    /**
     * 获取属性工具条的单条属性，传给组件并设置组件
     * 默认：空，组件自己重写
     * @param pKey 属性
     * @param pValue 属性值
     * @param callback 回调函数
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any, callback?: () => void) => {
        return;
    }
    /************************************* end 属性设置 ****************************************/

    /**
     * 选中子控件
     */
    protected selectedCom = (e: any) => {
        const { id, selectComChange } = this.props;
        selectComChange(e, id);
    }
}
