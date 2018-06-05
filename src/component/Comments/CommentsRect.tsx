import * as React from 'react';

import {
    BaseComponent,
    BaseState,
    IBaseProps,
    IBaseState,
    ISize,
    IPosition,
    ContentState,
    IComponent,
    ICommentsMap
} from '../BaseComponent';
import { IReactData, IBaseData } from '../Draw';
import { IComponentList } from '../Canvas';

import { OrderedSet, Map } from 'immutable';

export class CommentsRect extends BaseComponent<IBaseProps, IBaseState> {
    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState()
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

    componentDidUpdate(prevProps: IBaseProps, prevState: IBaseState) {
        const currentContent: ContentState = this.state.baseState.getCurrentContent();
        const prevContent: ContentState = prevState.baseState.getCurrentContent();

        if (
            currentContent.getPositionState().equals(prevContent.getPositionState()) === false ||
            currentContent.getSizeState().equals(prevContent.getSizeState()) === false
        ) {
            // 选中框位置大小改变，同时修改对应的批注组件的CustomState
            this.updateCommentsCustomState(this.getBaseState());

            // 更新组件客中存的相对位置
            const component: IComponent | null = this.getCustomState().component;
            if (component) {
                const componentPosition: IPosition = component.getPosition();
                const rectPosition: IPosition = this.getPosition();
                const commentsMap: ICommentsMap = {
                    relativePosition: {
                        top: rectPosition.top - componentPosition.top,
                        left: rectPosition.left - componentPosition.left
                    }
                };

                const oldCommentsMap = component.getCommentsMap();
                const newCommentsMap = oldCommentsMap.merge(Map().set(this.getCid(), commentsMap) as Map<string, ICommentsMap>);
                component.setCommentsMap(newCommentsMap);
            }
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
                pointerEvents="auto"
                onMouseDown={this.fireSelectChange}
            />
        );
    }

    private updateCommentsCustomState = (newBaseState: BaseState) => {
        const commentsCid: string = this.getCid().split('.')[0];
        const comments = this.props.getComponent(commentsCid);
        if (comments) {
            const oldCommentsRectList: OrderedSet<IComponentList> = comments.getCustomState().get('commentsRectList');
            let newCommentsRectList: OrderedSet<IComponentList> = OrderedSet();
            oldCommentsRectList.map(
                (commentsRect: IComponentList) => {
                    if (commentsRect.cid === this.getCid()) {
                        commentsRect.baseState = newBaseState;
                    }
                    newCommentsRectList = newCommentsRectList.add(commentsRect);
                }
            );

            comments.setCustomState({
                commentsRectList: newCommentsRectList
            });
        }
    }
}
