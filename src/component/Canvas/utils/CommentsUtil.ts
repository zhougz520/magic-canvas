import { Canvas } from '../Canvas';
import { BaseState, ISize, IPosition, IComData, IComponent, ICommentsList } from '../../BaseComponent';
import { IAddCommentsParam, IComponentList, IOffset } from '../model/types';
import { convertFromDataToBaseState } from '../encoding/convertFromDataToBaseState';

import { OrderedSet, List } from 'immutable';

export class CommentsUtil {
    public _addCommentsRectParam: IAddCommentsParam = {
        component: null,
        startPoint: null,
        endPoint: null
    };                                                          // 添加批注框的位置
    public _currentCommentsCid: string | null = null;        // 当前添加的批注的cid

    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 开始添加批注
     */
    startAddComments = () => {
        this._canvas._isAddCommentsMode = true;
        this._canvas.setState({ cursor: 'crosshair' });
    }

    /**
     * 结束添加批注
     */
    stopAddComments = () => {
        this.doAddComments();

        this._canvas._isAddCommentsMode = false;
        this._canvas.setState({ cursor: 'default' });
        // 通知绘画层清理批注选择框
        const draw = this._canvas.props.getDraw();
        if (draw !== null) {
            draw.drawChoiceBox(null);
        }
        this._addCommentsRectParam = {
            component: null,
            startPoint: null,
            endPoint: null
        };
    }

    /**
     * mouseDown的时候记录落点的组件和鼠标位置
     */
    setMouseDownParam = (e: any) => {
        const startPoint: IOffset = this._canvas._canvasGlobalParam.getPointerStart('canvas');
        this._addCommentsRectParam.startPoint = startPoint;
    }

    /**
     * mouseUp的时候记录鼠标位置
     */
    setMouseUpParam = (e: any) => {
        const endPoint: IOffset = this._canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);
        this._addCommentsRectParam.endPoint = endPoint;
        const startPoint: IOffset = this._addCommentsRectParam.startPoint as IOffset;

        // TODO 通过组件冒泡来更新component，循环影响性能
        const componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        componentList.map(
            (component: IComponentList) => {
                const com = this._canvas.getComponent(component.cid);
                if (com !== null) {
                    const pos: IPosition = com.getPosition();
                    const size: ISize = com.getSize();
                    const zIndex: number = com.getHierarchy();
                    if (pos.top <= startPoint.y && startPoint.y <= pos.top + size.height &&
                        pos.left <= startPoint.x && startPoint.x <= pos.left + size.width) {
                        if (this._addCommentsRectParam.component === null) {
                            this._addCommentsRectParam.component = com;
                        } else {
                            if (zIndex > this._addCommentsRectParam.component.getHierarchy()) {
                                this._addCommentsRectParam.component = com;
                            }
                        }
                    }
                }
            }
        );
    }

    /**
     * 获取添加批注的位置
     * @param offset 相对于选中框右上角的偏移量
     */
    getAddCommentsPosition = (offset: IOffset): IPosition | null => {
        const { startPoint, endPoint } = this._addCommentsRectParam;
        if (startPoint === null || endPoint === null) return null;

        const position: IPosition = {
            left: Math.max(startPoint.x, endPoint.x) + offset.x,
            top: Math.min(startPoint.y, endPoint.y) - offset.y
        };

        return position;
    }

    /**
     * 获取添加批注框的位置
     */
    getAddCommentsRectPositionAndSize = (): { position: IPosition; size: ISize; } | null => {
        const { startPoint, endPoint } = this._addCommentsRectParam;
        if (startPoint === null || endPoint === null) return null;

        const position: IPosition = {
            left: Math.min(startPoint.x, endPoint.x),
            top: Math.min(startPoint.y, endPoint.y)
        };
        const size: ISize = {
            width: Math.abs(startPoint.x - endPoint.x) === 0 ? 10 : Math.abs(startPoint.x - endPoint.x),
            height: Math.abs(startPoint.y - endPoint.y) === 0 ? 10 : Math.abs(startPoint.y - endPoint.y)
        };

        return {
            position,
            size
        };
    }

    /**
     * 添加批注组件
     */
    doAddComments = (): void => {
        const position = this.getAddCommentsPosition({ x: 150, y: 50 });
        if (position === null) return;

        // 批注组件的数据
        const data = {
            offset: { x: 0, y: 0 },
            p: { name: '批注', w: 204, h: 170 },
            t: 'Comments/Comments'
        };
        this._canvas._componentsUtil.addCancasComponent(
            List().push(data),
            { x: position.left, y: position.top },
            undefined,
            undefined,
            this.doAddCommentsRect
        );
    }

    /**
     * 添加批注框
     */
    doAddCommentsRect = () => {
        if (this._currentCommentsCid === null) return;
        const comComments = this._canvas.getComponent(this._currentCommentsCid);

        if (comComments) {
            const commentsCustomState = comComments.getCustomState();
            const rectPositionAndSize = this.getAddCommentsRectPositionAndSize();
            if (rectPositionAndSize === null) return;
            const { position, size } = rectPositionAndSize;

            const data = {
                offset: { x: 0, y: 0 },
                p: { name: '批注框', w: size.width, h: size.height },
                t: 'Comments/CommentsRect'
            };
            const comData: IComData = this._canvas._componentsUtil.convertComponentToData(
                data,
                { x: position.left, y: position.top },
                { cid: this._addCommentsRectParam.component ? this._addCommentsRectParam.component.getCid() : null }
            );
            comData.id = comComments.getCid() + '.cr' + (commentsCustomState.get('maxRectId') + 1);
            comData.zIndex = 0;

            const baseState: BaseState = convertFromDataToBaseState(comData);
            const component: IComponentList = {
                cid: comData.id,
                comPath: data.t,
                baseState,
                childData: comData.p,
                initType: 'Add'
            };

            const commentsRectList: OrderedSet<IComponentList> =
                commentsCustomState.get('commentsRectList').add(component);
            comComments.setCustomState({
                commentsRectList,
                maxRectId: commentsCustomState.get('maxRectId') + 1
            });

            this.setComponentCommentsList(comData.id, { top: comData.t, left: comData.l });
        }
    }

    /**
     * 对选择组件设置CommentsList
     * @param rectCid 选中框cid
     */
    setComponentCommentsList = (rectCid: string, rectPosition: IPosition) => {
        const component: IComponent | null = this._addCommentsRectParam.component;
        if (component !== null) {
            const componentPosition: IPosition = component.getPosition();
            const newComments: ICommentsList = {
                cid: rectCid,
                relativePosition: {
                    top: rectPosition.top - componentPosition.top,
                    left: rectPosition.left - componentPosition.left
                }
            };

            const oldCommentsList = component.getCommentsList();
            const newCommentsList = oldCommentsList.push(newComments);
            component.setCommentsList(newCommentsList);
        }
    }
}
