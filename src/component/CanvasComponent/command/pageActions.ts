export const pageActions = {
    bind(ins: any) {
        for (const key in this) {
            if (key !== 'bind') {
                ins[key] = (this as any)[key].bind(ins);
            }
        }
    },

    // 添加批注
    addComments(aa: string) {
        // tslint:disable-next-line:no-console
        console.log('添加批注：' + aa);
    }
};
