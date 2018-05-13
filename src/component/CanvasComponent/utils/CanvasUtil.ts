import { Canvas } from '../canvas';
import { IComponentList } from '../ICanvasState';
import { config } from '../../config';

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
        if (pointX > config.canvasSize.width || pointY > config.canvasSize.height) {
            const pointXList: number[] = [config.canvasSize.width];
            const pointYList: number[] = [config.canvasSize.height];

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

        const componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        componentList.map(
            (component: IComponentList) => {
                const com = this._canvas.getComponent(component.cid);
                if (com) {
                    zIndexList.push(com.getHierarchy());
                    comIndexList.push(parseInt(component.cid.replace('cs', ''), 10));
                }
            }
        );

        this._canvas._maxZIndex = Math.max(...zIndexList);
        this._canvas._minZIndex = Math.min(...zIndexList);
        if (isResetComIndex) {
            this._canvas._maxComIndex = Math.max(...comIndexList);
        }
    }

}
