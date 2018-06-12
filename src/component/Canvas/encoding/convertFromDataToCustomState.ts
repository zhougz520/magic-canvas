import { fromJS } from 'immutable';

/**
 * 把customState保存的jsonData转译成customState，组件可以自己实现逻辑。
 * 自己实现的函数名为：convertFromDataToCustomState，定义在组件同一个文件下。
 * @param customData 组件的customState保存的jsonData
 * @param comPath 组件路径
 */
export const convertFromDataToCustomState = (customData: any, comPath: string): any => {
    let customState: any;
    const convertFromDataToCustomStateFun = require(`../../${comPath}`).convertFromDataToCustomState;
    if (convertFromDataToCustomStateFun) {
        customState = convertFromDataToCustomStateFun(customData);
    } else {
        customState = fromJS(customData);
    }

    return customState;
};
