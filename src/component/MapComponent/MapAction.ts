
export const MapAction: any = {
    bind(ins: any) {
        for (const key in this) {
            if (key !== 'bind') {
                ins[key] = this[key].bind(ins);
            }
        }
    },
    updateData(state: any) {
        if (this.state.updateData !== undefined) {
            this.state.updateData(this.props.id, state);
        }
    },
    addChildComponent(addData: any) {
        const { data } = this.state;
        const childId: string = this.newComponentsId(data.p.components, `${data.id}.cs`);
        data.p.components.push({
            t: addData.type,
            p: Object.assign({}, addData.props, { id: childId, txt_v: 'test' })
        });
        this.setState({
            data
        });
    },
    newComponentsId(collection: any[], prefix = 'cs', pid = '') {
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
};
