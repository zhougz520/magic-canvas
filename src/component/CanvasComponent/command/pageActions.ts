export const pageActions = {
    bind(ins: any) {
        for (const key in this) {
            if (key !== 'bind') {
                ins[key] = (this as any)[key].bind(ins);
            }
        }
    },

    // 获得当前绑定的this
    getThis() {
        return (this as any);
    },

    // 添加批注
    addComments() {
        const stageSize = this.getThis().props.getStageSize();
        if (stageSize === undefined) {
            return;
        }

        const data = {
            offset: {x: 0, y: 0},
            props: {name: '批注', w: 204, h: 170},
            type: 'Comments/Comments'
        };
        const position = {
            x: Math.ceil(stageSize.width / 2 - data.props.w / 2),
            y: Math.ceil(stageSize.height / 2 - data.props.h / 2)
        };

        this.getThis().addCancasComponent(data, position);
    }
};
