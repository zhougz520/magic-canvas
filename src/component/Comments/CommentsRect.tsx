import * as React from 'react';

import {
    BaseComponent,
    BaseState,
    IBaseProps,
    IBaseState,
    ISize,
    IPosition,
    ContentState
} from '../BaseComponent';
import { IReactData, IBaseData } from '../Draw';
import { IComponentList, CommandMap } from '../Canvas';
import { IContextMenuItems } from '../Stage';

import { CommentsState } from './CommentsState';
import { CommentsRectState, ICommentsRectState } from './CommentsRectState';

import { OrderedSet } from 'immutable';

export class CommentsRect extends BaseComponent<IBaseProps, IBaseState> {
    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new CommentsRectState())
        };
    }

    /**
     * 选中框属性
     * 组件可以重写
     */
    public selectedFrameData = (): IReactData => {
        return {
            pointX: this.getPosition().left + this.props.componentPosition.canvasOffset.left,
            pointY: this.getPosition().top + this.props.componentPosition.canvasOffset.top,
            width: this.getSize().width + 2,
            height: this.getSize().height + 2,
            anchorFill: '#fff',
            stroke: '#108ee9',
            strokeWidth: 1,
            borderOffset: this.props.componentPosition.borderOffset.border * 2
        };
    }

    /**
     * 低效果拖动框属性
     * 组件可以重写
     */
    public stretchFrameData = (item: IBaseData): IReactData => {
        return {
            pointX: item.position.left + this.props.componentPosition.canvasOffset.left,
            pointY: item.position.top + this.props.componentPosition.canvasOffset.top,
            width: item.size.width + 2,
            height: item.size.height + 2,
            anchorFill: '#fff',
            stroke: '#108ee9',
            strokeWidth: 1,
            borderOffset: this.props.componentPosition.borderOffset.border * 2
        };
    }

    /**
     * 是否可以复制
     */
    public isCanCopy = (): boolean => {
        return false;
    }

    /**
     * 重写Base方法，是否可以选中
     */
    public isCanSelected = (): boolean => {
        const commentsCid: string = this.getCid().split('.')[0];
        const comments = this.props.getComponent(commentsCid);
        if (comments) {
            return comments.isCanSelected();
        }

        return false;
    }

    /**
     * 获取组件的右键菜单
     * 默认：空，组件自己重写
     */
    public getContextMenuItems = (): IContextMenuItems[] => {
        return [
            {
                type: 'menu',
                label: '删除',
                click: () => {
                    this.props.executeCommand({
                        t: CommandMap.COMMENTSRECT_DELETE,
                        d: this.getCid()
                    });
                }
            }
        ];
    }

    componentDidUpdate(prevProps: IBaseProps, prevState: IBaseState) {
        const currentContent: ContentState = this.state.baseState.getCurrentContent();
        const prevContent: ContentState = prevState.baseState.getCurrentContent();

        if (
            currentContent.getPositionState().equals(prevContent.getPositionState()) === false ||
            currentContent.getSizeState().equals(prevContent.getSizeState()) === false
        ) {
            // 选中框位置大小改变，同时修改对应的批注组件的CustomState
            this.updateCommentsCustomState(this.getBaseState());
        }
    }

    render() {
        const size: ISize = this.getSize();
        const position: IPosition = this.getPosition();

        return (
            <rect
                transform="translate(0.5,0.5)"
                x={position.left}
                y={position.top}
                width={size.width}
                height={size.height}
                rx={5}
                ry={5}
                fill="#fff"
                fillOpacity="0"
                stroke="#D0021B"
                strokeWidth="1"
                pointerEvents={this.isCanSelected() ? 'auto' : 'none'}
                onMouseDown={this.fireSelectChange}
            />
        );
    }

    /**
     * 修改批注的CustomState
     * @param newBaseState 当前的BaseState
     */
    private updateCommentsCustomState = (newBaseState: BaseState) => {
        const commentsCid: string = this.getCid().split('.')[0];
        const comments = this.props.getComponent(commentsCid);
        if (comments) {
            const commentsCustomState: CommentsState = comments.getCustomState();
            const oldCommentsRectList: OrderedSet<IComponentList> = commentsCustomState.getCommentsRectList();
            let newCommentsRectList: OrderedSet<IComponentList> = OrderedSet();
            oldCommentsRectList.map(
                (commentsRect: IComponentList) => {
                    if (commentsRect.cid === this.getCid()) {
                        commentsRect.baseState = newBaseState;
                    }
                    newCommentsRectList = newCommentsRectList.add(commentsRect);
                }
            );

            comments.setCustomState(
                CommentsState.set(commentsCustomState, {
                    commentsRectList: newCommentsRectList
                }),
                false
            );
        }
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ImageState
 */
export function convertFromDataToCustomState(
    customData: ICommentsRectState
): any {
    return new CommentsRectState(customData);
}
