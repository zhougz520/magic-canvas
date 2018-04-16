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
        expanded: true,
        components: [
            // TODO: 此处暂时以此方式设置组件初始宽高，之后由周周再修改
            { t: 'BaseComponent/demo/Demo', p: { name: 'demo', w: 100, h: 100 } }
        ]
    },
    {
        category: '基础组件',
        categoryKey: 'basic',
        expanded: false,
        components: [
            { t: 'UniversalComponents/Button/Button', p: { name: 'button', w: 80, h: 22 } },
            { t: 'UniversalComponents/Hyperlink/Hyperlink', p: { name: 'hyperlink', w: 120, h: 30 } },
            { t: 'UniversalComponents/Selector/Selector', p: { name: 'selector', w: 120, h: 30 } },
            { t: 'UniversalComponents/Input/Input', p: { name: 'input', w: 180, h: 30 } },
            { t: 'UniversalComponents/TextField/TextField', p: { name: 'textarea', w: 280, h: 73 } },
            { t: 'UniversalComponents/Radio/Radio', p: { name: 'radio', w: 260, h: 40 } },
            { t: 'UniversalComponents/CheckBox/CheckGroup', p: { name: 'checkbox', w: 460, h: 40 } }

        ]
    },
    {
        category: 'ERP页面',
        categoryKey: 'erp',
        expanded: false,
        components: [
            // TODO: 此处暂时以此方式设置组件初始宽高，之后由周周再修改
            { t: 'MapComponent/demo/BtnChildDemo', p: { name: 'BtnChildDemo', w: 100, h: 100 } }
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
        components: []
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
