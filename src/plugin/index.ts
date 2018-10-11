import { Map } from 'immutable';

/**
 * const
 */
export enum PluginMap {
    IMAGE_ASYNC_LOAD_FUNC = 'IMAGE_ASYNC_LOAD_FUNC',                // 通过uid加载图片dataUrl
    PASTE_IMAGE_FUNC = 'PASTE_IMAGE_FUNC',                          // 粘贴图片
    OPEN_COMMENTSTEMPLATE_FUNC = 'OPEN_COMMENTSTEMPLATE_FUNC'       // 加载批注模版
}

let __config: Map<string, any> = Map();

export const addPluginConfig = (key: string, config: any) => {
  __config = __config.set(key, config);
};

export const getPluginConfig = (key: string) => {
    return __config.get(key);
};
