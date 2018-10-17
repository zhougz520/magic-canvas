export const gridDetail = {
    p: {
        components: [
            {
                t: 'MapComponent/newMap/grid/AppProjectTree',
                p: {
                    id: '[cid].cs1',
                    map_pt_txt: '公司'
                }
            },
            {
                t: 'MapComponent/newMap/grid/AppFindOrdinary',
                p: {
                    id: '[cid].cs2',
                    map_fo_search: true
                }
            },
            {
                t: 'MapComponent/newMap/grid/AppFindAdvanced',
                p: {
                    id: '[cid].cs3'
                }
            },
            {
                t: 'MapComponent/newMap/grid/AppGridTitle',
                p: {
                    id: '[cid].cs4',
                    map_gt_txt: '列表'
                }
            },
            {
                t: 'MapComponent/newMap/grid/AppGridView',
                p: {
                    id: '[cid].cs5'
                }
            },
            {
                t: 'MapComponent/newMap/grid/AppGridMenu',
                p: {
                    id: '[cid].cs6',
                    p: {
                        components: [
                            {
                                t: 'MapComponent/newMap/grid/AppGridMenuLeft',
                                p: {
                                    id: '[cid].cs6.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/newMap/grid/AppGridMenuRight',
                                p: {
                                    id: '[cid].cs6.cs2'
                                }
                            }
                        ]
                    }
                }
            },
            {
                t: 'MapComponent/newMap/grid/AppGrid',
                p: {
                    id: '[cid].cs7'
                }
            },
            {
                t: 'MapComponent/newMap/grid/AppGridPage',
                p: {
                    id: '[cid].cs8'
                }
            }
        ]
    }
};
