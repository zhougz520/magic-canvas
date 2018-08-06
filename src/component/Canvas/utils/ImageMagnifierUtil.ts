import { Canvas } from '../Canvas';
import { BaseState, ISize, IPosition, IComData, IComponent } from '../../BaseComponent';
import { ImageState } from '../../UniversalComponents';
import { IAddImageMagnifierParam, IOffset, IComponentList } from '../model/types';
import { convertFromDataToBaseState } from '../encoding/convertFromDataToBaseState';

import { OrderedSet } from 'immutable';

export class ImageMagnifierUtil {
    public _addImageMagnifierParam: IAddImageMagnifierParam = {
        startPoint: null,
        endPoint: null
    };                                                          // 图片放大位置
    public _imageComponentCid: string | null = null;

    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 开始添加放大镜
     * @param isAddRect 是否是添加锚点
     */
    startAddMagnifier = (cid: string) => {
        this._canvas._canvasUtil.exitCanvasMode();
        this._imageComponentCid = cid;
        this._canvas._isAddImageMagnifierMode = true;
        this._canvas.setState({ cursor: 'crosshair' });
    }

    /**
     * 结束添加放大镜
     */
    stopAddMagnifier = () => {
        this.doAddImageMagnifier();

        this._canvas._canvasUtil.exitCanvasMode();
        // 通知绘画层清理批注选择框
        const draw = this._canvas.props.getDraw();
        if (draw !== null) {
            draw.drawChoiceBox(null);
        }

        this._addImageMagnifierParam = {
            startPoint: null,
            endPoint: null
        };
        this._imageComponentCid = null;
    }

    /**
     * mouseDown的时候记录落点的组件和鼠标位置
     */
    setMouseDownParam = (e: any) => {
        const startPoint: IOffset = this._canvas._canvasGlobalParam.getPointerStart('canvas');
        this._addImageMagnifierParam.startPoint = startPoint;
    }

    /**
     * mouseUp的时候记录鼠标位置
     */
    setMouseUpParam = (e: any) => {
        const endPoint: IOffset = this._canvas._positionUtil.getPositionRelativeCanvas(e.pageX, e.pageY);
        this._addImageMagnifierParam.endPoint = endPoint;
    }

    /**
     * 获取框选的位置与大小
     */
    getAddImageMagnifierPositionAndSize = (): { position: IPosition; size: ISize; } | null => {
        const { startPoint, endPoint } = this._addImageMagnifierParam;
        if (startPoint === null || endPoint === null) return null;

        const position: IPosition = {
            left: Math.min(startPoint.x, endPoint.x),
            top: Math.min(startPoint.y, endPoint.y)
        };
        const size: ISize = {
            width: Math.abs(startPoint.x - endPoint.x) === 0 ? 50 : Math.abs(startPoint.x - endPoint.x),
            height: Math.abs(startPoint.y - endPoint.y) === 0 ? 50 : Math.abs(startPoint.y - endPoint.y)
        };

        return {
            position,
            size
        };
    }

    /**
     * 添加图片放大镜
     */
    doAddImageMagnifier = () => {
        if (this._imageComponentCid === null) return;
        const comImage: IComponent | null = this._canvas.getComponent(this._imageComponentCid);

        if (comImage) {
            const imageCustomState: ImageState = comImage.getCustomState();
            const imageMagnifierPositionAndSize = this.getAddImageMagnifierPositionAndSize();
            if (imageMagnifierPositionAndSize === null) return;
            // 框选大小和位置
            const rectPosition: IPosition = imageMagnifierPositionAndSize.position;
            const rectSize: ISize = imageMagnifierPositionAndSize.size;
            // 原图属性
            const natureWidth: number = imageCustomState.getWidth();
            const natureHeight: number = imageCustomState.getHeight();
            const natureDataUrl: string = imageCustomState.getSrc();
            // 调整后的图片属性
            const imagePosition = {
                top: comImage.getPosition().top + 41,
                left: comImage.getPosition().left + 11
            };
            const imageSize: ISize = {
                height: comImage.getSize().height - 52,
                width: comImage.getSize().width - 22
            };
            // 放大镜相对位置
            const relativePosition: IPosition = {
                top: rectPosition.top - imagePosition.top,
                left: rectPosition.left - imagePosition.left
            };

            // 截取大小和位置
            const cutSize: ISize = {
                width: Math.ceil(rectSize.width * (natureWidth / imageSize.width)),
                height: Math.ceil(rectSize.height * (natureHeight / imageSize.height))
            };
            const cutPosition: IPosition = {
                top: Math.ceil(relativePosition.top * (natureHeight / imageSize.height)),
                left: Math.ceil(relativePosition.left * (natureWidth / imageSize.width))
            };

            const data = {
                offset: { x: 0, y: 0 },
                p: { name: '图片放大镜', w: cutSize.width + 8, h: cutSize.height + 8 },
                t: 'UniversalComponents/ImageCom/ImageMagnifier'
            };
            const comData: IComData = this._canvas._componentsUtil.convertComponentToData(
                data,
                // TODO 修改添加位置
                { x: rectPosition.left, y: rectPosition.top },
                {
                    cid: this._imageComponentCid,
                    src: natureDataUrl,
                    backgroundPositionX: - cutPosition.left,
                    backgroundPositionY: - cutPosition.top
                }
            );
            this._canvas._componentsUtil._addNum -= 1;
            comData.id = this._imageComponentCid + '.ci' + (imageCustomState.getMaxMagnifierId() + 1);
            comData.comType = 'ImageMagnifier';
            comData.zIndex = comImage.getHierarchy();

            const baseState: BaseState = convertFromDataToBaseState(comData, data.t);
            const component: IComponentList = {
                cid: comData.id,
                comPath: data.t,
                baseState,
                childData: comData.p,
                initType: 'Init'
            };

            const imageMagnifierList: OrderedSet<IComponentList> =
                imageCustomState.getImageMagnifierList().add(component);
            comImage.setCustomState(
                ImageState.set(imageCustomState, {
                    imageMagnifierList,
                    maxMagnifierId: imageCustomState.getMaxMagnifierId() + 1
                })
            );
        }
    }

    /**
     * 删除图片放大镜
     */
    doDeleteImageMagnifier = (cid: string) => {
        const imageCid: string = cid.split('.')[0];
        const comImage: IComponent | null = this._canvas.getComponent(imageCid);
        if (comImage) {
            const imageCustomState: ImageState = comImage.getCustomState();
            let imageMagnifierList: OrderedSet<IComponentList> = imageCustomState.getImageMagnifierList();
            imageMagnifierList.map(
                (imageMagnifier: IComponentList) => {
                    if (cid === imageMagnifier.cid) {
                        imageMagnifierList = imageMagnifierList.delete(imageMagnifier);
                    }
                }
            );
            comImage.setCustomState(
                ImageState.set(imageCustomState, {
                    imageMagnifierList
                })
            );
        }
    }
}
