import * as React from 'react';
import {
    BaseState,
    ContentState,
    BaseStyle,
    IPosition,
    IComData,
    IComponent,
    ISize,
    IRichEditOption,
    IFont,
    PositionState,
    SizeState
} from '../../BaseComponent';
import {
    BaseUniversalComponent,
    IBaseUniversalComponentProps,
    IBaseUniversalComponentState
} from '../BaseUniversalComponent';
import { IContextMenuItems } from '../../Stage';
import { Canvas, CommandMap, IComponentList, IOffset, convertFromBaseStateToData, convertFromDataToBaseState } from '../../Canvas';

import { ImageMagnifier } from './ImageMagnifier';
import { ImageMagnifierState } from './ImageMagnifierState';
import { ImageState, IImageState, dataUrl } from './ImageState';
import { ImageLine, IImageLineProps } from './ImageLine';
import { IToolButtonGroup, emptyButtonGroup, PropertiesEnum, IPropertyGroup, IProperty } from '../model/types';

import { getPluginConfig, PluginMap } from '../../../plugin';
import { OrderedSet, Map, List } from 'immutable';

/* tslint:disable:jsx-no-string-ref jsx-no-lambda jsx-no-multiline-js */
export default class Image extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    private _padding: number = 8;
    private _willUnmount: boolean = false;

    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ImageState(), '图片'),
            hidden: false
        };
    }

    /**
     * 设置组件Position
     * 注意：设置结束后请手动调用setUndoStack方法增加撤销栈
     * @param position IPosition类型的对象{left: 10, right: 10, top: 10, bottom: 10}
     */
    public setPosition = (position: IPosition): void => {
        const oldPositionState: PositionState = this.getPositionState();
        const newPositionState: PositionState = PositionState.create(position);

        this.setPositionState(
            newPositionState,
            () => {
                this.updateCommentsList(oldPositionState);
                this.updateImageMagnifierList(oldPositionState);
            }
        );
    }

    /**
     * 获取富文本编辑器的大小和位置
     */
    public getRichEditOption = (): IRichEditOption => {
        const comPosition: IPosition = this.getPosition();
        const comSize: ISize = this.getSize();

        const position: IPosition = {
            top: comPosition.top + 7,
            left: comPosition.left + this._padding
        };
        const size: ISize = {
            width: comSize.width - this._padding,
            height: 16
        };
        const font: IFont = {
            textAlign: 'left',
            fontColor: 'rgba(0, 0, 0, 0.65)',
            fontStyle: 'normal',
            fontSize: 14,
            fontWeight: 'normal',
            textDecoration: 'none'
        };

        return { position, size, font };
    }

    /**
     * 获取组件富文本内容
     * 返回：带格式的富文本内容
     */
    public getRichChildNode = (): any => {
        const baseState: BaseState = this.getBaseState();

        return baseState.getCurrentContent().getRichChildNode();
    }

    /**
     * 设置组件文本内容
     */
    public setRichChildNode = (param: any): void => {
        const oldBaseState: BaseState = this.getBaseState();
        const newContent: ContentState = oldBaseState.getCurrentContent().merge({
            richChildNode: param.value
        }) as ContentState;
        const newBaseState = BaseState.push(oldBaseState, newContent);

        this.setState({
            baseState: newBaseState
        }, () => this.callBackForRender('Rich'));
    }

    /**
     * 获取组件的字体属性，传给工具栏
     * 默认：空，组件自己重写
     */
    public getFontPropsToTool = (): IToolButtonGroup => {
        return emptyButtonGroup;
    }

    /**
     * 工具栏设置字体样式
     * @param fontStyleType 字体类型
     * @param value 值
     * @param key 循环的键
     */
    public setFontPropsFromTool = (fontStyleType: string, value: any, key: number) => {
        return;
    }

    /**
     * 获取组件的右键菜单
     * 默认：空，组件自己重写
     */
    public getContextMenuItems = (): IContextMenuItems[] => {
        return [
            {
                type: 'menu',
                label: '添加放大镜',
                click: () => {
                    this.props.executeCommand({
                        t: CommandMap.MAGNIFIER_ADD,
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

    /**
     * 获取组件属性列表
     */
    public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
        let propertyList: List<IProperty> = List();
        let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();

        // 外观
        propertyList = propertyList.push(
            { pTitle: '显示标题', pKey: 'showHeader', pValue: this.getCustomState().getShowHeader(), pType: PropertiesEnum.SWITCH }
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
        const newImageState: ImageState = ImageState.set(this.getCustomState(), properties);
        if (pKey === 'showHeader') {
            if (pValue === true) {
                callback = () => { this.setSize({ width: this.getSize().width, height: this.getSize().height + 30 }); };
            } else {
                callback = () => { this.setSize({ width: this.getSize().width, height: this.getSize().height - 30 }); };
            }
        }

        this.setCustomState(newImageState, true, callback);
    }

    componentDidMount() {
        const uid = (this.getCustomState() as ImageState).getUid();
        if (uid === undefined || uid === null || uid.length === 0) return;

        const loadFunc = getPluginConfig(PluginMap.IMAGE_ASYNC_LOAD_FUNC);
        if (loadFunc) {
            loadFunc(uid)
                .then((ret: any) => {
                    const src = ret.src;
                    const newImageState: ImageState = ImageState.set(this.getCustomState(), Map({ src }));

                    const oldBaseState: BaseState = this.getBaseState();
                    const newContent: ContentState = oldBaseState.getCurrentContent().merge({
                        customState: newImageState
                    }) as ContentState;
                    const newBaseState = BaseState.set(oldBaseState, {
                        currentContent: newContent
                    });

                    if (this._willUnmount === false) {
                        this.setBaseState(newBaseState);
                    } else {
                        this._willUnmount = false;
                    }
                })
                .catch((err: any) => {
                    // nothing
                });
        }
    }

    componentWillUnmount() {
        this._willUnmount = true;
    }

    render() {
        const { hidden } = this.state;
        const imageMagnifierList: OrderedSet<IComponentList> = this.getCustomState().getImageMagnifierList();
        const magnifierList: JSX.Element[] = this.buildMagnifier(imageMagnifierList);
        const lineList: JSX.Element[] = this.buildLine(imageMagnifierList);
        const comSize: ISize = this.getSize();
        const showHeader: boolean = this.getCustomState().getShowHeader();
        const headerHeight: number = showHeader ? 30 : 0;

        return (
            <React.Fragment>
                <div
                    style={{
                        ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), true, this.isCanSelected()),
                        borderColor: '#d3d5d9',
                        backgroundColor: '#fff'
                    }}
                    onMouseDown={this.fireSelectChange}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '30px',
                            backgroundColor: '#f0f0ff',
                            borderBottom: '1px solid #d3d5d9',
                            lineHeight: '30px',
                            paddingLeft: '8px',
                            display: showHeader ? 'block' : 'none'
                        }}
                        onDoubleClick={this.doDbClickToEdit}
                    >
                        {hidden ? '' : this.getRichChildNode()}
                    </div>
                    <div
                        style={{
                            pointerEvents: 'auto',
                            position: 'absolute',
                            zIndex: 1000,
                            width: comSize.width,
                            height: comSize.height - headerHeight
                        }}
                    />
                    <img
                        style={{
                            width: comSize.width - 22,
                            height: comSize.height - 22 - headerHeight,
                            display: 'inline-block',
                            margin: '10px'
                        }}
                        src={this.getCustomState().getSrc()}
                    />
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="100%"
                    height="100%"
                    pointerEvents="none"
                    style={{ position: 'absolute', zIndex: this.getHierarchy() }}
                >
                    {lineList}
                </svg>
                <div
                    style={{
                        pointerEvents: 'none',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        zIndex: this.getHierarchy()
                    }}
                >
                    {magnifierList}
                </div>
            </React.Fragment>
        );
    }

    /**
     * 构建图片放大镜
     */
    private buildMagnifier = (imageMagnifierList: OrderedSet<IComponentList>): JSX.Element[] => {
        const magnifierList: JSX.Element[] = [];
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
            userInfo,
            scale
        } = this.props;

        if (imageMagnifierList) {
            imageMagnifierList.map(
                (imageMagnifier: IComponentList) => {
                    magnifierList.push(
                        <ImageMagnifier
                            key={imageMagnifier.cid}
                            ref={`c.${imageMagnifier.cid}`}
                            pageMode={pageMode}
                            childData={imageMagnifier.childData}
                            baseState={imageMagnifier.baseState}
                            comPath={imageMagnifier.comPath}
                            initType={imageMagnifier.initType}
                            componentPosition={componentPosition}
                            scale={scale}
                            repaintSelected={repaintSelected}
                            repaintCanvas={repaintCanvas}
                            selectionChanging={selectionChanging}
                            getComponent={getComponent}
                            executeCommand={executeCommand}
                            resetMaxAndMinZIndex={resetMaxAndMinZIndex}
                            setCanvasUndoStack={setCanvasUndoStack}
                            userInfo={userInfo}
                            src={this.getCustomState().getSrc()}
                        />
                    );
                }
            );
        }

        return magnifierList;
    }

    /**
     * 构建连接线
     */
    private buildLine = (imageMagnifierList: OrderedSet<IComponentList>): JSX.Element[] => {
        const lineList: JSX.Element[] = [];

        if (imageMagnifierList) {
            imageMagnifierList.map(
                (imageMagnifier: IComponentList) => {
                    const imageLine: IImageLineProps = this.buildLineProps(this.getBaseState(), imageMagnifier.baseState);
                    lineList.push(
                        <ImageLine
                            key={imageMagnifier.cid}
                            x1={imageLine.x1}
                            y1={imageLine.y1}
                            x2={imageLine.x2}
                            y2={imageLine.y2}
                            rectSize={imageLine.rectSize}
                            rectPosition={imageLine.rectPosition}
                        />
                    );
                }
            );
        }

        return lineList;
    }

    /**
     * 构建连接线参数
     */
    private buildLineProps = (imageBaseState: BaseState, imageMagnifierBaseState: BaseState): IImageLineProps => {
        const imagePositionState: PositionState = imageBaseState.getCurrentContent().getPositionState();
        const imageMagnifierPositionState: PositionState = imageMagnifierBaseState.getCurrentContent().getPositionState();
        const imageMagnifierSizeState: SizeState = imageMagnifierBaseState.getCurrentContent().getSizeState();
        const imageMagnifierCustomState: ImageMagnifierState = imageMagnifierBaseState.getCurrentContent().getCustomState();
        const rectSize: ISize = imageMagnifierCustomState.getRectSize();
        const rectPosition: IPosition = imageMagnifierCustomState.getRectPosition();

        const showHeader: boolean = this.getCustomState().getShowHeader();
        const headerHeight: number = showHeader ? 30 : 0;

        return {
            x1: Math.ceil(imageMagnifierPositionState.getLeft() + imageMagnifierSizeState.getWidth() / 2),
            y1: imageMagnifierPositionState.getTop(),
            x2: Math.ceil(imagePositionState.getLeft() + 11 + rectPosition.left + rectSize.width / 2),
            y2: imagePositionState.getTop() + 11 + headerHeight + rectPosition.top + rectSize.height,
            rectSize,
            rectPosition: { top: imagePositionState.getTop() + 11 + headerHeight + rectPosition.top, left: imagePositionState.getLeft() + 11 + rectPosition.left }
        };
    }

    /**
     * 更新放大镜列表
     */
    private updateImageMagnifierList = (prevPositionState: PositionState) => {
        // 如果有放大镜，更新放大镜的位置
        const imageMagnifierList: OrderedSet<IComponentList> = this.getCustomState().getImageMagnifierList();
        const componentPosition: IPosition = this.getPosition();
        imageMagnifierList.map(
            (imageMagnifier: IComponentList) => {
                const componentMagnifier: IComponent | null = this.props.getComponent(imageMagnifier.cid);
                if (componentMagnifier !== null) {
                    const imageMagnifierPosition: IPosition = componentMagnifier.getPosition();
                    const relativePosition: IPosition = {
                        top: imageMagnifierPosition.top - prevPositionState.getTop(),
                        left: imageMagnifierPosition.left - prevPositionState.getLeft()
                    };

                    const newImageMagnifierPosition: IPosition = {
                        top: componentPosition.top + relativePosition.top,
                        left: componentPosition.left + relativePosition.left
                    };
                    componentMagnifier.setPosition(newImageMagnifierPosition);
                }
            }
        );
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
    const encodeCustomState: ImageState = customState;
    const imageMagnifierList: OrderedSet<IComponentList> = encodeCustomState.getImageMagnifierList();
    imageMagnifierList.map(
        (imageMagnifier: IComponentList) => {
            components.push(
                convertFromBaseStateToData(
                    imageMagnifier.baseState,
                    {
                        comPath: imageMagnifier.comPath,
                        childData: imageMagnifier.childData
                    },
                    offset
                )
            );
        }
    );

    return {
        src: encodeCustomState.getUid() === '' ? encodeCustomState.getSrc() : '',
        uid: encodeCustomState.getUid(),
        width: encodeCustomState.getWidth(),
        height: encodeCustomState.getHeight(),
        imageMagnifierList: components,
        maxMagnifierId: encodeCustomState.getMaxMagnifierId(),
        backgroundColor: encodeCustomState.getBackgroundColor(),
        borderColor: encodeCustomState.getBorderColor(),
        borderWidth: encodeCustomState.getBorderWidth(),
        showHeader: encodeCustomState.getShowHeader()
    };
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ICommentsState | null | Map
 */
export function convertFromDataToCustomState(
    customData: {
        src: string;
        uid?: string;
        width: number;
        height: number;
        imageMagnifierList: Array<{
            t: string;
            p: IComData;
        }>;
        maxMagnifierId: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        showHeader: boolean;
    } | any
): any {
    const data: IImageState = {
        src: '',
        uid: '',
        width: 0,
        height: 0,
        imageMagnifierList: OrderedSet(),
        maxMagnifierId: 0,
        backgroundColor: '#FFF',
        borderColor: '#FFF',
        borderWidth: 0,
        showHeader: true
    };
    if (customData && customData.imageMagnifierList) {
        customData.imageMagnifierList.map(
            (imageMagnifier: any) => {
                const baseState: BaseState = convertFromDataToBaseState(imageMagnifier.p, imageMagnifier.t);

                data.imageMagnifierList = data.imageMagnifierList.add({
                    cid: imageMagnifier.p.id,
                    comPath: imageMagnifier.t,
                    baseState,
                    childData: imageMagnifier.p.p,
                    initType: 'Init'
                });
            }
        );

        data.uid = customData.uid === undefined ? '' : customData.uid;
        const src: string = dataUrl;
        data.src = data.uid === '' ? customData.src : src;
        data.width = customData.width;
        data.height = customData.height;
        data.maxMagnifierId = customData.maxMagnifierId;
        data.backgroundColor = customData.backgroundColor;
        data.borderColor = customData.borderColor;
        data.borderWidth = customData.borderWidth;
        customData.showHeader !== undefined && (data.showHeader = customData.showHeader);
    }

    return ImageState.create(data);
}

export function getPasteCustomState(canvas: Canvas, customData: any): any {
    customData.imageMagnifierList = OrderedSet();
    customData.maxMagnifierId = 0;

    return customData;
}
