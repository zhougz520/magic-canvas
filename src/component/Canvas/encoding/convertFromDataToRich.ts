/**
 * 把richChildNode保存的jsonData转译成richChildNode，组件可以自己实现逻辑。
 * 自己实现的函数名为：convertFromDataToRich，定义在组件同一个文件下。
 * @param richChildData 组件的richChildNode保存的jsonData
 * @param comPath 组件路径
 */
export const convertFromDataToRich = (richChildData: any, comPath: string): any => {
    let richChildNode: any;
    const convertFromDataToRichFun = require(`../../${comPath}`).convertFromDataToRich;
    if (convertFromDataToRichFun) {
        richChildNode = convertFromDataToRichFun(richChildData);
    } else {
        richChildNode = richChildData;
    }

    return richChildNode;
};
