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
    IFont
} from '../BaseComponent';
import { Canvas, IComponentList, IOffset, convertFromBaseStateToData, convertFromDataToBaseState, CommandMap } from '../Canvas';
import { IContextMenuItems } from '../Stage';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../UniversalComponents';
import { CommentsRect } from './CommentsRect';
import { CommentsLine, ICommentsLineProps } from './CommentsLine';
import { CommentsState, ICommentsState } from './CommentsState';
import { Template } from './Template';
import { getPluginConfig, PluginMap } from '../../plugin';

import { GlobalUtil } from '../util';
import { blockStyleFn } from '../RichEdit';
import { DraftPublic } from 'xprst-draft';
const { Editor, EditorState, InlineUtils, convertFromDraftStateToRaw, convertFromRawToDraftState } = DraftPublic;

import { Menu, Dropdown, Icon } from 'antd';
import { OrderedSet, List, Map } from 'immutable';
import * as Color from 'color';
import './sass/Comments.scss';
// tslint:disable-next-line:no-var-requires
const clone = require('clone');

export interface ICommentsBaseState extends IBaseState {
    hidden: boolean;
    hover: boolean;
}

/* tslint:disable:jsx-no-string-ref jsx-no-lambda jsx-no-multiline-js */
export default class Comments extends BaseComponent<IBaseProps, ICommentsBaseState> {
    private _padding: number = 8;

    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        const { pageMode, userInfo } = this.props;
        let author: string = '作者';
        let authorId: string = '';
        let userType: 'Master' | 'Guest' = 'Master';
        let backgroundColor: string = '#FFFBBA';

        switch (pageMode) {
            case 'Edit':
            case 'Run':
                if (userInfo) {
                    author = userInfo.userName;
                    authorId = userInfo.userId;
                }
                break;
            case 'Guest':
                const guestUserName = GlobalUtil.getCookie('pdu_GuestUserName');
                author = guestUserName === '' ? '访客' : guestUserName;
                authorId = '';
                userType = 'Guest';
                backgroundColor = '#B8E986';
                break;
        }
        this.state = {
            baseState: this.initBaseStateWithCustomState(
                new CommentsState({ author, authorId, userType, backgroundColor }),
                EditorState.createEmpty('需求' + this.props.baseState.getCurrentContent().getCid().replace('cm', '') + '：\n')
            ),
            hidden: false,
            hover: false
        };
    }

    /**
     * 加载模版
     * @param template 模版
     */
    public initTemplate = (template: string) => {
        const richChildData: any = clone((Template as any)[template]);
        if (richChildData) {
            if (richChildData.blocks && richChildData.blocks instanceof Array) {
                const title: string = '需求' + this.props.baseState.getCurrentContent().getCid().replace('cm', '') + '：';
                const titleObj = {
                    data: {},
                    depth: 0,
                    inlineStyleRanges: [],
                    key: '',
                    text: title,
                    type: 'unstyled'
                };
                richChildData.blocks.unshift(titleObj);
            }
            const contentState: any = convertFromRawToDraftState(richChildData);
            const editorState: any = EditorState.createWithContent(contentState);
            this.setRichChildNode(editorState);
        }
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
    public isCanDbClickToEdit = (): boolean => {
        const { pageMode } = this.props;
        const commentsCustomState: CommentsState = this.getCustomState();
        const userType = commentsCustomState.getUserType();

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
                return false;
        }
    }

    /**
     * 重写Base方法，是否可以选中
     */
    public isCanSelected = (): boolean => {
        const { pageMode } = this.props;
        const commentsCustomState: CommentsState = this.getCustomState();
        const userType = commentsCustomState.getUserType();

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
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 外观
        propertyList = propertyList.push(
            { pTitle: '背景颜色', pKey: 'backgroundColor', pValue: this.getCustomState().getBackgroundColor(), pType: PropertiesEnum.COLOR_PICKER }
        );
        propertyGroup = propertyGroup.add(
            { groupTitle: '外观', groupKey: 'exterior', isActive: true, colNum: 1, propertyList }
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

        this.setCustomState(newCommentsState, true, callback);
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
            },
            {
                type: 'separator'
            },
            ...this.defaultContextMenuItems
        ];
    }

    render() {
        const { pageMode } = this.props;
        const { hidden, hover } = this.state;
        const commentsCustomState: CommentsState = this.getCustomState();
        const commentsRectList: OrderedSet<IComponentList> = commentsCustomState.getCommentsRectList();
        const rectList: JSX.Element[] = this.buildRect(commentsRectList);
        const guestContextMenu: JSX.Element = this.buildGuestContextMenu();

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
                {
                    pageMode === 'Guest' ?
                        <Dropdown overlay={guestContextMenu} trigger={['contextMenu']}>
                            <div
                                className="comments"
                                onMouseDown={this.fireSelectChange}
                                onDoubleClick={this.doDbClickToEdit}
                                style={{
                                    ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false, this.isCanSelected()),
                                    backgroundColor: commentsCustomState.getBackgroundColor()
                                }}
                            >
                                {/* <MaskLayer id={this.getCid()} pageMode={this.props.pageMode} isCanSelected={this.isCanSelected()} /> */}
                                <div style={{ width: '100%', height: '24px', lineHeight: '24px', paddingLeft: this._padding, fontWeight: 'bold', fontSize: '12px' }}>
                                    {commentsCustomState.getAuthor()}：
                                </div>
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
                        </Dropdown> :
                        <div
                            className="comments"
                            onMouseDown={this.fireSelectChange}
                            onDoubleClick={this.doDbClickToEdit}
                            style={{
                                ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false, this.isCanSelected()),
                                backgroundColor: commentsCustomState.getBackgroundColor()
                            }}
                            onMouseEnter={() => { this.setState({ hover: true }); }}
                            onMouseLeave={() => { this.setState({ hover: false }); }}
                        >
                            {/* <MaskLayer id={this.getCid()} pageMode={this.props.pageMode} isCanSelected={this.isCanSelected()} /> */}
                            <div style={{ width: '100%', height: '24px', lineHeight: '24px', paddingLeft: this._padding, fontWeight: 'bold', fontSize: '12px' }}>
                                {commentsCustomState.getAuthor()}：
                                {hover === true ? <Icon type="setting" className="setting" onClick={this.initCommentsTemplate} /> : ''}
                            </div>
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
                }
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
            executeCommand,
            userInfo
        } = this.props;

        if (commentsRectList) {
            commentsRectList.map(
                (commentsRect: IComponentList) => {
                    const commentsLine: ICommentsLineProps = this.buildLineProps(this.getBaseState(), commentsRect.baseState, { x: -2, y: 20 });
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
                                userInfo={userInfo}
                                color={commentsLine.color}
                            />
                            <CommentsLine
                                x1={commentsLine.x1}
                                y1={commentsLine.y1}
                                x2={commentsLine.x2}
                                y2={commentsLine.y2}
                                color={commentsLine.color}
                            />
                        </g>
                    );
                }
            );
        }

        return rectList;
    }

    /**
     * 构建连接线参数
     */
    private buildLineProps = (commentsBaseState: BaseState, rectBaseState: BaseState, offset: IOffset): ICommentsLineProps => {
        const commentsPositionState: PositionState = commentsBaseState.getCurrentContent().getPositionState();
        const rectPositionState: PositionState = rectBaseState.getCurrentContent().getPositionState();
        const rectSizeState: SizeState = rectBaseState.getCurrentContent().getSizeState();
        const commentsCustomState: CommentsState = this.getCustomState();
        const color = Color(commentsCustomState.getBackgroundColor()).darken(0.5).rgb().round();

        return {
            x1: commentsPositionState.getLeft() + offset.x,
            y1: commentsPositionState.getTop() + offset.y,
            x2: rectPositionState.getLeft() + rectSizeState.getWidth(),
            y2: rectPositionState.getTop(),
            color: `rgba(${color.red()}, ${color.green()}, ${color.blue()}, ${color.alpha()})`
        };
    }

    /**
     * 构建访客模式右键菜单
     */
    private buildGuestContextMenu = (): JSX.Element => {
        return (
            <Menu onClick={this.handleGuestContextMenuClick}>
                <Menu.Item key="addCommentsRect">添加锚点</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="deleteComments">删除</Menu.Item>
            </Menu>
        );
    }

    /**
     * 访客菜单点击
     */
    private handleGuestContextMenuClick = (e: any) => {
        const { executeCommand } = this.props;
        switch (e.key) {
            case 'addCommentsRect':
                executeCommand({
                    t: CommandMap.COMMENTSRECT_ADD,
                    d: this.getCid()
                });
                break;
            case 'deleteComments':
                executeCommand({
                    t: CommandMap.COM_DELETE
                });
                break;
        }
    }

    /**
     * 调用模版窗口
     */
    private initCommentsTemplate = () => {
        const templateFunc = getPluginConfig(PluginMap.INIT_COMMENTSTEMPLATE_FUNC);
        if (templateFunc) {
            templateFunc(this.getCid());
        }
    }
}

/**
 * 批注把customState转成需要保存的data
 * @param customState 批注的customState
 */
export function convertFromCustomStateToData(
    customState: any,
    offset: IOffset = { x: 0, y: 0 }
): any {
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
                    },
                    offset
                )
            );
        }
    );

    return {
        author: encodeCustomState.getAuthor(),
        authorId: encodeCustomState.getAuthorId(),
        userType: encodeCustomState.getUserType(),
        commentsRectList: components,
        maxRectId: encodeCustomState.getMaxRectId(),
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
        authorId: string;
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
        author: '作者',
        authorId: '',
        userType: 'Master',
        commentsRectList: OrderedSet(),
        maxRectId: 0,
        backgroundColor: '#FFFBBA'
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
        data.authorId = customData.authorId;
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
export function getPasteCustomState(canvas: Canvas, customData: any): any {
    const { pageMode, userInfo } = canvas.props;
    let author: string = '作者';
    let authorId: string = '';
    let userType: 'Master' | 'Guest' = 'Master';

    switch (pageMode) {
        case 'Edit':
        case 'Run':
            if (userInfo) {
                author = userInfo.userName;
                authorId = userInfo.userId;
            }
            break;
        case 'Guest':
            const guestUserName = GlobalUtil.getCookie('pdu_GuestUserName');
            author = guestUserName === '' ? '访客' : guestUserName;
            authorId = '';
            userType = 'Guest';
            break;
    }

    customData.author = author;
    customData.authorId = authorId;
    customData.userType = userType;
    customData.commentsRectList = OrderedSet();
    customData.maxRectId = 0;

    return customData;
}
