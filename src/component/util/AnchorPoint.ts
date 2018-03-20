export interface IAnchor {
    key: string;
    x: number;
    y: number;
    offset: number;
}

/**
 * 统计8个定位点
 */
export const countAnchorPoint = (pointX: number, pointY: number, width: number, height: number, offset: number = 4) => {
    const anchorList: IAnchor[] = [];
    anchorList.push({ key: 'ul', offset, x: pointX, y: pointY });   // 左上
    anchorList.push({ key: 'ml', offset, x: pointX, y: pointY + height / 2 });   // 左中
    anchorList.push({ key: 'bl', offset, x: pointX, y: pointY + height });   // 左下
    anchorList.push({ key: 'um', offset, x: pointX + width / 2, y: pointY });   // 上中
    anchorList.push({ key: 'ur', offset, x: pointX + width, y: pointY }); // 右上
    anchorList.push({ key: 'mr', offset, x: pointX + width, y: pointY + height / 2 });  // 右中
    anchorList.push({ key: 'br', offset, x: pointX + width, y: pointY + height });   // 右下
    anchorList.push({ key: 'bm', offset, x: pointX + width / 2, y: pointY + height });   // 下中

    return anchorList;
};

/**
 * 计算当前点所在的定位点的方位
 */
export const findAnchorPoint = (currentX: number, currentY: number, anchorList: IAnchor[]): IAnchor | null => {
    let currentAnchor = null;
    anchorList.map((anchor) => {
        const offsetX = currentX - anchor.x;
        const offsetY = currentY - anchor.y;
        if (Math.abs(offsetX) <= anchor.offset && Math.abs(offsetY) <= anchor.offset) {
            currentAnchor = anchor;
        }
    });

    return currentAnchor;
};
