/**
 * TODO: 注释
 */
export interface ISize {
    width: number;
    height: number;
}

/**
 * TODO：注释
 * 绝对定位： left, top 对应 postion: absoult | relative
 * 相对定位：对应 margin
 */
export interface IPostion {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}
