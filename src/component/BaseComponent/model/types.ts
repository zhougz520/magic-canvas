/**
 * 组件大小
 * width(宽)|height(高)
 */
export interface ISize {
    width: number;
    height: number;
}

/**
 * 组件位置
 * left(左)|right(右)|top(上)|bottom(下)
 * 绝对定位： left, top 对应 postion: absoult | relative
 * 相对定位：对应 margin
 */
export interface IPostion {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
