import { Canvas } from '../Canvas';
import { BaseState, IComponent, IComData } from '../../BaseComponent';
import { IRange, IStack, IComponentList, IOperation, IOffset } from '../model/types';
import { convertFromBaseStateToData } from '../encoding/convertFromBaseStateToData';
import { convertFromDataToBaseState } from '../encoding/convertFromDataToBaseState';

import { getPluginConfig, PluginMap } from '../../../plugin';
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

    // 加载模版
    initTemplate = (param: { cid: string; template: string | null; }) => {
        const { cid, template } = param;
        if (template !== null) {
            const com: IComponent | null = this._canvas.getComponent(cid);
            if (com && (com as any).initTemplate) {
                (com as any).initTemplate(template);
            }
        }
    }

    // 画布撤销
    undoCanvas = () => {
        // 如果是编辑模式：结束编辑状态。
        if (this._canvas._isRichEditMode === true) {
            this._canvas._richEditUtil.undoRedo('undo');
        } else {
            const undoStack: Stack<IStack> = this._canvas._undoStack;
            const redoStack: Stack<IStack> = this._canvas._redoStack;
            let currentComponentList: OrderedSet<IComponentList> = this._canvas.state.componentList;

            const currentUndoStack: IStack = undoStack.peek();
            if (!currentUndoStack) {
                return;
            }
            this._canvas._drawUtil.clearSelected();

            let resetCurrentUndoStack: IStack;
            let resetOperationList: List<IOperation> = List();
            const { timeStamp, operationList } = currentUndoStack;

            operationList.map(
                (operation: IOperation) => {
                    let resetComponentList: List<IComponentList> = List();

                    switch (operation.operationType) {
                        case 'create':
                            let cids: Set<string> = Set();
                            operation.componentList.map(
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
                            operation.componentList.map(
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
                            operation.componentList.map(
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

                    resetOperationList = resetOperationList.push({
                        operationType: operation.operationType,
                        componentList: resetComponentList
                    });
                }
            );

            resetCurrentUndoStack = {
                timeStamp,
                operationList: resetOperationList
            };
            this._canvas._undoStack = undoStack.shift();
            this._canvas._redoStack = redoStack.push(resetCurrentUndoStack);
        }
    }

    // 画布重做
    redoCanvas = () => {
        // 如果是编辑模式：结束编辑状态。
        if (this._canvas._isRichEditMode === true) {
            this._canvas._richEditUtil.undoRedo('redo');
        } else {
            const undoStack: Stack<IStack> = this._canvas._undoStack;
            const redoStack: Stack<IStack> = this._canvas._redoStack;
            let currentComponentList: OrderedSet<IComponentList> = this._canvas.state.componentList;

            const currentRedoStack: IStack = redoStack.peek();
            if (!currentRedoStack) {
                return;
            }
            this._canvas._drawUtil.clearSelected();

            let resetCurrentRedoStack: IStack;
            let resetOperationList: List<IOperation> = List();
            const { timeStamp, operationList } = currentRedoStack;

            operationList.map(
                (operation: IOperation) => {
                    let resetComponentList: List<IComponentList> = List();

                    switch (operation.operationType) {
                        case 'create':
                            operation.componentList.map(
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
                            operation.componentList.map(
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
                            operation.componentList.map(
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

                    resetOperationList = resetOperationList.push({
                        operationType: operation.operationType,
                        componentList: resetComponentList
                    });
                }
            );

            resetCurrentRedoStack = {
                timeStamp,
                operationList: resetOperationList
            };
            this._canvas._undoStack = undoStack.push(resetCurrentRedoStack);
            this._canvas._redoStack = redoStack.shift();
        }
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
            }
        );
    }
    // /**
    //  * 属性工具栏设置组件属性
    //  */
    // setTypeCom = (param: { pKey: string; pValue: any; }) => {
    //     const currentSelectedComponent: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();
    //     currentSelectedComponent.map(
    //         (com: IComponent) => {
    //             com.setPropertiesFromProperty(param.pKey, param.pValue);
    //         }
    //     );
    // }

    /**
     * 设置僚机焦点
     */
    setFocusWingman = () => {
        this._canvas.getWingman().setFocus();
    }

    /**
     * 删除组件
     */
    deleteCom = () => {
        this._canvas._componentsUtil.deleteCanvasComponent(this._canvas._canvasGlobalParam.getSelectedCids());
    }

    /**
     * 复制组件
     */
    copyCom = () => {
        const currentSelectedComponent: Map<string, IComponent> = this._canvas._canvasGlobalParam.getSelectedComponents();

        const components: any[] = [];
        currentSelectedComponent.map(
            (component: IComponent) => {
                const isCanCopy: boolean = component.isCanCopy();
                if (isCanCopy) {
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
            }
        );

        let detail: {} = {};
        if (components.length > 0) {
            detail = {
                type: 'BaseComponent',
                content: {
                    components
                }
            };
        }

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

    // 粘贴
    pasteCom = () => {
        try {
            const clipboardTypes: string[] | undefined = this._canvas.props.checkClipboard && this._canvas.props.checkClipboard();
            const data = this._canvas.props.readFromClipboard && this._canvas.props.readFromClipboard();

            if (clipboardTypes && clipboardTypes.length > 0 && data) {
                // text
                if (clipboardTypes.includes('text') && data.text && data.text !== '') {
                    const detail = JSON.parse(data.text);
                    const type = detail.type;
                    const content = detail.content;
                    if (content && type && type === 'BaseComponent') {
                        const components = content.components;
                        this._canvas._componentsUtil.pasteCanvasComponent(components);
                    }
                }

                // image
                if (clipboardTypes.includes('image') && data.image) {
                    const pasteImageFunc = getPluginConfig(PluginMap.PASTE_IMAGE_FUNC);
                    if (!pasteImageFunc) {
                        return;
                    }
                    const imageData = pasteImageFunc();
                    const { size, uid } = imageData;
                    this._canvas._componentsUtil.pasteImage(uid, size);
                }
            }
        } catch (err) {
            // do nothing
        }
    }

    // 全选
    selectCom = () => {
        const componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        componentList.map(
            (component: IComponentList) => {
                const com = this._canvas.getComponent(component.cid);
                if (com !== null) {
                    const isCanSelected: boolean = com.isCanSelected();
                    if (isCanSelected) {
                        this._canvas._drawUtil.selectedComponent(component.cid, com, true);
                    }
                }
            }
        );

        // 框选的时候：有选中组件才做提交
        const selectedComponents = this._canvas._canvasGlobalParam.getSelectedComponents();
        if (selectedComponents.size > 0) {
            this._canvas.props.onCommandProperties && this._canvas.props.onCommandProperties(this._canvas.getSelectedToolButtons(selectedComponents));
            this._canvas.props.onPropertyProperties && this._canvas.props.onPropertyProperties(this._canvas.getSelectedProperties(selectedComponents));
        }
    }

    // 添加图片放大镜
    addMagnifier = (cid: string) => {
        this._canvas._imageMagnifierUtil.startAddMagnifier(cid);
    }

    // 删除图片放大镜
    deleteMagnifier = (cid: string) => {
        this._canvas._imageMagnifierUtil.doDeleteImageMagnifier(cid);
        this._canvas._drawUtil.clearSelected();
        this._canvas._drawUtil.clearDragBox();
    }

    // 保存数据
    saveData = () => {
        this._canvas.props.saveData && this._canvas.props.saveData();
    }

    // 退出所有模式
    exitAllMode = () => {
        this._canvas._canvasUtil.exitCanvasMode();
        if (this._canvas._isRichEditMode === true) {
            this._canvas._richEditUtil.endEdit();
        }
    }

    // 读取Erp组件
    readErp = (dataList: any[]) => {
        let addComponentList: List<IComponentList> = List();
        const timeStamp: number = new Date().getTime();

        const stageOffset = this._canvas.props.componentPosition.stageOffset;
        const position: IOffset = this._canvas._positionUtil.getPositionRelativeCanvas(stageOffset.left, stageOffset.top);
        const maxComIndex: number = this._canvas._maxComIndex;
        let componentList: OrderedSet<IComponentList> = this._canvas.state.componentList;
        dataList.map(
            (data: any, i: number) => {
                data = JSON.parse(
                    JSON.stringify(data).replace(/\[cid\]/g, `cs${maxComIndex + i + 1}`)
                );
                data.offset = { x: 0, y: 0 };

                const comData: IComData = this._canvas._componentsUtil.convertComponentToData(
                    data,
                    { x: position.x + 20 * (i + 1), y: position.y + 20 * (i + 1) },
                    data.p.customState
                );
                const baseState: BaseState = convertFromDataToBaseState(comData, data.t);
                const component: IComponentList = {
                    cid: comData.id,
                    comPath: data.t,
                    baseState,
                    childData: comData.p,
                    initType: 'Read'
                };

                componentList = componentList.add(component);
                addComponentList = addComponentList.push(component);
            }
        );
        this._canvas._componentsUtil._addNum = 0;

        this._canvas.setState({
            componentList
        }, () => {
            this._canvas._canvasUtil.repaintCanvas(0, 0, true);
            // 添加撤销栈
            this._canvas._stackUtil.setCanvasUndoStack(
                timeStamp,
                'create',
                addComponentList
            );
        });
    }
}
