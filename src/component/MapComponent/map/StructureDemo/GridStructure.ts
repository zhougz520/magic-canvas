export const GridDetail = {
    p: {
        components: [
            {
                t: 'MapComponent/map/grid/ProjectDDTree',
                p: {
                    id: '[cid].cs1'
                }
            },
            {
                t: 'MapComponent/map/grid/AppView',
                p: {
                    id: '[cid].cs2'
                }
            },
            {
                t: 'MapComponent/map/grid/AppFind',
                p: {
                    id: '[cid].cs3'
                }
            },
            {
                t: 'MapComponent/map/grid/AppGridMenu',
                p: {
                    id: '[cid].cs4',
                    p: {
                        components: [
                            {
                                t: 'MapComponent/map/grid/AppGridMenuItem',
                                p: {
                                    id: '[cid].cs4.cs1',
                                    map_mi_txt: '新增'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppGridMenuItem',
                                p: {
                                    id: '[cid].cs4.cs2',
                                    map_mi_txt: '删除'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppGridMenuItem',
                                p: {
                                    id: '[cid].cs4.cs3',
                                    map_mi_sa: true
                                }
                            }
                        ]
                    }
                }
            },
            {
                t: 'MapComponent/map/grid/AppGrid',
                p: {
                    id: '[cid].cs7',
                    p: {
                        components: [
                            {
                                t: 'MapComponent/map/grid/AppGridHeader',
                                p: {
                                    id: '[cid].cs7.cs1'
                                }
                            },
                            {
                                t: 'MapComponent/map/grid/AppGridContent',
                                p: {
                                    id: '[cid].cs7.cs2'
                                }
                            }
                        ]
                    }
                }
            }
        ]
    }
};
