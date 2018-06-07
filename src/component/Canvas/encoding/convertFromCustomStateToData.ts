/**
 * 把customState转译成保存的jsonData，组件可以自己实现逻辑。
 * 自己实现的函数名为：convertFromCustomStateToData，定义在组件同一个文件下。
 * @param customState 组件的customState
 * @param comPath 组件路径
 */
export const convertFromCustomStateToData = (customState: any, comPath: string): any => {
    let customData: any;
    const convertFromCustomStateToDataFun = require(`../../${comPath}`).convertFromCustomStateToData;
    if (convertFromCustomStateToDataFun) {
        customData = convertFromCustomStateToDataFun(customState);
    } else {
        customData = customState && customState.toJS ? customState.toJS() : customState;
    }

    return customData;
};
