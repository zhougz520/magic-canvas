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
    ICommentsList
} from '../BaseComponent';
import { IReactData, IBaseData } from '../Draw';
import { IComponentList, CommandMap } from '../Canvas';
import { IContextMenuItems } from '../Stage';

import { CommentsState } from './CommentsState';
import { CommentsRectState, ICommentsRectState } from './CommentsRectState';

import { OrderedSet, List } from 'immutable';
import { Menu, Dropdown } from 'antd';

export interface ICommentsRectProps extends IBaseProps {
    color: string;
}

/* tslint:disable:jsx-wrap-multiline */
export class CommentsRect extends BaseComponent<ICommentsRectProps, IBaseState> {
    constructor(props: ICommentsRectProps, context?: any) {
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
        const { pageMode } = this.props;
        const commentsRectCustomState: CommentsRectState = this.getCustomState();
        const userType = commentsRectCustomState.getUserType();

        switch (pageMode) {
            case 'Edit':
                return true;
            case 'Guest':
                if (userType === 'Guest') {
                    return true;
                } else {
                    return false;
                }
            case 'Run':
                return true;
        }
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

    componentDidUpdate(prevProps: ICommentsRectProps, prevState: IBaseState) {
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

    componentWillUnmount() {
        const commentsCid: string = this.getCid().split('.')[0];
        const comments = this.props.getComponent(commentsCid);

        if (comments) {
            const commentsRectCustomState: CommentsRectState = this.getCustomState();
            const comCid: string | null = commentsRectCustomState.getCid();
            if (comCid) {
                const component: IComponent | null = this.props.getComponent(comCid);
                if (component) {
                    let commentsRectList: List<ICommentsList> = component.getCommentsList();
                    commentsRectList.map(
                        (commentsRect: ICommentsList, key: number) => {
                            if (this.getCid() === commentsRect.cid) {
                                commentsRectList = commentsRectList.delete(key);
                            }
                        }
                    );
                    component.setCommentsList(commentsRectList);
                }
            }
        }
    }

    render() {
        const { pageMode, color } = this.props;
        const size: ISize = this.getSize();
        const position: IPosition = this.getPosition();
        const guestContextMenu: JSX.Element = this.buildGuestContextMenu();

        return (
            pageMode === 'Guest' ?
                <Dropdown overlay={guestContextMenu} trigger={['contextMenu']}>
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
                        stroke={color}
                        strokeWidth="1"
                        pointerEvents={this.isCanSelected() ? 'auto' : 'none'}
                        onMouseDown={this.fireSelectChange}
                    />
                </Dropdown> :
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
                    stroke={color}
                    strokeWidth="1"
                    pointerEvents={this.isCanSelected() ? 'auto' : 'none'}
                    onMouseDown={this.fireSelectChange}
                />
        );
    }

    /**
     * 构建访客模式右键菜单
     */
    private buildGuestContextMenu = (): JSX.Element => {
        return (
            <Menu onClick={this.handleGuestContextMenuClick}>
                <Menu.Item key="deleteCommentsRect">删除</Menu.Item>
            </Menu>
        );
    }

    /**
     * 访客菜单点击
     */
    private handleGuestContextMenuClick = (e: any) => {
        switch (e.key) {
            case 'deleteCommentsRect':
                this.props.executeCommand({
                    t: CommandMap.COMMENTSRECT_DELETE,
                    d: this.getCid()
                });
                break;
        }
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
