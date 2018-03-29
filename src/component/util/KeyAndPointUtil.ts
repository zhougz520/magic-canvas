import * as keycode from 'keycode';

export interface IKeyArgs {
    key: string;
    keyCode: number;
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    target: object;
    targetName: string;
}

export interface IPointerArgs {
    pageX: number;
    pageY: number;
    keyArgs: IKeyArgs | undefined;
}

export const keyArgs = (evt: any): undefined | IKeyArgs => {
    return evt === undefined ? undefined : {
        key: keycode(evt),
        keyCode: evt.keyCode,
        ctrl: /mac os x/i.test(navigator.userAgent) ? evt.metaKey : evt.ctrlKey,
        shift: evt.shiftKey,
        alt: evt.altKey,
        target: evt.target,
        targetName: (evt.target === undefined || evt.target.tagName === undefined) ?
            undefined : evt.target.tagName.toLowerCase()
    };
};

export const pointerArgs = (e: any): undefined | IPointerArgs => {
    return e === undefined ? undefined : {
        pageX: e.pageX as number,
        pageY: e.pageY as number,
        keyArgs: keyArgs(e)
    };
};
