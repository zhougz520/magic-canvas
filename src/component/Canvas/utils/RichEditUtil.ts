import { Canvas } from '../Canvas';
import { IComponent, ISize, IPosition } from '../../BaseComponent';
import { DraftPublic } from '../../RichEdit';
const { EditorState } = DraftPublic;

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
            const position: IPosition = (currentSelectedComponent as any).getRichEditorSizeAndPosition ?
                (currentSelectedComponent as any).getRichEditorSizeAndPosition().position : currentSelectedComponent.getPosition();
            const size: ISize = (currentSelectedComponent as any).getRichEditorSizeAndPosition ?
                (currentSelectedComponent as any).getRichEditorSizeAndPosition().size : currentSelectedComponent.getSize();

            if ((currentSelectedComponent as any).hiddenEditor) {
                (currentSelectedComponent as any).hiddenEditor(true);
            }
            // TODO 按组件分类：富文本、非富文本。
            this._canvas.getEditor().setState({
                position,
                size,
                editorState: EditorState.createEmpty()
            });
            this._canvas.getEditor().setFocus();
            // const value = currentSelectedComponent.getRichChildNode();
            // currentSelectedComponent.setRichChildNode(null);
            // const style: CSSStyleDeclaration = currentSelectedComponent.getStyle(currentSelectedComponent);
            // const size: ISize = currentSelectedComponent.getSize();
            // const position: IPosition = currentSelectedComponent.getPosition();
            // const bodyOffset: any = this._canvas._positionUtil.getPositionRelativeDocument(position.left, position.top);

            // if (isDbClick === true) {
            //     this._canvas.getEditor().setValue(value);
            // } else {
            //     this._canvas.getEditor().setValue('');
            // }
            // this._canvas.getEditor().setEditComState(
            //     size.width,
            //     bodyOffset.pageY + size.height / 2,
            //     bodyOffset.pageX + size.width / 2,
            //     style
            // );
            // // this._canvas.getEditor().setFocus();
        }
    }

    // 编辑框结束编辑
    endEdit = () => {
        const currentSelectedComponent: IComponent | null = this._canvas._canvasGlobalParam.getSelectedComponents().last();

        if (currentSelectedComponent !== null && currentSelectedComponent !== undefined) {
            // TODO 分类：富文本、非富文本
            const value: any = this._canvas.getEditor().state.editorState;
            this._canvas.getEditor().setState({
                position: { top: -10000, left: -10000 },
                size: { width: 0, height: 0 },
                style: null,
                editorState: EditorState.createEmpty()
            });
            currentSelectedComponent.setRichChildNode(EditorState.createWithContent(value.getCurrentContent()));
            if ((currentSelectedComponent as any).hiddenEditor) {
                (currentSelectedComponent as any).hiddenEditor(false);
            }
        }
    }

    // 双击编辑
    dbClickToBeginEdit = () => {
        this._canvas._canvasGlobalParam.setIsRichEditMode(true);
        this.beginEdit(true);
    }

    // 非编辑模式保持僚机的焦点
    keepWingmanFocus = () => {
        // 如果页面焦点不在僚机上
        // 判断如果有选择组件、并且焦点在body上：把焦点设置到僚机上
        if (document.activeElement.id !== 'wingman') {
            if (this._canvas._canvasGlobalParam.isSelectedComponent() && document.activeElement.tagName === 'BODY') {
                if (this._canvas._isRichEditMode === false) {
                    this._canvas.getWingman().setFocus();
                }
            }
        }
    }
}
