/**
 * 把richChildNode转译成保存的jsonData，组件可以自己实现逻辑。
 * 自己实现的函数名为：convertFromRichToData，定义在组件同一个文件下。
 * @param richChildNode 组件的richChildNode
 * @param comPath 组件路径
 */
export const convertFromRichToData = (richChildNode: any, comPath: string): any => {
    let richChildData: any;
    const convertFromRichToDataFun = require(`../../${comPath}`).convertFromRichToData;
    if (convertFromRichToDataFun) {
        richChildData = convertFromRichToDataFun(richChildNode);
    } else {
        richChildData = richChildNode;
    }

    return richChildData;
};
