
export enum CommandMap {
    // 添加批注
    COMMENTS_ADD = 'e.addComments',
    // 添加批注锚点
    COMMENTSRECT_ADD = 'e.addCommentsRect',
    // 删除批注锚点
    COMMENTSRECT_DELETE = 'e.deleteCommentsRect',

    // 画布撤销
    CANVAS_UNDO = 'e.undoCanvas',
    // 画布重做
    CANVAS_REDO = 'e.redoCanvas',

    // 上移一层
    COM_UPPER = 'e.upperCom',
    // 下移一层
    COM_LOWER = 'e.lowerCom',
    // 置于顶层
    COM_FRONT = 'e.frontCom',
    // 置于底层
    COM_BACK = 'e.backCom',

    // 左对齐
    COM_LEFT = 'e.leftCom',
    // 水平居中
    COM_CENTER = 'e.centerCom',
    // 右对齐
    COM_RIGHT = 'e.rightCom',
    // 顶对齐
    COM_TOP = 'e.topCom',
    // 垂直居中
    COM_MIDDLE = 'e.middleCom',
    // 底对齐
    COM_BOTTOM = 'e.bottomCom',
    // 水平等间距
    COM_HORIZONTAL = 'e.horizontalCom',
    // 垂直等间距
    COM_VERTICAL = 'e.verticalCom',

    // 加粗
    EDITOR_BOLD = 'e.boldEditor',
    // 斜体
    EDITOR_ITALIC = 'e.italicEditor',
    // 下划线
    EDITOR_UNDERLINE = 'e.underlineEditor',
    // 删除线
    EDITOR_STRIKETHROUGH = 'e.strikethroughEditor',
    // 字体颜色
    EDITOR_FONTCOLOR = 'e.fontColorEditor',
    // 字体大小
    EDITOR_FONTSIZE = 'e.fontSizeEditor',
    // 有序列表
    EDITOR_OL = 'e.olEditor',
    // 无序列表
    EDITOR_UL = 'e.ulEditor',
    // 对齐
    EDITOR_TEXTALIGN = 'e.textAlignEditor',
    // 设置第一个组件的属性值
    EDITOR_SETFIRSTVALUE = 'e.setFirstValueEditor',

    // 设置组件属性
    COM_SETPROPS = 'e.setPropsCom',

    // 设置僚机焦点
    WINGMAN_FOCUS = 'e.setFocusWingman',

    // 复制
    COM_COPY = 'e.copyCom',

    // 剪切
    COM_CUT = 'e.cutCom',

    // 粘贴
    COM_PASTE = 'e.pasteCom',

    // 添加图片放大镜
    MAGNIFIER_ADD = 'e.addMagnifier',
    // 删除图片放大镜
    MAGNIFIER_DELETE = 'e.deleteMagnifier',

    // 保存数据
    DATA_SAVE = 'e.saveData'
}
