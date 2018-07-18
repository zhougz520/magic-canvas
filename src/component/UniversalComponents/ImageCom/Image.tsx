import * as React from 'react';
import {
    BaseState,
    ContentState,
    BaseComponent,
    BaseStyle,
    IBaseProps,
    IBaseState,
    IPosition,
    MaskLayer,
    IComData,
    IComponent
} from '../../BaseComponent';
import { IContextMenuItems } from '../../Stage';
import { CommandMap, IComponentList, convertFromBaseStateToData, convertFromDataToBaseState } from '../../Canvas';

import { ImageMagnifier } from './ImageMagnifier';
import { ImageState, IImageState } from './ImageState';
import { PropertiesEnum, IPropertyGroup, IProperty } from '../model/types';

import { Map, OrderedSet, List } from 'immutable';

/* tslint:disable:jsx-no-string-ref jsx-no-lambda jsx-no-multiline-js */
export default class Image extends BaseComponent<IBaseProps, IBaseState> {
    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ImageState())
        };
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
                pTitle: '边框颜色',
                pKey: 'borderColor',
                pValue: this.getCustomState().getBorderColor(),
                pType: PropertiesEnum.COLOR_PICKER
            },
            {
                pTitle: '边框宽度',
                pKey: 'borderWidth',
                pValue: this.getCustomState().getBorderWidth(),
                pType: PropertiesEnum.SLIDER
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
        const newImageState: ImageState = ImageState.set(this.getCustomState(), properties);

        this.setCustomState(newImageState, true, callback);
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

    componentDidUpdate(prevProps: IBaseProps, prevState: IBaseState) {
        // 1.更新批注框
        this.updateCommentsList(prevState);
        // 2.更新图片放大镜
        this.updateImageMagnifierList(prevState);
    }

    render() {
        const imageMagnifierList: OrderedSet<IComponentList> = this.getCustomState().getImageMagnifierList();
        const magnifierList: JSX.Element[] = this.buildMagnifier(imageMagnifierList);

        return (
            <React.Fragment>
                <div
                    style={{
                        ...BaseStyle(this.getPositionState(), this.getSizeState(), this.getHierarchy(), false),
                        backgroundColor: this.getCustomState().getBackgroundColor(),
                        borderColor: this.getCustomState().getBorderColor(),
                        borderWidth: this.getCustomState().getBorderWidth(),
                        borderStyle: 'solid'
                    }}
                    onMouseDown={this.fireSelectChange}
                >
                    <MaskLayer id={this.getCid()} />
                    <img
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'inline-block'
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
            executeCommand
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
    private updateImageMagnifierList = (prevState: IBaseState) => {
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
