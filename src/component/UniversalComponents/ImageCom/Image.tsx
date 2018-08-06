import * as React from 'react';
import {
    BaseState,
    ContentState,
    BaseStyle,
    IPosition,
    MaskLayer,
    IComData,
    IComponent,
    ISize,
    IRichEditOption,
    IFont
} from '../../BaseComponent';
import {
    BaseUniversalComponent,
    IBaseUniversalComponentProps,
    IBaseUniversalComponentState
} from '../BaseUniversalComponent';
import { IContextMenuItems } from '../../Stage';
import { CommandMap, IComponentList, convertFromBaseStateToData, convertFromDataToBaseState } from '../../Canvas';

import { ImageMagnifier } from './ImageMagnifier';
import { ImageState, IImageState } from './ImageState';
import { IToolButtonGroup, emptyButtonGroup } from '../model/types';

import { OrderedSet } from 'immutable';

/* tslint:disable:jsx-no-string-ref jsx-no-lambda jsx-no-multiline-js */
export default class Image extends BaseUniversalComponent<IBaseUniversalComponentProps, IBaseUniversalComponentState> {
    private _padding: number = 8;

    constructor(props: IBaseUniversalComponentProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ImageState(), '图片'),
            hidden: false
        };
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
            }
        ];
    }

    componentDidUpdate(prevProps: IBaseUniversalComponentProps, prevState: IBaseUniversalComponentState) {
        // 1.更新批注框
        this.updateCommentsList(prevState);
        // 2.更新图片放大镜
        this.updateImageMagnifierList(prevState);
    }

    render() {
        const { hidden } = this.state;
        const imageMagnifierList: OrderedSet<IComponentList> = this.getCustomState().getImageMagnifierList();
        const magnifierList: JSX.Element[] = this.buildMagnifier(imageMagnifierList);
        const comSize: ISize = this.getSize();

        return (
            <React.Fragment>
                <div
                    style={{
                        ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false, this.isCanSelected()),
                        border: '1px solid #d3d5d9'
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
                            paddingLeft: '8px'
                        }}
                        onDoubleClick={this.doDbClickToEdit}
                    >
                        {hidden ? '' : this.getRichChildNode()}
                    </div>
                    <MaskLayer id={this.getCid()} isCanSelected={this.isCanSelected()} />
                    <img
                        style={{
                            width: comSize.width - 22,
                            height: comSize.height - 52,
                            display: 'inline-block',
                            margin: '10px'
                        }}
                        src={this.getCustomState().getSrc()}
                    />
                </div>
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
            userInfo
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
                            repaintSelected={repaintSelected}
                            repaintCanvas={repaintCanvas}
                            selectionChanging={selectionChanging}
                            getComponent={getComponent}
                            executeCommand={executeCommand}
                            resetMaxAndMinZIndex={resetMaxAndMinZIndex}
                            setCanvasUndoStack={setCanvasUndoStack}
                            userInfo={userInfo}
                        />
                    );
                }
            );
        }

        return magnifierList;
    }

    /**
     * 更新放大镜列表
     */
    private updateImageMagnifierList = (prevState: IBaseUniversalComponentState) => {
        const currentContent: ContentState = this.state.baseState.getCurrentContent();
        const prevContent: ContentState = prevState.baseState.getCurrentContent();

        if (
            currentContent.getPositionState().equals(prevContent.getPositionState()) === false
        ) {
            // 如果有批注，更新批注的位置
            const imageMagnifierList: OrderedSet<IComponentList> = this.getCustomState().getImageMagnifierList();
            const componentPosition: IPosition = this.getPosition();
            imageMagnifierList.map(
                (imageMagnifier: IComponentList) => {
                    const componentMagnifier: IComponent | null = this.props.getComponent(imageMagnifier.cid);
                    if (componentMagnifier !== null) {
                        const imageMagnifierPosition: IPosition = componentMagnifier.getPosition();
                        const relativePosition: IPosition = {
                            top: imageMagnifierPosition.top - prevContent.getPositionState().getTop(),
                            left: imageMagnifierPosition.left - prevContent.getPositionState().getLeft()
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
}

/**
 * 批注把customState转成需要保存的data
 * @param customState 批注的customState
 */
export function convertFromCustomStateToData(customState: any): any {
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
                    }
                )
            );
        }
    );

    return {
        src: encodeCustomState.getSrc(),
        width: encodeCustomState.getWidth(),
        height: encodeCustomState.getHeight(),
        imageMagnifierList: components,
        maxMagnifierId: encodeCustomState.getMaxMagnifierId(),
        backgroundColor: encodeCustomState.getBackgroundColor(),
        borderColor: encodeCustomState.getBorderColor(),
        borderWidth: encodeCustomState.getBorderWidth()
    };
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ICommentsState | null | Map
 */
export function convertFromDataToCustomState(
    customData: {
        src: string;
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
    } | any
): any {
    const data: IImageState = {
        src: '',
        width: 0,
        height: 0,
        imageMagnifierList: OrderedSet(),
        maxMagnifierId: 0,
        backgroundColor: '#FFF',
        borderColor: '#FFF',
        borderWidth: 0
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

        data.src = customData.src;
        data.width = customData.width;
        data.height = customData.height;
        data.maxMagnifierId = customData.maxMagnifierId;
        data.backgroundColor = customData.backgroundColor;
        data.borderColor = customData.borderColor;
        data.borderWidth = customData.borderWidth;
    }

    return ImageState.create(data);
}

export function getPasteCustomState(customData: any): any {
    customData.imageMagnifierList = OrderedSet();
    customData.maxMagnifierId = 0;

    return customData;
}
