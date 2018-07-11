import * as React from 'react';
import {
    BaseComponent,
    BaseState,
    IBaseProps,
    IBaseState,
    BaseStyle,
    IPosition,
    ISize,
    EditType,
    IRichEditOption,
    PositionState,
    SizeState,
    IComData,
    IFont,
    MaskLayer
} from '../BaseComponent';
import { IComponentList, IOffset, convertFromBaseStateToData, convertFromDataToBaseState, CommandMap } from '../Canvas';
import { IContextMenuItems } from '../Stage';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../UniversalComponents';
import { CommentsRect } from './CommentsRect';
import { CommentsLine, ICommentsLineProps } from './CommentsLine';
import { CommentsState, ICommentsState } from './CommentsState';

import { blockStyleFn } from '../RichEdit';
import { DraftPublic } from 'xprst-draft';
const { Editor, EditorState, InlineUtils, convertFromDraftStateToRaw, convertFromRawToDraftState } = DraftPublic;

import { OrderedSet, List, Map } from 'immutable';
import './sass/Comments.scss';

export interface ICommentsBaseState extends IBaseState {
    hidden: boolean;
}

/* tslint:disable:jsx-no-string-ref jsx-no-lambda jsx-no-multiline-js */
export default class Comments extends BaseComponent<IBaseProps, ICommentsBaseState> {
    private _padding: number = 8;

    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(
                new CommentsState(),
                EditorState.createEmpty('需求' + this.props.baseState.getCurrentContent().getCid().replace('cm', '') + '：\n')
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
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();
        const comFont: IFont = this.getFont();

        const position: IPosition = {
            top: comPosition.top + 24,
            left: comPosition.left + this._padding
        };
        const size: ISize = {
            width: comSize.width - 2 * this._padding,
            height: comSize.height - this._padding - 24
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
        const newCommentsState: CommentsState = CommentsState.set(this.getCustomState(), properties);

        this.setCustomState(newCommentsState, callback);
    }

    /**
     * 获取组件的右键菜单
     * 默认：空，组件自己重写
     */
    public getContextMenuItems = (): IContextMenuItems[] => {
        return [
            {
                type: 'menu',
                label: '添加锚点',
                click: () => {
                    this.props.executeCommand({
                        t: CommandMap.COMMENTSRECT_ADD,
                        d: this.getCid()
                    });
                }
            }
        ];
    }

    render() {
        const { hidden } = this.state;
        const commentsCustomState: CommentsState = this.getCustomState();
        const commentsRectList: OrderedSet<IComponentList> = commentsCustomState.getCommentsRectList();
        const rectList: JSX.Element[] = this.buildRect(commentsRectList);

        const editorState = this.getRichChildNode();
        InlineUtils.extractInlineStyle(editorState);

        return (
            <React.Fragment>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="100%"
                    height="100%"
                    pointerEvents="none"
                    style={{ position: 'absolute', zIndex: this.getHierarchy() }}
                >
                    {rectList}
                </svg>
                <div
                    className="comments"
                    onMouseDown={this.fireSelectChange}
                    onDoubleClick={this.doDbClickToEdit}
                    style={{
                        ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false),
                        backgroundColor: commentsCustomState.getBackgroundColor()
                    }}
                >
                    <MaskLayer id={this.getCid()} pageMode={this.props.pageMode} />
                    <div style={{ width: '100%', height: '24px', lineHeight: '24px', paddingLeft: this._padding, fontWeight: 'bold', fontSize: '12px' }}>{commentsCustomState.getAuthor()}：</div>
                    <div style={{ width: '100%', height: this.getSize().height - 24 }}>
                        <Editor
                            editorState={editorState}
                            inlineStyleRenderMap={InlineUtils.getDraftInlineStyleMap()}
                            onChange={() => { return; }}
                            readOnly
                            customContentStyle={{
                                paddingLeft: this._padding,
                                paddingRight: this._padding,
                                paddingBottom: this._padding,
                                paddingTop: 0,
                                visibility: hidden ? 'hidden' : 'visible'
                            }}
                            blockStyleFn={blockStyleFn}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    /**
     * 构建批注选中框
     */
    private buildRect = (commentsRectList: OrderedSet<IComponentList>): JSX.Element[] => {
        const rectList: JSX.Element[] = [];
        const {
            pageMode,
            componentPosition,
            repaintSelected,
            repaintCanvas,
            selectionChanging,
            getComponent,
            resetMaxAndMinZIndex,
            setCanvasUndoStack,
            executeCommand
        } = this.props;

        if (commentsRectList) {
            commentsRectList.map(
                (commentsRect: IComponentList) => {
                    const commentsLine: ICommentsLineProps = this.buildLine(this.getBaseState(), commentsRect.baseState, { x: -2, y: 20 });
                    rectList.push(
                        <g key={commentsRect.cid}>
                            <CommentsRect
                                ref={`c.${commentsRect.cid}`}
                                pageMode={pageMode}
                                childData={commentsRect.childData}
                                baseState={commentsRect.baseState}
                                comPath={commentsRect.comPath}
                                initType={commentsRect.initType}
                                componentPosition={componentPosition}
                                repaintSelected={repaintSelected}
                                repaintCanvas={repaintCanvas}
                                selectionChanging={selectionChanging}
                                getComponent={getComponent}
                                executeCommand={executeCommand}
                                resetMaxAndMinZIndex={resetMaxAndMinZIndex}
                                setCanvasUndoStack={setCanvasUndoStack}
                            />
                            <CommentsLine
                                x1={commentsLine.x1}
                                y1={commentsLine.y1}
                                x2={commentsLine.x2}
                                y2={commentsLine.y2}
                            />
                        </g>
                    );
                }
            );
        }

        return rectList;
    }

    /**
     * 构建连接线
     */
    private buildLine = (commentsBaseState: BaseState, rectBaseState: BaseState, offset: IOffset): ICommentsLineProps => {
        const commentsPositionState: PositionState = commentsBaseState.getCurrentContent().getPositionState();
        const rectPositionState: PositionState = rectBaseState.getCurrentContent().getPositionState();
        const rectSizeState: SizeState = rectBaseState.getCurrentContent().getSizeState();

        return {
            x1: commentsPositionState.getLeft() + offset.x,
            y1: commentsPositionState.getTop() + offset.y,
            x2: rectPositionState.getLeft() + rectSizeState.getWidth(),
            y2: rectPositionState.getTop()
        };
    }
}

/**
 * 批注把customState转成需要保存的data
 * @param customState 批注的customState
 */
export function convertFromCustomStateToData(customState: any): any {
    const components: any[] = [];
    const encodeCustomState: CommentsState = customState;
    const commentsRectList: OrderedSet<IComponentList> = encodeCustomState.getCommentsRectList();
    commentsRectList.map(
        (commentsRect: IComponentList) => {
            components.push(
                convertFromBaseStateToData(
                    commentsRect.baseState,
                    {
                        comPath: commentsRect.comPath,
                        childData: commentsRect.childData
                    }
                )
            );
        }
    );

    return {
        author: encodeCustomState.getAuthor(),
        userType: encodeCustomState.getUserType(),
        commentsRectList: components,
        maxRectId: encodeCustomState.getCommentsRectList(),
        backgroundColor: encodeCustomState.getBackgroundColor()
    };
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ICommentsState | null | Map
 */
export function convertFromDataToCustomState(
    customData: {
        author: string;
        userType: 'Master' | 'Guest';
        commentsRectList: Array<{
            t: string;
            p: IComData;
        }>;
        maxRectId: number;
        backgroundColor: string;
    } | any
): any {
    const data: ICommentsState = {
        author: '',
        userType: 'Master',
        commentsRectList: OrderedSet(),
        maxRectId: 0,
        backgroundColor: '#fffbba'
    };
    if (customData && customData.commentsRectList) {
        customData.commentsRectList.map(
            (commentsRect: any) => {
                const baseState: BaseState = convertFromDataToBaseState(commentsRect.p, commentsRect.t);

                data.commentsRectList = data.commentsRectList.add({
                    cid: commentsRect.p.id,
                    comPath: commentsRect.t,
                    baseState,
                    childData: commentsRect.p.p,
                    initType: 'Init'
                });
            }
        );

        data.author = customData.author;
        data.userType = customData.userType;
        data.maxRectId = customData.maxRectId;
        data.backgroundColor = customData.backgroundColor;
    }

    return CommentsState.create(data);
}

/**
 * 把富文本转为保存数据
 * @param richChildNode 富文本对象
 */
export function convertFromRichToData(
    richChildNode: any
): any {
    const contentState: any = richChildNode.getCurrentContent();

    return convertFromDraftStateToRaw(contentState);
}

/**
 * 包保存的文本数据转成富文本对象
 * @param richChildData 富文本json
 */
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

/**
 * 获取粘贴的CustomData
 * @param customData 自定义数据
 */
export function getPasteCustomState(customData: any): any {
    return null;
}
