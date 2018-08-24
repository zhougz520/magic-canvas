import { Map } from 'immutable';

/**
 * const
 */
export enum PluginMap {
    IMAGE_ASYNC_LOAD_FUNC = 'IMAGE_ASYNC_LOAD_FUNC',    // 通过uid加载图片dataUrl
    PASTE_IMAGE_FUNC = 'PASTE_IMAGE_FUNC',              // 粘贴图片
    AFTER_CANVASSIZE_FUNC = 'AFTER_CANVASSIZE_FUNC'     // 修改画布大小后触发
}

let __config: Map<string, any> = Map();

export const addPluginConfig = (key: string, config: any) => {
  __config = __config.set(key, config);
};

export const getPluginConfig = (key: string) => {
    return __config.get(key);
};
