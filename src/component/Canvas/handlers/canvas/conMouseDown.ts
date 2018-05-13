import { Canvas } from '../../Canvas';

export function conMouseDown(canvas: Canvas, e: any): void {
    if (!canvas._canvasGlobalParam.getIsCanCtrl()) return;
    // 鼠标按下时，计算鼠标位置
    canvas._mouseAndKeyUtil.recordPointStart(e);

    // 锚点上点击
    const anchor = canvas._canvasGlobalParam.getCurrentAnchor();
    if (anchor) {
        // 此处必须阻止事件冒泡，否则可能绘选中覆盖的组件
        e.stopPropagation();
        e.preventDefault();
        canvas._canvasGlobalParam.anchorMouseDown(e, anchor);
    } else {
        switch (canvas._mouseAndKeyUtil.onMouseEventType(e)) {
            case 'component': {
                // 组件中的点击
                return canvas._canvasGlobalParam.componentMouseDown(e);
            }
            case 'canvas': {
                // 画布上的点击
                // 如果是编辑模式：结束编辑模式
                if (canvas._canvasGlobalParam.getIsRichEditMode() === true) {
                    canvas._richEditUtil.endEdit();
                    canvas._canvasGlobalParam.setIsRichEditMode(false);
                }

                // 非多选模式下，清楚所有组件选中状态
                if (!canvas._canvasGlobalParam.isMultiselect()) {
                    canvas._drawUtil.clearSelected();
                    // 清除组件选中状态 清除属性工具栏
                    // canvas.props.clearSelectedProperty();
                }

                return canvas._canvasGlobalParam.canvasMouseDown(e);
            }
            // case 'outside': {
            //     console.log('outside-MouseDown');
            //     // 外框上
            //     canvas.clearSelected();

            //     return canvas.command.outsideMouseDown(e);
            // }
        }
    }
}
