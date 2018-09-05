/* tslint:disable:no-console */
export const GlobalUtil = {
    isUndefined: (variable: any): boolean => {
        if (variable === undefined || variable == null) return true;

        return false;
    },
    isEmptyString: (variable: any): boolean => {
        if (variable === undefined || variable == null) return true;

        return (variable.length === 0);
    },
    getDomLocation: (dom: HTMLElement): any => {
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
    debugLog: (e: any, title: string): void => {
        console.log(title);
        console.log(e);
    },
    getCookie: (name: string): string => {
        if (document.cookie.length > 0) {
            let start: number = document.cookie.indexOf(name + '=');
            if (start !== -1) {
                start = start + name.length + 1;
                let end: number = document.cookie.indexOf(';', start);
                if (end === -1) end = document.cookie.length;

                return unescape(document.cookie.substring(start, end));
            }
        }

        return '';
    },
    fromImmutableToJs: (data: any): any => {
        return data && data.toJS ? data.toJS() : data;
    }
};
