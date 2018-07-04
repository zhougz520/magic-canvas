import { Canvas } from '../Canvas';
import { IComponent } from '../../BaseComponent';
import { IRange, IStack, IComponentList } from '../model/types';
import { convertFromBaseStateToData } from '../encoding/convertFromBaseStateToData';
import { Stack, Set, List, OrderedSet, Map } from 'immutable';

export class PageAction {
    private _canvas: Canvas;
    private _firstValue: any;

    /**
     * 构造函数，通过画布对象初始化
     * @param canvas 画布对象
     */
    public constructor(canvas: Canvas) {
        this._canvas = canvas;
        this._firstValue = '';
    }

    // 添加批注
    addComments = () => {
        this._canvas._commentsUtil.startAddComments();
    }

    // 添加批注锚点
    addCommentsRect = (cid: string) => {
        this._canvas._commentsUtil._currentCommentsCid = cid;
        this._canvas._commentsUtil.startAddComments(true);
    }

    // 删除批注锚点
    deleteCommentsRect = (cid: string) => {
        this._canvas._commentsUtil.doDeleteCommentsRect(cid);
        this._canvas._drawUtil.clearSelected();
        this._canvas._drawUtil.clearDragBox();
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

    // 左右居中
    centerCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Center');
    }

    // 右对齐
    rightCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Right');
    }

    // 顶端对齐
    topCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Top');
    }

    // 上下居中
    middleCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Middle');
    }

    // 底端对齐
    bottomCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Bottom');
    }

    // 横向分布
    horizontalCom = () => {
        const range: IRange = this._canvas._componentsUtil.getSelectedComponentsRange();
        this._canvas._componentsUtil.updateSelectedComponentsPosition(range, 'Horizontal');
    }

    // 纵向分布
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
        } else {
            this._canvas._canvasGlobalParam.getSelectedComponents().toList().map(
                (component: IComponent, key: number) => {
                    if (key === 0) {
                        component.setFontPropsFromTool('fontWeight', 'bold', key);
                    } else {
                        component.setFontPropsFromTool('fontWeight', this._firstValue, key);
                    }
                }
            );
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
        } else {
            this._canvas._canvasGlobalParam.getSelectedComponents().toList().map(
                (component: IComponent, key: number) => {
                    if (key === 0) {
                        component.setFontPropsFromTool('fontStyle', 'italic', key);
                    } else {
                        component.setFontPropsFromTool('fontStyle', this._firstValue, key);
                    }
                }
            );
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
        } else {
            this._canvas._canvasGlobalParam.getSelectedComponents().toList().map(
                (component: IComponent, key: number) => {
                    if (key === 0) {
                        component.setFontPropsFromTool('textDecoration', 'underline', key);
                    } else {
                        component.setFontPropsFromTool('textDecoration', this._firstValue, key);
                    }
                }
            );
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
        } else {
            this._canvas._canvasGlobalParam.getSelectedComponents().toList().map(
                (component: IComponent, key: number) => {
                    if (key === 0) {
                        component.setFontPropsFromTool('textDecoration', 'line-through', key);
                    } else {
                        component.setFontPropsFromTool('textDecoration', this._firstValue, key);
                    }
                }
            );
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
        } else {
            this._canvas._canvasGlobalParam.getSelectedComponents().toList().map(
                (component: IComponent, key: number) => {
                    component.setFontPropsFromTool('fontColor', color, key);
                }
            );
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
        } else {
            this._canvas._canvasGlobalParam.getSelectedComponents().toList().map(
                (component: IComponent, key: number) => {
                    component.setFontPropsFromTool('fontSize', size, key);
                }
            );
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
        } else {
            this._canvas._canvasGlobalParam.getSelectedComponents().toList().map(
                (component: IComponent, key: number) => {
                    if (key === 0) {
                        component.setFontPropsFromTool('textAlign', textAlign, key);
                    } else {
                        component.setFontPropsFromTool('textAlign', this._firstValue, key);
                    }
                }
            );
        }
    }

    // 设置第一个组件的属性值
    setFirstValueEditor = (value: any) => {
        this._firstValue = value;
    }

    /**
     * 属性工具栏设置组件属性
     */
    setPropsCom = (param: { pKey: string; pValue: any; }) => {
        const currentSelectedComponent: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
        currentSelectedComponent.map(
            (com: IComponent) => {
                com.setPropertiesFromProperty(param.pKey, param.pValue);
                // if (param.pKey === 'borderWidth') {
                //     setTimeout(() => {
                //         this._canvas._drawUtil.repaintSelected();
                //     }, 0);
                // }
            }
        );
    }

    /**
     * 设置僚机焦点
     */
    setFocusWingman = () => {
        this._canvas.getWingman().setFocus();
    }

    /**
     * 复制组件
     */
    copyCom = () => {
        const currentSelectedComponent: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();

        const components: any[] = [];
        currentSelectedComponent.map(
            (component: IComponent) => {
                components.push(
                    convertFromBaseStateToData(
                        component.getBaseState(),
                        {
                            comPath: component.getBaseProps().comPath,
                            childData: component.getBaseProps().childData
                        }
                    )
                );
            }
        );

        const detail = {
            type: 'BaseComponent',
            content: {
                components
            }
        };

        this._canvas.props.copyToClipboard && this._canvas.props.copyToClipboard({
            text: JSON.stringify(detail)
        });
        this._canvas._componentsUtil._pasteNum = 0;
    }

    // 剪切
    cutCom = () => {
        this.copyCom();
        this._canvas._componentsUtil.deleteCanvasComponent(this._canvas._canvasGlobalParam.getSelectedCids());
        this._canvas._componentsUtil._pasteNum = -1;
    }

    /**
     * 粘贴
     */
    pasteCom = () => {
        try {
            const clipboardTypes: string[] | undefined = this._canvas.props.checkClipboard && this._canvas.props.checkClipboard();
            const data = this._canvas.props.readFromClipboard && this._canvas.props.readFromClipboard();

            if (clipboardTypes && data) {
                // text
                if (clipboardTypes.includes('text') && data.text && data.text !== '') {
                    const detail = JSON.parse(data.text);
                    const type = detail.type;
                    const content = detail.content;
                    if (content && type && type === 'BaseComponent') {
                        const components = content.components;
                        this._canvas._componentsUtil.pasteCancasComponent(components);
                    }
                }

                // image
                if (clipboardTypes.includes('image') && data.image) {
                    const imageData = data.image;
                    const { dataUrl, size } = imageData;
                    this._canvas._componentsUtil.pasteImage(dataUrl, size);
                }
            }
        } catch (err) {
            // do nothing
        }
    }
}
