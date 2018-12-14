import { Map } from 'immutable';

/**
 * const
 */
export enum PluginMap {
    IMAGE_ASYNC_LOAD_FUNC = 'IMAGE_ASYNC_LOAD_FUNC',                // 通过uid加载图片dataUrl
    PASTE_IMAGE_FUNC = 'PASTE_IMAGE_FUNC',                          // 粘贴图片
    OPEN_TEMPLATE_FUNC = 'OPEN_TEMPLATE_FUNC',                      // 加载模版
    PDU_SHOW_MODAL = 'PDU_SHOW_MODAL'                               // 调用PDU弹窗
}

let __config: Map<string, any> = Map();

export const addPluginConfig = (key: string, config: any) => {
    __config = __config.set(key, config);
};

export const getPluginConfig = (key: string) => {
    return __config.get(key);
};
