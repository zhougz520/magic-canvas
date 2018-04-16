export interface IUtil {
    componentsType: (csType: string) => any;
    isUndefined: (variable: any) => boolean;
    isEmptyString: (variable: any) => boolean;
    getDomLocation: (dom: HTMLElement) => any;
    containClassName: (dom: HTMLElement, target: string) => boolean;
}

const util: IUtil = {
    componentsType: (csType: string) => {
        return require(`../${csType}`).default;
        // return require(`../BaseComponent/demo/${csType}`).default;
    },
    isUndefined: (variable: any) => {
        if (variable === undefined || variable == null) return true;

        return false;
    },
    isEmptyString: (variable: any) => {
        if (variable === undefined || variable == null) return true;

        return (variable.length === 0);
    },
    getDomLocation: (dom: HTMLElement) => {
        if (dom === undefined || dom == null) return undefined;
        let offsetTop = dom.offsetTop;
        let offsetLeft = dom.offsetLeft;
        let offsetTopWithScroll = offsetTop;
        let offsetLeftWithScroll = offsetLeft;
        let offsetParent = dom.offsetParent as HTMLElement;
        while (offsetParent !== undefined && offsetParent !== null) {
            offsetTop += offsetParent.offsetTop;
            offsetLeft += offsetParent.offsetLeft;
            offsetTopWithScroll += offsetParent.offsetTop - offsetParent.scrollTop;
            offsetLeftWithScroll += offsetParent.offsetLeft - offsetParent.scrollLeft;
            offsetParent = offsetParent.offsetParent as HTMLElement;
        }

        return {
            top: offsetTop,
            left: offsetLeft,
            topWithScroll: offsetTopWithScroll,
            leftWithScroll: offsetLeftWithScroll,
            width: dom.offsetWidth,
            height: dom.offsetHeight,
            scrollWidth: dom.scrollWidth, // 有滚动条时的实际宽度
            scrollHeight: dom.scrollHeight  // 有滚动条时的实际高度
        };
    },
    containClassName: (dom: HTMLElement, target: string) => {
        let hasFind = dom.className === target;
        let offsetParent = dom.offsetParent as HTMLElement;
        while (!hasFind && offsetParent !== undefined && offsetParent !== null) {
            hasFind = offsetParent.className === target;
            offsetParent = offsetParent.offsetParent as HTMLElement;
        }

        return hasFind;
    }
};

export default util;
