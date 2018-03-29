export interface IAnchor {
    cid: string;
    key: string;
    x: number;
    y: number;
    offset: number;
    cursor: string;
}

/**
 * 统计8个定位点
 */
export const countAnchorPoint = (cid: string, pointX: number, pointY: number, width: number, height: number,
                                 offset: number = 4) => {
    const anchorList: IAnchor[] = [];
    anchorList.push({ cid, key: 'ul', offset, x: pointX, y: pointY, cursor: 'nw-resize' });   // 左上
    anchorList.push({ cid, key: 'ml', offset, x: pointX, y: pointY + height / 2, cursor: 'ew-resize' });   // 左中
    anchorList.push({ cid, key: 'bl', offset, x: pointX, y: pointY + height, cursor: 'ne-resize' });   // 左下
    anchorList.push({ cid, key: 'um', offset, x: pointX + width / 2, y: pointY, cursor: 'ns-resize' });   // 上中
    anchorList.push({ cid, key: 'ur', offset, x: pointX + width, y: pointY, cursor: 'ne-resize' }); // 右上
    anchorList.push({ cid, key: 'mr', offset, x: pointX + width, y: pointY + height / 2, cursor: 'ew-resize' });  // 右中
    anchorList.push({ cid, key: 'br', offset, x: pointX + width, y: pointY + height, cursor: 'nw-resize' });   // 右下
    anchorList.push({ cid, key: 'bm', offset, x: pointX + width / 2, y: pointY + height, cursor: 'ns-resize' });   // 下中

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
        // 由于鼠标悬停的范围大2px
        if (Math.abs(offsetX) <= anchor.offset + 1 && Math.abs(offsetY) <= anchor.offset + 1) {
            currentAnchor = anchor;
        }
    });

    return currentAnchor;
};
