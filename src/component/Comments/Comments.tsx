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
    IComData
} from '../BaseComponent';
import { IComponentList, IOffset, convertFromBaseStateToData, convertFromDataToBaseState } from '../Canvas';
import { CommentsRect } from './CommentsRect';
import { CommentsLine, ICommentsLineProps } from './CommentsLine';

import { DraftPublic, blockStyleFn } from '../RichEdit';
const { Editor, EditorState, InlineUtils, convertFromDraftStateToRaw, convertFromRawToDraftState } = DraftPublic;

import { OrderedSet, Map } from 'immutable';
import './sass/Comments.scss';

export interface ICommentsState extends IBaseState {
    hidden: boolean;
}

/**
 * 批注的CustomState
 * 存批注框的信息+当前最大批注id
 */
export interface ICustomState {
    commentsRectList: OrderedSet<IComponentList>;
    maxRectId: number;
}

export default class Comments extends BaseComponent<IBaseProps, ICommentsState> {
    private _padding: number = 8;

    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(
                {
                    commentsRectList: OrderedSet(),
                    maxRectId: 0
                } as ICustomState,
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

        const position: IPosition = {
            top: comPosition.top + this._padding,
            left: comPosition.left + this._padding
        };
        const size: ISize = {
            width: comSize.width - 2 * this._padding,
            height: comSize.height - 2 * this._padding
        };

        return { position, size };
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

    public getEncodeCustomState = (): ICustomState => {
        return this.getCustomState().toObject();
    }

    render() {
        const { hidden } = this.state;
        const commentsRectList: OrderedSet<IComponentList> = this.getEncodeCustomState().commentsRectList;
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
                    style={BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false)}
                >
                    <Editor
                        editorState={editorState}
                        inlineStyleRenderMap={InlineUtils.getDraftInlineStyleMap()}
                        // tslint:disable-next-line:jsx-no-lambda
                        onChange={() => { return; }}
                        readOnly
                        customContentStyle={{padding: this._padding, visibility: hidden ? 'hidden' : 'visible'}}
                        blockStyleFn={blockStyleFn}
                    />
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
            setCanvasUndoStack
        } = this.props;

        if (commentsRectList) {
            commentsRectList.map(
                (commentsRect: IComponentList) => {
                    const commentsLine: ICommentsLineProps = this.buildLine(this.getBaseState(), commentsRect.baseState, {x: -2, y: 20});
                    rectList.push(
                        <g key={commentsRect.cid}>
                            <CommentsRect
                                // tslint:disable-next-line:jsx-no-string-ref
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
    const encodeCustomState: ICustomState = customState.toObject();
    const commentsRectList: OrderedSet<IComponentList> = encodeCustomState.commentsRectList;
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
        commentsRectList: components,
        maxRectId: encodeCustomState.maxRectId
    };
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ICommentsState | null | Map
 */
export function convertFromDataToCustomState(
    customData: {
        commentsRectList: Array<{
            t: string;
            p: IComData;
        }>;
        maxRectId: number;
    } | any
): any {
    let componentList: OrderedSet<IComponentList> = OrderedSet();
    let maxRectId: number = 0;
    if (customData && customData.commentsRectList && customData.maxRectId) {
        customData.commentsRectList.map(
            (commentsRect: any) => {
                const baseState: BaseState = convertFromDataToBaseState(commentsRect.p, commentsRect.t);

                componentList = componentList.add({
                    cid: commentsRect.p.id,
                    comPath: commentsRect.t,
                    baseState,
                    childData: commentsRect.p.p,
                    initType: 'Init'
                });
            }
        );

        maxRectId = customData.maxRectId;
    }

    return Map({
        commentsRectList: componentList,
        maxRectId
    });
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
