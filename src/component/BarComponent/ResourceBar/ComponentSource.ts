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
        components: []
    },
    {
        category: 'ERP页面',
        categoryKey: 'erp',
        expanded: false,
        components: []
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
