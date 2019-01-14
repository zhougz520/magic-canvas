import { IComData } from '../BaseComponent';

/**
 * 'Run'：运行模式
 * 'Edit'：编辑模式
 * 'Guest'：访客模式
 */
export type PageMode = 'Run' | 'Edit' | 'Guest';

// 画布的偏移量
export interface ICompos {
    stageOffset: { top: number, left: number, right: number, bottom: number };  // stage相对body的偏移量
    canvasOffset: { top: number, left: number, right: number, bottom: number };  // canvas相对stage的偏移量
    borderOffset: { border: number };   // antd全局样式box-sizing导致的组件实际width和height会缩小2*border
}

// config格式
export interface IConfig {
    componentPosition: ICompos; // 画布的初始偏移量
}

// 数据库存储的数据结构
export type ComponentsType = Array<{
    t: string;
    p: IComData;
}>;

export const ComponentsMap = {
    Universal_CheckBox: { t: 'UniversalComponents/CheckBox/CheckBox', p: { name: '多选', w: 110, h: 24 } },
    Universal_Radio: { t: 'UniversalComponents/Radio/Radio', p: { name: '单选', w: 110, h: 24 } },
    Universal_Button: { t: 'UniversalComponents/Button/Button', p: { name: '按钮', w: 82, h: 32 } },
    Universal_Hyperlink: { t: 'UniversalComponents/Hyperlink/Hyperlink', p: { name: '超链接', w: 80, h: 25 } },
    Universal_Selector: { t: 'UniversalComponents/Selector/Selector', p: { name: '下拉框', w: 120, h: 32 } },
    Universal_Input: { t: 'UniversalComponents/Input/Input', p: { name: '单行输入', w: 200, h: 32 } },
    Universal_TextField: { t: 'UniversalComponents/TextField/TextField', p: { name: '多行输入', w: 280, h: 73 } },
    Universal_Image: { t: 'UniversalComponents/ImageCom/Image', p: { name: '图片', w: 300, h: 200 } },
    Universal_RichText: { t: 'UniversalComponents/RichText/RichText', p: { name: '文本', w: 204, h: 170 } },
    Universal_Table: { t: 'UniversalComponents/Table/Table', p: { name: '表格', w: 600, h: 300 } },
    NewMap_AppGrid: {
        t: 'MapComponent/newMap/grid/base/AppGridContainer',
        p: { name: '列表', w: 600, h: 550, type: 'base' },
        children: [
            { t: 'MapComponent/newMap/grid/AppFindAdvancedItem', p: { name: '高级搜索组件' } },
            { t: 'MapComponent/newMap/grid/AppGridViewItem', p: { name: '视图标签' } },
            { t: 'MapComponent/newMap/grid/AppGridMenuItemButton', p: { name: '按钮' } },
            { t: 'MapComponent/newMap/grid/AppGridMenuItemDropdown', p: { name: '菜单按钮' } },
            { t: 'MapComponent/newMap/grid/AppGridMenuItemSwitch', p: { name: '开关按钮' } },
            { t: 'MapComponent/newMap/grid/AppGridHeader', p: { name: '列表-列' } },
            { t: 'MapComponent/newMap/grid/AppGridContent', p: { name: '表格数据-行' } }
        ]
    },
    NewMap_AppForm: {
        t: 'MapComponent/newMap/form/base/AppFormContainer',
        p: { name: '表单', w: 600, h: 400, type: 'base' },
        children: [
            { t: 'MapComponent/newMap/form/TabItem', p: { name: '标签页' } },
            { t: 'MapComponent/newMap/form/Section', p: { name: '分组' } },
            { t: 'MapComponent/newMap/form/field/TextField', p: { name: '纯文本' } },
            { t: 'MapComponent/newMap/form/field/InputField', p: { name: '文本录入' } },
            { t: 'MapComponent/newMap/form/field/InputNumberField', p: { name: '数字录入' } },
            { t: 'MapComponent/newMap/form/field/LinkField', p: { name: '超链接' } },
            { t: 'MapComponent/newMap/form/field/SelectField', p: { name: '下拉选择' } },
            { t: 'MapComponent/newMap/form/field/DataTimeField', p: { name: '日期录入' } },
            { t: 'MapComponent/newMap/form/field/LookUpField', p: { name: '弹出选择' } },
            { t: 'MapComponent/newMap/form/field/RadioField', p: { name: '单选框' } },
            { t: 'MapComponent/newMap/form/field/CheckBoxField', p: { name: '复选框' } },
            { t: 'MapComponent/newMap/form/field/InputIconField', p: { name: '文本&图片' } },
            { t: 'MapComponent/newMap/form/field/TextAreaField', p: { name: '多行文本' } },
            { t: 'MapComponent/newMap/form/field/NullField', p: { name: '空白区' } },
            { t: 'MapComponent/newMap/form/field/UploadField', p: { name: '上传' } }
        ]
    }
};

export type ContextMenuType = 'menu' | 'separator';

export interface IContextMenuItems {
    type: ContextMenuType;
    label?: string;
    enabled?: boolean;
    click?: () => void;
}
