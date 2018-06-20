import { Canvas } from '../Canvas';
import { IComponent } from '../../BaseComponent';
import { IRange, IStack, IComponentList } from '../model/types';
import { Stack, Set, List, OrderedSet, Map } from 'immutable';

export class PageAction {
    private _canvas: Canvas;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
    }

    // 添加批注
    addComments = () => {
        this._canvas._commentsUtil.startAddComments();
    }

    // 画布撤销
    undoCanvas = () => {
        const undoStack: Stack<IStack> = this._canvas._undoStack;
        const redoStack: Stack<IStack> = this._canvas._redoStack;
        let currentComponentList: OrderedSet<IComponentList> = this._canvas.state.componentList;

        const currentUndoStack: IStack = undoStack.peek();
        if (!currentUndoStack) {
            return;
        }
        this._canvas._drawUtil.clearSelected();

        let resetCurrentUndoStack: IStack;
        let resetComponentList: List<IComponentList> = List();
        const { timeStamp, operationType, componentList } = currentUndoStack;

        switch (operationType) {
            case 'create':
                let cids: Set<string> = Set();
                componentList.map(
                    (component: IComponentList) => {
                        const com = this._canvas.getComponent(component.cid);
                        if (com) {
                            resetComponentList = resetComponentList.push(
                                {
                                    cid: component.cid,
                                    comPath: component.comPath,
                                    baseState: com.getBaseState(),
                                    childData: component.childData,
                                    initType: 'Stack'
                                }
                            );
                        }

                        cids = cids.add(component.cid);
                    }
                );
                this._canvas._componentsUtil.deleteCanvasComponent(cids, false);
                break;
            case 'modify':
                componentList.map(
                    (component: IComponentList) => {
                        const com = this._canvas.getComponent(component.cid);
                        if (com) {
                            resetComponentList = resetComponentList.push(component);
                            com.undo();
                        }
                    }
                );
                break;
            case 'remove':
                componentList.map(
                    (component: IComponentList) => {
                        resetComponentList = resetComponentList.push(component);
                        currentComponentList = currentComponentList.add(component);
                    }
                );
                this._canvas.setState({
                    componentList: currentComponentList
                });
                break;
            default:
                break;
        }

        resetCurrentUndoStack = {
            timeStamp,
            operationType,
            componentList: resetComponentList
        };
        this._canvas._undoStack = undoStack.shift();
        this._canvas._redoStack = redoStack.push(resetCurrentUndoStack);
    }

    // 画布重做
    redoCanvas = () => {
        const undoStack: Stack<IStack> = this._canvas._undoStack;
        const redoStack: Stack<IStack> = this._canvas._redoStack;
        let currentComponentList: OrderedSet<IComponentList> = this._canvas.state.componentList;

        const currentRedoStack: IStack = redoStack.peek();
        if (!currentRedoStack) {
            return;
        }
        this._canvas._drawUtil.clearSelected();

        let resetCurrentRedoStack: IStack;
        let resetComponentList: List<IComponentList> = List();
        const { timeStamp, operationType, componentList } = currentRedoStack;

        switch (operationType) {
            case 'create':
                componentList.map(
                    (component: IComponentList) => {
                        resetComponentList = resetComponentList.push(component);
                        currentComponentList = currentComponentList.add(component);
                    }
                );
                this._canvas.setState({
                    componentList: currentComponentList
                });
                break;
            case 'modify':
                componentList.map(
                    (component: IComponentList) => {
                        const com = this._canvas.getComponent(component.cid);
                        if (com) {
                            resetComponentList = resetComponentList.push(component);
                            com.redo();
                        }
                    }
                );
                break;
            case 'remove':
                let cids: Set<string> = Set();
                componentList.map(
                    (component: IComponentList) => {
                        const com = this._canvas.getComponent(component.cid);
                        if (com) {
                            resetComponentList = resetComponentList.push(
                                {
                                    cid: component.cid,
                                    comPath: component.comPath,
                                    baseState: com.getBaseState(),
                                    childData: component.childData,
                                    initType: 'Stack'
                                }
                            );
                        }

                        cids = cids.add(component.cid);
                    }
                );
                this._canvas._componentsUtil.deleteCanvasComponent(cids, false);
                break;
            default:
                break;
        }

        resetCurrentRedoStack = {
            timeStamp,
            operationType,
            componentList: resetComponentList
        };
        this._canvas._undoStack = undoStack.push(resetCurrentRedoStack);
        this._canvas._redoStack = redoStack.shift();
    }

    // 上移一层
    upperCom = () => {
        this._canvas._componentsUtil.updateSelectedComponentsZIndex(1, 1);
    }

    // 下移一层
    lowerCom = () => {
        this._canvas._componentsUtil.updateSelectedComponentsZIndex(-1, -1);
    }

    // 置于顶层
    frontCom = () => {
        const selectedComponentsZIndexRange = this._canvas._componentsUtil.getSelectedComponentsZIndexRange();
        const selectedComponentZIndexMin: number = selectedComponentsZIndexRange.minZIndex;
        const maxZIndex: number = this._canvas._maxZIndex + 1;
        const selectedCommentsZIndexMin: number = selectedComponentsZIndexRange.minCommentsZIndex;
        const maxCommentsZIndex: number = this._canvas._maxCommentsZIndex + 1;
        this._canvas._componentsUtil.updateSelectedComponentsZIndex(maxZIndex - selectedComponentZIndexMin, maxCommentsZIndex - selectedCommentsZIndexMin);
    }

    // 置于底层
    backCom = () => {
        const selectedComponentsZIndexRange = this._canvas._componentsUtil.getSelectedComponentsZIndexRange();
        const selectedComponentZIndexMax: number = selectedComponentsZIndexRange.maxZIndex;
        const minZIndex: number = this._canvas._minZIndex - 1;
        const selectedCommentsZIndexMax: number = selectedComponentsZIndexRange.maxCommentsZIndex;
        const minCommentsZIndex: number = this._canvas._minCommentsZIndex - 1;
        this._canvas._componentsUtil.updateSelectedComponentsZIndex(minZIndex - selectedComponentZIndexMax, minCommentsZIndex - selectedCommentsZIndexMax);
    }

    // 左对齐
    leftCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Left');
    }

    // 水平居中
    centerCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Center');
    }

    // 右对齐
    rightCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Right');
    }

    // 顶对齐
    topCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Top');
    }

    // 垂直居中
    middleCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Middle');
    }

    // 底对齐
    bottomCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Bottom');
    }

    // 水平等间距
    horizontalCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Horizontal');
    }

    // 垂直等间距
    verticalCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Vertical');
    }

    // 加粗
    boldEditor = () => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            const { richEditType } = this._canvas.getEditor().state;
            switch (richEditType) {
                case 'RichEdit':
                    this._canvas.getEditor().toggleInlineStyle('BOLD');
                    break;
                case 'Text':
                    this._canvas.getEditor().toggleFontWeightForText('bold');
                    break;
            }
        }
    }

    // 斜体
    italicEditor = () => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            const { richEditType } = this._canvas.getEditor().state;
            switch (richEditType) {
                case 'RichEdit':
                    this._canvas.getEditor().toggleInlineStyle('ITALIC');
                    break;
                case 'Text':
                    this._canvas.getEditor().toggleFontStyleForText('italic');
                    break;
            }
        }
    }

    // 下划线
    underlineEditor = () => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            const { richEditType } = this._canvas.getEditor().state;
            switch (richEditType) {
                case 'RichEdit':
                    this._canvas.getEditor().toggleInlineStyle('UNDERLINE');
                    break;
                case 'Text':
                    this._canvas.getEditor().toggleTextDecorationForText('underline');
                    break;
            }
        }
    }

    // 删除
    strikethroughEditor = () => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            const { richEditType } = this._canvas.getEditor().state;
            switch (richEditType) {
                case 'RichEdit':
                    this._canvas.getEditor().toggleInlineStyle('STRIKETHROUGH');
                    break;
                case 'Text':
                    this._canvas.getEditor().toggleTextDecorationForText('line-through');
                    break;
            }
        }
    }

    // 字体颜色
    fontColorEditor = (color: any) => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            const { richEditType } = this._canvas.getEditor().state;
            switch (richEditType) {
                case 'RichEdit':
                    this._canvas.getEditor().toggleFontColor(color);
                    break;
                case 'Text':
                    this._canvas.getEditor().toggleFontColorForText(color);
                    break;
            }
        }
    }

    // 字体大小
    fontSizeEditor = (size: any) => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            const { richEditType } = this._canvas.getEditor().state;
            switch (richEditType) {
                case 'RichEdit':
                    this._canvas.getEditor().toggleFontSize(size);
                    break;
                case 'Text':
                    this._canvas.getEditor().toggleFontSizeForText(size);
                    break;
            }
        }
    }

    // 有序列表
    olEditor = (e: any) => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            this._canvas.getEditor().toggleOLBlockTypeClass(e);
        }
    }

    // 无序列表
    ulEditor = (e: any) => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            this._canvas.getEditor().toggleULBlockTypeClass(e);
        }
    }

    // 文本对齐
    textAlignEditor = (textAlign: any) => {
        const isRichEditMode: boolean = this._canvas._isRichEditMode;
        if (isRichEditMode === true) {
            const { richEditType } = this._canvas.getEditor().state;
            switch (richEditType) {
                case 'RichEdit':
                    this._canvas.getEditor().toggleTextAlign(textAlign);
                    break;
                case 'Text':
                    this._canvas.getEditor().toggleTextAlignForText(textAlign);
                    break;
            }
        }
    }

    setPropsCom = (param: any) => {
        const currentSelectedComponent: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
        currentSelectedComponent.map(
            (com: IComponent) => {
                // TODO 优化代码
                com.setPropertiesFromProperty(param.pKey, param.pValue);
                if (param.pKey === 'borderWidth') {
                    setTimeout(() => {
                        this._canvas._drawUtil.repaintSelected();
                    }, 0);
                }
            }
        );
    }
}
