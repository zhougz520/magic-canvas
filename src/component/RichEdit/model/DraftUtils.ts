import { DraftPublic } from 'xprst-draft';
const { FbjsUtils, DefaultDraftBlockStyle } = DraftPublic;
const { cx } = FbjsUtils;

import { Map, List } from 'immutable';

export function blockStyleFn(block: any): string {
    const blockAlignment = block.getData() && block.getData().get('text-align');
    const styleULType = block.getData() && block.getData().get('unordered-list-item');
    const styleOLType = block.getData() && block.getData().get('ordered-list-item');

    return getListItemClasses(blockAlignment, styleULType === undefined ? styleOLType : styleULType);
}

export function getListStyleTypeMap(): Map<string, List<string>> {
    return DefaultDraftBlockStyle.listStyleTypeMap;
}

function getListItemClasses(align: string | undefined, styleType: string | undefined) {
    return cx({
        'block-aligned-center': align === 'center',
        'block-aligned-justify': align === 'justify',
        'block-aligned-right': align === 'right',
        'block-aligned-left': align === 'left',
        'unordered-list-item-image': styleType === 'image',
        'unordered-list-item-disc': styleType === 'disc',
        'unordered-list-item-circle': styleType === 'circle',
        'unordered-list-item-square': styleType === 'square',
        'ordered-list-item-decimal': styleType === 'decimal',
        'ordered-list-item-lower-alpha': styleType === 'lower-alpha',
        'ordered-list-item-lower-roman': styleType === 'lower-roman'
    });
}
