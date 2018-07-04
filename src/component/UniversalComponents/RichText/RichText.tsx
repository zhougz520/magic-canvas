import * as React from 'react';
import {
    BaseState,
    BaseStyle,
    IPosition,
    ISize,
    EditType,
    IRichEditOption,
    IFont,
    MaskLayer
} from '../../BaseComponent';
import {
    BaseUniversalComponent,
    IBaseUniversalComponentProps,
    IBaseUniversalComponentState
} from '../BaseUniversalComponent';
import { blockStyleFn } from '../../RichEdit';
import { RichTextState, IRichTextState } from './RichTextState';
import { PropertiesEnum, IPropertyGroup, IProperty, IToolButtonGroup, emptyButtonGroup } from '../model/types';

import { DraftPublic } from 'xprst-draft';
const { Editor, EditorState, InlineUtils, convertFromDraftStateToRaw, convertFromRawToDraftState } = DraftPublic;

import { OrderedSet, List, Map } from 'immutable';

/* tslint:disable:jsx-no-string-ref jsx-no-lambda jsx-no-multiline-js */
export default class RichText extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(
                new RichTextState(),
                EditorState.createEmpty('')
            ),
            hidden: false
        };
    }

    /**
     * 调用富文本编辑器
     */
    public getRichEditType = (): EditType => {
        return 'RichEdit';
    }

    /**
     * 获取组件富文本内容
     * 返回：带格式的富文本内容（html）
     */
    public getRichChildNode = (): any => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getCurrentContent().getRichChildNode();
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();
        const comFont: IFont = this.getFont();
        const padding: number = this.getCustomState().getBorderWidth();

        const position: IPosition = {
            top: comPosition.top + padding,
            left: comPosition.left + padding
        };
        const size: ISize = {
            width: comSize.width - 2 * padding,
            height: comSize.height - 2 * padding
        };
        const font: IFont = comFont;

        return { position, size, font };
    }

    /**
     * 隐藏富文本展示Div
     */
    public hiddenEditorDom = (isHidden: boolean): void => {
        this.setState({
            hidden: isHidden
        });
    }

    /**
     * 重写Base方法，是否可以双击修改
     */
    public isDbClickToEdit = (): boolean => {
        return true;
    }

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 外观
        propertyList = propertyList.push(
            {
                pTitle: '背景颜色',
                pKey: 'backgroundColor',
                pValue: this.getCustomState().getBackgroundColor(),
                pType: PropertiesEnum.COLOR_PICKER
            },
            {
                pTitle: '边框颜色',
                pKey: 'borderColor',
                pValue: this.getCustomState().getBorderColor(),
                pType: PropertiesEnum.COLOR_PICKER
            },
            {
                pTitle: '边框宽度',
                pKey: 'borderWidth',
                pValue: this.getCustomState().getBorderWidth(),
                pType: PropertiesEnum.SLIDER
            }
        );
        propertyGroup = propertyGroup.add(
            {
                groupTitle: '外观',
                groupKey: 'exterior',
                colNum: 1,
                propertyList
            }
        );
        propertyList = List();

        return propertyGroup;
    }

    /**
     * 设置属性
     */
    public setPropertiesFromProperty = (pKey: string, pValue: any, callback?: () => void) => {
        let properties = Map();
        properties = properties.set(pKey, pValue);
        const newRichTextState: RichTextState = RichTextState.set(this.getCustomState(), properties);

        this.setCustomState(newRichTextState, callback);
    }

    /**
     * 获取组件的字体属性，传给工具栏
     * 默认：空，组件自己重写
     */
    public getFontPropsToTool = (): IToolButtonGroup => {
        return emptyButtonGroup;
    }

    render() {
        const { hidden } = this.state;

        const editorState = this.getRichChildNode();
        InlineUtils.extractInlineStyle(editorState);

        return (
            <div
                style={{
                    ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false),
                    backgroundColor: this.getCustomState().getBackgroundColor(),
                    borderColor: this.getCustomState().getBorderColor(),
                    borderWidth: this.getCustomState().getBorderWidth(),
                    borderStyle: 'solid'
                }}
                onMouseDown={this.fireSelectChange}
                onDoubleClick={this.doDbClickToEdit}
            >
                <MaskLayer id={this.getCid()} pageMode={this.props.pageMode} />
                <div style={{ width: '100%', height: this.getSize().height - 24 }}>
                    <Editor
                        editorState={editorState}
                        inlineStyleRenderMap={InlineUtils.getDraftInlineStyleMap()}
                        onChange={() => { return; }}
                        readOnly
                        customContentStyle={{
                            visibility: hidden ? 'hidden' : 'visible'
                        }}
                        blockStyleFn={blockStyleFn}
                    />
                </div>
            </div>
        );
    }

}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：IButtonState
 */
export function convertFromDataToCustomState(
    customData: IRichTextState
): any {
    return new RichTextState(customData);
}

export function convertFromRichToData(
    richChildNode: any
): any {
    const contentState: any = richChildNode.getCurrentContent();

    return convertFromDraftStateToRaw(contentState);
}

export function convertFromDataToRich(
    richChildData: any
): any {
    let richChildNode: any = null;
    if (richChildData) {
        const contentState: any = convertFromRawToDraftState(richChildData);
        richChildNode = EditorState.createWithContent(contentState);
    }

    return richChildNode;
}
