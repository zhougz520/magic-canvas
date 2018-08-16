import { Map } from 'immutable';

/**
 * const
 */
export enum PluginMap {
    IMAGE_ASYNC_LOAD_FUNC = 'IMAGE_ASYNC_LOAD_FUNC',
    PASTE_IMAGE_FUNC = 'PASTE_IMAGE_FUNC'
}

let __config: Map<string, any> = Map();

export const addPluginConfig = (key: string, config: any) => {
  __config = __config.set(key, config);
};

export const getPluginConfig = (key: string) => {
    return __config.get(key);
};
