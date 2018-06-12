import { Canvas } from '../Canvas';
import { IRange, IStack, IComponentList } from '../model/types';
import { Stack, Set, List, OrderedSet } from 'immutable';

export const pageActions = {
    bind(ins: any) {
        for (const key in this) {
            if (key !== 'bind') {
                ins[key] = (this as any)[key].bind(ins);
            }
        }
    },

    // 获得当前绑定的this
    getThis(): Canvas {
        return (this as any);
    },

    // 添加批注
    addComments() {
        this.getThis()._commentsUtil.startAddComments();
        this.getThis().getSaveData();
    },

    // 画布撤销
    undoCanvas() {
        const undoStack: Stack<IStack> = this.getThis()._undoStack;
        const redoStack: Stack<IStack> = this.getThis()._redoStack;
        let currentComponentList: OrderedSet<IComponentList> = this.getThis().state.componentList;

        const currentUndoStack: IStack = undoStack.peek();
        if (!currentUndoStack) {
            return;
        }

        let resetCurrentUndoStack: IStack;
        let resetComponentList: List<IComponentList> = List();
        const { timeStamp, operationType, componentList } = currentUndoStack;

        switch (operationType) {
            case 'create':
                let cids: Set<string> = Set();
                componentList.map(
                    (component: IComponentList) => {
                        const com = this.getThis().getComponent(component.cid);
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
                this.getThis()._componentsUtil.deleteCanvasComponent(cids, false);
                break;
            case 'modify':
                componentList.map(
                    (component: IComponentList) => {
                        const com = this.getThis().getComponent(component.cid);
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
                this.getThis().setState({
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
        this.getThis()._undoStack = undoStack.shift();
        this.getThis()._redoStack = redoStack.push(resetCurrentUndoStack);
    },

    // 画布重做
    redoCanvas() {
        const undoStack: Stack<IStack> = this.getThis()._undoStack;
        const redoStack: Stack<IStack> = this.getThis()._redoStack;
        let currentComponentList: OrderedSet<IComponentList> = this.getThis().state.componentList;

        const currentRedoStack: IStack = redoStack.peek();
        if (!currentRedoStack) {
            return;
        }

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
                this.getThis().setState({
                    componentList: currentComponentList
                });
                break;
            case 'modify':
                componentList.map(
                    (component: IComponentList) => {
                        const com = this.getThis().getComponent(component.cid);
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
                        const com = this.getThis().getComponent(component.cid);
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
                this.getThis()._componentsUtil.deleteCanvasComponent(cids, false);
                break;
            default:
                break;
        }

        resetCurrentRedoStack = {
            timeStamp,
            operationType,
            componentList: resetComponentList
        };
        this.getThis()._undoStack = undoStack.push(resetCurrentRedoStack);
        this.getThis()._redoStack = redoStack.shift();
    },

    // 上移一层
    upperCom() {
        this.getThis()._componentsUtil.updateSelectedComponentsZIndex(1, 1);
    },

    // 下移一层
    lowerCom() {
        this.getThis()._componentsUtil.updateSelectedComponentsZIndex(-1, -1);
    },

    // 置于顶层
    frontCom() {
        const selectedComponentsZIndexRange = this.getThis()._componentsUtil.getSelectedComponentsZIndexRange();
        const selectedComponentZIndexMin: number = selectedComponentsZIndexRange.minZIndex;
        const maxZIndex: number = this.getThis()._maxZIndex + 1;
        const selectedCommentsZIndexMin: number = selectedComponentsZIndexRange.minCommentsZIndex;
        const maxCommentsZIndex: number = this.getThis()._maxCommentsZIndex + 1;
        this.getThis()._componentsUtil.updateSelectedComponentsZIndex(maxZIndex - selectedComponentZIndexMin, maxCommentsZIndex - selectedCommentsZIndexMin);
    },

    // 置于底层
    backCom() {
        const selectedComponentsZIndexRange = this.getThis()._componentsUtil.getSelectedComponentsZIndexRange();
        const selectedComponentZIndexMax: number = selectedComponentsZIndexRange.maxZIndex;
        const minZIndex: number = this.getThis()._minZIndex - 1;
        const selectedCommentsZIndexMax: number = selectedComponentsZIndexRange.maxCommentsZIndex;
        const minCommentsZIndex: number = this.getThis()._minCommentsZIndex - 1;
        this.getThis()._componentsUtil.updateSelectedComponentsZIndex(minZIndex - selectedComponentZIndexMax, minCommentsZIndex - selectedCommentsZIndexMax);
    },

    // 左对齐
    leftCom() {
        const range: IRange = this.getThis()._componentsUtil.getSelectedComponentsRange();
        this.getThis()._componentsUtil.updateSelectedComponentsPosition(range, 'Left');
    },

    // 水平居中
    centerCom() {
        const range: IRange = this.getThis()._componentsUtil.getSelectedComponentsRange();
        this.getThis()._componentsUtil.updateSelectedComponentsPosition(range, 'Center');
    },

    // 右对齐
    rightCom() {
        const range: IRange = this.getThis()._componentsUtil.getSelectedComponentsRange();
        this.getThis()._componentsUtil.updateSelectedComponentsPosition(range, 'Right');
    },

    // 顶对齐
    topCom() {
        const range: IRange = this.getThis()._componentsUtil.getSelectedComponentsRange();
        this.getThis()._componentsUtil.updateSelectedComponentsPosition(range, 'Top');
    },

    // 垂直居中
    middleCom() {
        const range: IRange = this.getThis()._componentsUtil.getSelectedComponentsRange();
        this.getThis()._componentsUtil.updateSelectedComponentsPosition(range, 'Middle');
    },

    // 底对齐
    bottomCom() {
        const range: IRange = this.getThis()._componentsUtil.getSelectedComponentsRange();
        this.getThis()._componentsUtil.updateSelectedComponentsPosition(range, 'Bottom');
    },

    // 水平等间距
    horizontalCom() {
        const range: IRange = this.getThis()._componentsUtil.getSelectedComponentsRange();
        this.getThis()._componentsUtil.updateSelectedComponentsPosition(range, 'Horizontal');
    },

    // 垂直等间距
    verticalCom() {
        const range: IRange = this.getThis()._componentsUtil.getSelectedComponentsRange();
        this.getThis()._componentsUtil.updateSelectedComponentsPosition(range, 'Vertical');
    },

    // 加粗
    boldEditor() {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleInlineStyle('BOLD');
        }
    },

    // 斜体
    italicEditor() {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleInlineStyle('ITALIC');
        }
    },

    // 下划线
    underlineEditor() {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleInlineStyle('UNDERLINE');
        }
    },

    // 删除
    strikethroughEditor() {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleInlineStyle('STRIKETHROUGH');
        }
    },

    // 字体颜色
    fontColorEditor(color: any) {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleFontColor(color);
        }
    },

    // 字体大小
    fontSizeEditor(size: any) {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleFontSize(size);
        }
    },

    // 有序列表
    olEditor(e: any) {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleOLBlockTypeClass(e);
        }
    },

    // 无序列表
    ulEditor(e: any) {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleULBlockTypeClass(e);
        }
    },

    // 文本对齐
    textAlignEditor(textAlign: any) {
        const isRichEditMode: boolean = this.getThis()._isRichEditMode;
        if (isRichEditMode === true) {
            this.getThis().getEditor().toggleTextAlign(textAlign);
        }
    }
};
