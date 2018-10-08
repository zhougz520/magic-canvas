import { ComponentsMap } from '../../../../../src';
const {
    Universal_Button,
    Universal_CheckBox,
    Universal_Hyperlink,
    Universal_Input,
    Universal_Radio,
    Universal_Selector,
    Universal_TextField,
    Universal_Image,
    Universal_RichText,
    Universal_Table
} = ComponentsMap;

export interface IBasePage {
    category: string;
    categoryKey: string;
    expanded: boolean;
    group?: any;
    components: any[];
}
export interface IsourceList {
    componentMode: { [key: string]: string };
    components: { [key: string]: any };
}

const basePage: IBasePage[] = [
    {
        category: '常用需求组件',
        categoryKey: 'common',
        expanded: false,
        components: []
    },
    {
        category: '基础组件',
        categoryKey: 'basic',
        expanded: true,
        components: [
            Universal_Button,
            Universal_CheckBox,
            Universal_Hyperlink,
            Universal_Input,
            Universal_Radio,
            Universal_Selector,
            Universal_TextField,
            Universal_Image,
            Universal_RichText,
            Universal_Table
        ]
    },
    {
        category: 'ERP页面',
        categoryKey: 'erp',
        expanded: false,
        components: [
            // TODO: 此处暂时以此方式设置组件初始宽高，之后由周周再修改
            { t: 'MapComponent/map/AppFormContainer', p: { name: '表单', w: 600, h: 400, type: 'base' } },
            { t: 'MapComponent/map/AppGridContainer', p: { name: '列表', w: 600, h: 400, type: 'base' } },
            { t: 'MapComponent/map/grid/AppGridMenuItem', p: { name: 'grid菜单' } },
            { t: 'MapComponent/map/form/AppFormMenuItem', p: { name: 'form菜单' } },
            { t: 'MapComponent/map/form/NavBarItem', p: { name: 'NavBarItem' } },
            { t: 'MapComponent/map/form/TabItem', p: { name: 'TabItem' } },
            { t: 'MapComponent/map/form/Section', p: { name: 'Section' } },
            { t: 'MapComponent/map/form/field/InputField', p: { name: '输入框' } },
            { t: 'MapComponent/map/grid/AppGridTitle', p: { name: '列表-列' } },
            {
                t: 'MapComponent/map/AppFormContainer',
                p: {
                    name: '表单',
                    w: 600,
                    h: 400,
                    type: 'base',
                    p: {
                        components: [
                            {
                                t: 'MapComponent/map/form/AppForm',
                                p: {
                                    id: 'cs1.cs1',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/map/form/NavBarItem',
                                                p: {
                                                    id: 'cs1.cs1.cs1',
                                                    l: 197,
                                                    t: 132,
                                                    p: {
                                                        components: [
                                                            {
                                                                t: 'MapComponent/map/form/TabForm',
                                                                p: {
                                                                    id: 'cs1.cs1.cs1.cs1',
                                                                    l: 197,
                                                                    t: 132,
                                                                    p: {
                                                                        components: [
                                                                            {
                                                                                t: 'MapComponent/map/form/TabItem',
                                                                                p: {
                                                                                    id: 'cs1.cs1.cs1.cs1.cs1',
                                                                                    l: 197,
                                                                                    t: 132,
                                                                                    p: {
                                                                                        components: [
                                                                                            {
                                                                                                t: 'MapComponent/map/form/SectionForm',
                                                                                                p: {
                                                                                                    id: 'cs1.cs1.cs1.cs1.cs1.cs1',
                                                                                                    l: 197,
                                                                                                    t: 132,
                                                                                                    p: {
                                                                                                        components: [
                                                                                                            {
                                                                                                                t: 'MapComponent/map/form/Section',
                                                                                                                p: {
                                                                                                                    id: 'cs1.cs1.cs1.cs1.cs1.cs1.cs1',
                                                                                                                    l: 197,
                                                                                                                    t: 132,
                                                                                                                    p: {
                                                                                                                        components: [
                                                                                                                            {
                                                                                                                                t: 'MapComponent/newMap/form/field/InputField',
                                                                                                                                p: {
                                                                                                                                    id: 'cs1.cs1.cs1.cs1.cs1.cs1.cs1.cs1',
                                                                                                                                    l: 197,
                                                                                                                                    t: 132,
                                                                                                                                    map_form_f_cols: 1
                                                                                                                                }
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    },
                                                                    map_form_sti: 'cs1.cs1.cs1.cs1.cs1',
                                                                    map_form_st: '2'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },
    {
        category: 'ERP典型页面',
        categoryKey: 'StandardUI',
        expanded: false,
        components: []
    },
    {
        category: '重构页面(试用)',
        categoryKey: 'newERP',
        expanded: false,
        components: [
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
            { t: 'MapComponent/newMap/form/Section', p: { name: '分组' } },
            { t: 'MapComponent/newMap/form/TabItem', p: { name: '标签页' } },
            {
                t: 'MapComponent/newMap/grid/base/AppGridContainer',
                p: {
                    name: '列表',
                    w: 600,
                    h: 400,
                    type: 'base',
                    p: {
                        components: [
                            {
                                t: 'MapComponent/newMap/grid/AppProjectTree',
                                p: {
                                    id: 'cs1.cs1',
                                    map_pt_txt: '公司'
                                }
                            },
                            {
                                t: 'MapComponent/newMap/grid/AppFindOrdinary',
                                p: {
                                    id: 'cs1.cs2',
                                    map_fo_search: true
                                }
                            },
                            {
                                t: 'MapComponent/newMap/grid/AppFindAdvanced',
                                p: {
                                    id: 'cs1.cs3',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/newMap/grid/AppFindAdvancedItem',
                                                p: {
                                                    id: 'cs1.cs3.cs1'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/newMap/grid/AppFindAdvancedItem',
                                                p: {
                                                    id: 'cs1.cs3.cs2',
                                                    map_fa_type: 'date'
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                t: 'MapComponent/newMap/grid/AppGridTitle',
                                p: {
                                    id: 'cs1.cs4',
                                    map_gt_txt: '列表'
                                }
                            },
                            {
                                t: 'MapComponent/newMap/grid/AppGridView',
                                p: {
                                    id: 'cs1.cs5',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/newMap/grid/AppGridViewItem',
                                                p: {
                                                    id: 'cs1.cs5.cs1',
                                                    map_gvi_selected: true
                                                }
                                            },
                                            {
                                                t: 'MapComponent/newMap/grid/AppGridViewItem',
                                                p: {
                                                    id: 'cs1.cs5.cs2'
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                t: 'MapComponent/newMap/grid/AppGridMenu',
                                p: {
                                    id: 'cs1.cs6',
                                    p: {
                                        components: [
                                            {
                                                t: 'MapComponent/newMap/grid/AppGridMenuLeft',
                                                p: {
                                                    id: 'cs1.cs6.cs1'
                                                }
                                            },
                                            {
                                                t: 'MapComponent/newMap/grid/AppGridMenuRight',
                                                p: {
                                                    id: 'cs1.cs6.cs2',
                                                    p: {
                                                        components: [
                                                            {
                                                                t: 'MapComponent/newMap/grid/AppGridMenuItemButton',
                                                                p: {
                                                                    id: 'cs1.cs6.cs2.cs1'
                                                                }
                                                            },
                                                            {
                                                                t: 'MapComponent/newMap/grid/AppGridMenuItemDropdown',
                                                                p: {
                                                                    id: 'cs1.cs6.cs2.cs2'
                                                                }
                                                            },
                                                            {
                                                                t: 'MapComponent/newMap/grid/AppGridMenuItemSwitch',
                                                                p: {
                                                                    id: 'cs1.cs6.cs2.cs3'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            {
                t: 'MapComponent/newMap/form/base/AppFormContainer',
                p: {
                    name: '表单',
                    w: 600,
                    h: 400,
                    type: 'base',
                    p: {
                        components: [
                            {
                                t: 'MapComponent/newMap/form/AppForm',
                                p: {
                                    id: 'cs1.cs1',
                                    p: {
                                        components: [{
                                            t: 'MapComponent/newMap/form/TabForm',
                                            p: {
                                                id: 'cs1.cs1.cs1',
                                                l: 197,
                                                t: 132,
                                                p: {
                                                    components: [{
                                                        t: 'MapComponent/newMap/form/TabItem',
                                                        p: {
                                                            id: 'cs1.cs1.cs1.cs1',
                                                            l: 197,
                                                            t: 132,
                                                            p: {
                                                                components: [{
                                                                    t: 'MapComponent/newMap/form/SectionForm',
                                                                    p: {
                                                                        id: 'cs1.cs1.cs1.cs1.cs1',
                                                                        l: 197,
                                                                        t: 132,
                                                                        p: {
                                                                            components: [{
                                                                                t: 'MapComponent/newMap/form/Section',
                                                                                p: {
                                                                                    id: 'cs1.cs1.cs1.cs1.cs1.cs1',
                                                                                    l: 197,
                                                                                    t: 132,
                                                                                    p: {
                                                                                        components: [{
                                                                                            t: 'MapComponent/newMap/form/field/InputField',
                                                                                            p: {
                                                                                                id: 'cs1.cs1.cs1.cs1.cs1.cs1.cs1',
                                                                                                l: 197,
                                                                                                t: 132,
                                                                                                map_form_f_cols: 1
                                                                                            }
                                                                                        }]
                                                                                    }
                                                                                }
                                                                            }]
                                                                        }
                                                                    }
                                                                }]
                                                            }
                                                        }
                                                    }]
                                                },
                                                map_form_sti: 'cs1.cs1.cs1.cs1',
                                                map_form_st: '2'
                                            }
                                        }]
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        ]
    },
    {
        category: '新采招页面(试用)',
        categoryKey: 'newCgztb',
        expanded: false,
        components: []
    }
];

const sourceList: IsourceList = {
    componentMode: {
        page: 'page',
        map: 'map',
        table: 'table',
        image: 'image',
        psps: 'psps'
    },

    components: {
        page: basePage
    }
};

export default sourceList;
