import { Canvas } from '../canvas';
import { IComponent, ISize, IPosition } from '../../BaseComponent';

export class RichEditUtil {
    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    // 编辑框开始编辑
    beginEdit = (isDbClick: boolean = false) => {
        // 获取最后选中的组件
        const currentSelectedComponent: IComponent | null = this._canvas._canvasGlobalParam.getSelectedComponents().last();

        if (currentSelectedComponent !== null && currentSelectedComponent !== undefined) {
            const value = currentSelectedComponent.getRichChildNode();
            currentSelectedComponent.setRichChildNode(null);
            const style: CSSStyleDeclaration = currentSelectedComponent.getStyle(currentSelectedComponent);
            const size: ISize = currentSelectedComponent.getSize();
            const position: IPosition = currentSelectedComponent.getPosition();
            const bodyOffset: any = this._canvas._positionUtil.getPositionRelativeDocument(position.left, position.top);

            if (isDbClick === true) {
                this._canvas.getEditor().setValue(value);
            } else {
                this._canvas.getEditor().setValue('');
            }
            this._canvas.getEditor().setEditComState(
                size.width,
                bodyOffset.pageY + size.height / 2,
                bodyOffset.pageX + size.width / 2,
                style
            );
        }
    }

    // 编辑框结束编辑
    endEdit = () => {
        const currentSelectedComponent: IComponent | null = this._canvas._canvasGlobalParam.getSelectedComponents().last();

        if (currentSelectedComponent !== null && currentSelectedComponent !== undefined) {
            const value: string = this._canvas.getEditor().getValue();
            this._canvas.getEditor().hiddenEditCom();
            currentSelectedComponent.setRichChildNode(value);
        }
    }

    // 双击编辑
    dbClickToBeginEdit = () => {
        this._canvas._canvasGlobalParam.setIsRichEditMode(true);
        this.beginEdit(true);
    }
}
