import { Canvas } from '../Canvas';
import { IComponentList, IOffset } from '../model/types';
import { IComponent, IPosition, ISize } from '../../BaseComponent';

import { OrderedSet } from 'immutable';

export class CanvasUtil {
    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    /**
     * 判断对象是否含有指定class
     * @param dom HTML对象
     * @param target className
     */
    containClassName = (dom: HTMLElement, target: string): boolean => {
        let hasFind: boolean = dom.className === target;
        let parentElement: HTMLElement | null = dom.parentElement;
        while (!hasFind && parentElement !== undefined && parentElement !== null) {
            hasFind = parentElement.className === target;
            parentElement = parentElement.parentElement;
        }

        return hasFind;
    }

    /**
     * 重绘画布的大小
     */
    repaintCanvas = (pointX: number, pointY: number, isDirectRepaint: boolean = false) => {
        const canvasSize: { width: number; height: number; } = this._canvas.state.canvasSize;
        if (isDirectRepaint || pointX > canvasSize.width || pointY > canvasSize.height) {
            const pointXList: number[] = [canvasSize.width];
            const pointYList: number[] = [canvasSize.height];

            const componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
            componentList.map(
                (component: IComponentList) => {
                    const com = this._canvas.getComponent(component.cid);
                    if (com) {
                        const boundary = com.getBoundaryPoint();
                        pointXList.push(boundary.pointX + 40);
                        pointYList.push(boundary.pointY + 40);
                    }
                }
            );

            const width = Math.max(...pointXList);
            const height = Math.max(...pointYList);

            this.setCanvasSize({ width, height });
            this._canvas._drawUtil.setDrawCanvasSize({ width, height });
        }
    }

    /**
     * 设置画布大小
     */
    setCanvasSize = (canvasSize: { width: number; height: number; }) => {
        this._canvas.setState({ canvasSize });
    }

    /**
     * 根据画布上的组件重算_maxZIndex和_minZIndex
     */
    resetZIndexAndComIndex = (isResetComIndex: boolean = false): void => {
        const zIndexList: number[] = [];
        const comIndexList: number[] = [];

        const commentsZIndexList: number[] = [];
        const commentsIndexList: number[] = [];

        const componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        componentList.map(
            (component: IComponentList) => {
                const com = this._canvas.getComponent(component.cid);
                if (com) {
                    if (com.getComType() === 'Comments') {
                        commentsZIndexList.push(com.getHierarchy());
                        commentsIndexList.push(parseInt(component.cid.replace('cm', ''), 10));
                    } else {
                        zIndexList.push(com.getHierarchy());
                        comIndexList.push(parseInt(component.cid.replace('cs', ''), 10));
                    }
                }
            }
        );

        if (isFinite(Math.max(...zIndexList)) === true) {
            this._canvas._maxZIndex = Math.max(...zIndexList);
            this._canvas._minZIndex = Math.min(...zIndexList);
        }
        if (isFinite(Math.max(...commentsZIndexList)) === true) {
            this._canvas._maxCommentsZIndex = Math.max(...commentsZIndexList);
            this._canvas._minCommentsZIndex = Math.min(...commentsZIndexList);
        }

        if (isResetComIndex) {
            if (isFinite(Math.max(...comIndexList)) === true) {
                this._canvas._maxComIndex = Math.max(...comIndexList);
            }
            if (isFinite(Math.max(...commentsIndexList)) === true) {
                this._canvas._maxCommentsIndex = Math.max(...commentsIndexList);
            }
        }
    }

    /**
     * 推开组件
     * @param cid 当前添加组件cid
     * @param offset 推开偏移量
     */
    pushOpenOtherComponent = (cid: string, offset: IOffset = { x: 0, y: 50 }): void => {
        const component: IComponent | null = this._canvas.getComponent(cid);
        if (component !== null) {
            const isCanPushOpenOtherComponent: boolean = component.isCanPushOpenOtherComponent();
            const position: IPosition = component.getPosition();
            const size: ISize = component.getSize();
            if (isCanPushOpenOtherComponent === true) {
                const componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
                // 过滤出位置在当前添加组件之下的，并且按position.top排序
                const componentListDown: OrderedSet<IComponentList> = componentList.filter(
                    (com: IComponentList) => {
                        const currentCom = this._canvas.getComponent(com.cid);
                        if (currentCom !== null) {
                            return com.cid !== cid && currentCom.getPosition().top >= position.top;
                        } else {
                            return false;
                        }
                    }
                ).sortBy(
                    (com: IComponentList) => {
                        const currentCom = this._canvas.getComponent(com.cid);
                        if (currentCom !== null) {
                            return currentCom.getPosition().top;
                        } else {
                            return 0;
                        }
                    }
                ) as OrderedSet<IComponentList>;

                if (componentListDown.size > 0) {
                    const firstComponent: IComponent | null = this._canvas.getComponent(componentListDown.first().cid);
                    if (firstComponent) {
                        const firstComponentPosition: IPosition = firstComponent.getPosition();
                        if (position.top + size.height >= firstComponentPosition.top) {
                            // 当前添加组件与他下面的第一个组件有重叠部分，则推开
                            const pushOffset: IOffset = {
                                y: position.top + size.height - firstComponentPosition.top + offset.y,
                                x: 0 + offset.x
                            };

                            componentListDown.map(
                                (com: IComponentList) => {
                                    const currentCom = this._canvas.getComponent(com.cid);
                                    if (currentCom !== null) {
                                        const currentComPosition: IPosition = currentCom.getPosition();
                                        currentCom.setPosition({
                                            top: currentComPosition.top + pushOffset.y,
                                            left: currentComPosition.left + pushOffset.x
                                        });
                                    }
                                }
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * 退出批注添加模式
     */
    exitAddCommentsMode = () => {
        this._canvas._isAddCommentsMode = false;
        this._canvas.setState({ cursor: 'default' });
    }

}
