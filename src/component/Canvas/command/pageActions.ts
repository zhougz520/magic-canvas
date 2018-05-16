import { Canvas } from '../Canvas';
import { IBoundary, IRange } from '../model/types';
import { IStack, ISComponentList } from '../ICanvasState';
import { IComponent } from '../../BaseComponent';
import { Map, Stack, Set } from 'immutable';

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
        // 获取stage的宽高，如果没有选中组件则在画布正中央添加批注
        const stageSize = this.getThis().props.getStageSize();
        if (stageSize === undefined) {
            return;
        }

        // 批注组件的数据
        const data = {
            offset: {x: 0, y: 0},
            props: {name: '批注', w: 204, h: 170},
            type: 'Comments/Comments',
            lineList: Map()
        };
        let position: {x: number, y: number};

        const selectedComponents: Map<string, IComponent> = this.getThis()._canvasGlobalParam.getSelectedComponents();
        if (selectedComponents.size > 0) {
            // 如果选中组件，向所有选中组件的最右侧距离100px添加批注,组件范围的中心与批注的中心相对
            const componentsRange: IBoundary = this.getThis()._componentsUtil.getComponentsRange(selectedComponents);
            position = {
                x: componentsRange.endPoint.x + 100,
                y: Math.ceil((componentsRange.endPoint.y + componentsRange.startPoint.y) / 2 - data.props.h / 2)
            };

            // TODO Comments优化代码
            let lineList: Map<string, any> = Map();
            selectedComponents.map(
                (com: IComponent, key: string) => {
                    const positionCom = com.getPosition();
                    const sizeCom = com.getSize();

                    lineList = lineList.set(
                        key, {x1: positionCom.left + sizeCom.width, y1: positionCom.top, x2: position.x, y2: position.y}
                    );
                }
            );
            data.lineList = lineList;
        } else {
            // 如果没有选中组件，向画布中央添加批注
            position = {
                x: Math.ceil(stageSize.width / 2 - data.props.w / 2),
                y: Math.ceil(stageSize.height / 2 - data.props.h / 2)
            };
        }

        this.getThis()._componentsUtil.addCancasComponent(data, position);
        // 添加批注记栈
        // const comDataList: OrderedSet<any> = OrderedSet().add(comData);
        // const oldUndoStack: Stack<IStack> = this.getThis().state.undoStack;
        // const newUndoStack: Stack<IStack> = StackUtil.getCanvasStack(this.getThis(), oldUndoStack, 'create', comDataList);
        // this.getThis().setState({
        //     undoStack: newUndoStack
        // });
    },

    // 画布撤销
    undoCanvas() {
        const undoStack: Stack<IStack> = this.getThis().state.undoStack;
        const currentStack: IStack = undoStack.peek();
        if (!currentStack) {
            return;
        }

        const { operationType, componentList } = currentStack;

        switch (operationType) {
            case 'create':
                let cids: Set<string> = Set();
                componentList.map(
                    (component: ISComponentList) => {
                        const com = this.getThis().getComponent(component.cid);
                        if (com) {
                            component.comData.p.baseState = com.getBaseState();
                        }

                        cids = cids.add(component.cid);
                    }
                );
                this.getThis()._componentsUtil.deleteCanvasComponent(cids, false);
                break;
            case 'modify':
                break;
            case 'remove':
                let currentComponentList = this.getThis().state.componentList;
                componentList.map(
                    (component: ISComponentList) => {
                        currentComponentList = currentComponentList.add(component.comData);
                    }
                );
                this.getThis().setState({
                    componentList: currentComponentList
                });
                break;
            default:
                break;
        }

        this.getThis().setState({
            undoStack: undoStack.shift(),
            redoStack: this.getThis().state.redoStack.push(currentStack)
        });
    },

    // 画布重做
    redoCanvas() {
        const redoStack: Stack<IStack> = this.getThis().state.redoStack;
        const currentStack: IStack = redoStack.peek();
        if (!currentStack) {
            return;
        }

        const { operationType, componentList } = currentStack;

        switch (operationType) {
            case 'create':
                let currentComponentList = this.getThis().state.componentList;
                componentList.map(
                    (component: ISComponentList) => {
                        currentComponentList = currentComponentList.add(component.comData);
                    }
                );
                this.getThis().setState({
                    componentList: currentComponentList
                });
                break;
            case 'modify':
                break;
            case 'remove':
                let cids: Set<string> = Set();
                componentList.map(
                    (component: ISComponentList) => {
                        const com = this.getThis().getComponent(component.cid);
                        if (com) {
                            component.comData.p.baseState = com.getBaseState();
                        }

                        cids = cids.add(component.cid);
                    }
                );
                this.getThis()._componentsUtil.deleteCanvasComponent(cids, false);
                break;
            default:
                break;
        }

        this.getThis().setState({
            undoStack: this.getThis().state.undoStack.push(currentStack),
            redoStack: redoStack.shift()
        });
    },

    // 上移一层
    upperCom() {
        this.getThis()._componentsUtil.updateSelectedComponentsZIndex(1);
    },

    // 下移一层
    lowerCom() {
        this.getThis()._componentsUtil.updateSelectedComponentsZIndex(-1);
    },

    // 置于顶层
    frontCom() {
        const selectedComponentZIndexMin: number = this.getThis()._componentsUtil.getSelectedComponentsZIndexRange().minZIndex;
        const maxZIndex: number = this.getThis()._maxZIndex + 1;
        this.getThis()._componentsUtil.updateSelectedComponentsZIndex(maxZIndex - selectedComponentZIndexMin);
    },

    // 置于底层
    backCom() {
        const selectedComponentZIndexMax: number = this.getThis()._componentsUtil.getSelectedComponentsZIndexRange().maxZIndex;
        const minZIndex: number = this.getThis()._minZIndex - 1;
        this.getThis()._componentsUtil.updateSelectedComponentsZIndex(minZIndex - selectedComponentZIndexMax);
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
    }
};
