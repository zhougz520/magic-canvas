import * as React from 'react';

import { IComponent } from './IComponent';
import { IBaseProps } from './IBaseProps';

/**
 * 基类
 * 所有基础组件继承于该类
 * 实现接口IComponent定义的所有方法，提供给外部调用
 */
export class MapComponent<P extends IBaseProps, S>
    extends React.PureComponent<P, S> implements IComponent {

    public addChildComponent = (data: any, addData: any): any => {
        // (this.state as any).data1;
        const childId: string = this.newComponentsId(data.p.components, `${data.id}.cs`);
        data.p.components.push({
            t: addData.type,
            p: Object.assign({}, addData.props, { id: childId, txt_v: 'test' })
        });

        return data;
    }

    public deleteComponentsById = (cid: string): any => {

        return cid;
    }

    public newComponentsId(collection: any[], prefix = 'cs', pid = '') {
        const ids: number[] = [];
        collection.forEach((cs: any) => {
            ids.push(parseInt(cs.p.id.replace(prefix, ''), undefined));
        });
        if (ids.length === 0) {
            return `${pid === '' ? '' : `${pid}.`}${prefix}1`;
        } else {
            ids.sort((a: any, b: any) => a - b);

            return `${pid === '' ? '' : `${pid}.`}${prefix}${ids[ids.length - 1] + 1}`;
        }
    }
}
