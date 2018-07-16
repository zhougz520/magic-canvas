import * as React from 'react';
import { ContentState, BaseComponent, IBaseProps, IBaseState, MaskLayer } from '../../BaseComponent';
import { IComponentList, CommandMap } from '../../Canvas';
import { IReactData } from '../../Draw';
import { IContextMenuItems } from '../../Stage';

import { ImageState } from './ImageState';
import { ImageMagnifierState, IImageMagnifierState } from './ImageMagnifierState';

import { OrderedSet } from 'immutable';

// tslint:disable:jsx-no-multiline-js
export class ImageMagnifier extends BaseComponent<IBaseProps, IBaseState> {

    constructor(props: IBaseProps, context?: any) {
        super(props, context);

        this.state = {
            baseState: this.initBaseStateWithCustomState(new ImageMagnifierState())
        };
    }

    public getType(): string {
        return 'none';
    }

    /**
     * 选中框属性
     * 组件可以重写
     */
    public selectedFrameData = (): IReactData => {
        return {
            pointX: this.getPosition().left + this.props.componentPosition.canvasOffset.left - 1,
            pointY: this.getPosition().top + this.props.componentPosition.canvasOffset.top - 1,
            width: this.getSize().width + 3,
            height: this.getSize().height + 3,
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
                        t: CommandMap.MAGNIFIER_DELETE,
                        d: this.getCid()
                    });
                }
            }
        ];
    }

    componentDidUpdate(prevProps: IBaseProps, prevState: IBaseState) {
        this.updateImageCustomState(prevState);
    }

    render() {
        const { width, height } = this.getSize();
        const { top, left } = this.getPosition();

        return (
            <div
                style={{
                    background: '#f6f7f8',
                    position: 'absolute',
                    pointerEvents: 'all',
                    boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.2)',
                    borderRadius: '3px',
                    top,
                    left,
                    width,
                    height
                }}
                onMouseDown={this.fireSelectChange}
            >
                <MaskLayer id={this.getCid()} />
                <div
                    style={{
                        position: 'absolute',
                        pointerEvents: 'all',
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                        borderRadius: '3px',
                        width: width - 8,
                        height: height - 8,
                        margin: 4,
                        backgroundImage: `url("${this.getCustomState().getSrc()}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: `${this.getCustomState().getBackgroundPositionX()}px ${this.getCustomState().getBackgroundPositionY()}px`
                    }}
                />
            </div>
        );
    }

    private updateImageCustomState = (prevState: IBaseState) => {
        const currentContent: ContentState = this.state.baseState.getCurrentContent();
        const prevContent: ContentState = prevState.baseState.getCurrentContent();

        if (
            currentContent.getPositionState().equals(prevContent.getPositionState()) === false ||
            currentContent.getSizeState().equals(prevContent.getSizeState()) === false
        ) {
            const imageCid: string = this.getCustomState().getCid();
            const image = this.props.getComponent(imageCid);
            if (image) {
                const imageCustomState: ImageState = image.getCustomState();
                const oldImageMagnifierList: OrderedSet<IComponentList> = imageCustomState.getImageMagnifierList();
                let newImageMagnifierList: OrderedSet<IComponentList> = OrderedSet();
                oldImageMagnifierList.map(
                    (imageMagnifier: IComponentList) => {
                        if (imageMagnifier.cid === this.getCid()) {
                            imageMagnifier.baseState = this.getBaseState();
                        }
                        newImageMagnifierList = newImageMagnifierList.add(imageMagnifier);
                    }
                );

                image.setCustomState(
                    ImageState.set(imageCustomState, {
                        imageMagnifierList: newImageMagnifierList
                    })
                );
            }
        }
    }
}

/**
 * 把数据库存储的data转换为customState
 * @param customData 可能的类型：ImageState
 */
export function convertFromDataToCustomState(
    customData: IImageMagnifierState
): any {
    return new ImageMagnifierState(customData);
}
