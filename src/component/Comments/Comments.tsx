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
    SizeState
} from '../BaseComponent';
import { IComponentList, IOffset } from '../Canvas';
import { CommentsRect } from './CommentsRect';
import { CommentsLine, ICommentsLineProps } from './CommentsLine';

import { DraftPublic, blockStyleFn } from '../RichEdit';
const { Editor, EditorState, InlineUtils } = DraftPublic;

import { OrderedSet } from 'immutable';
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

    render() {
        const { hidden } = this.state;
        const commentsRectList: OrderedSet<IComponentList> = this.getCustomState().get('commentsRectList');
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
