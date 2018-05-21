import { Canvas } from '../Canvas';
import { IComponentList } from '../ICanvasState';

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
    containClassName = (dom: HTMLElement, target: string) => {
        let hasFind = dom.className === target;
        let offsetParent = dom.offsetParent as HTMLElement;
        while (!hasFind && offsetParent !== undefined && offsetParent !== null) {
            hasFind = offsetParent.className === target;
            offsetParent = offsetParent.offsetParent as HTMLElement;
        }

        return hasFind;
    }

    /**
     * 重绘画布的大小
     */
    repaintCanvas = (pointX: number, pointY: number) => {
        const canvasSize: { width: number; height: number; } = this._canvas.props.canvasSize;
        if (pointX > canvasSize.width || pointY > canvasSize.height) {
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
            this._canvas.props.updateCanvasSize(width, height);
        }
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

}
