import * as React from 'react';

import { IBaseProps } from '../../IBaseProps';
import { IBaseState } from '../../IBaseState';
import { MapComponent } from '../../MapComponent';

import { Button, Icon, Input, Select } from 'antd';

// tslint:disable-next-line:no-empty-interface
export interface IAppGridPageProps extends IBaseProps {
}

// tslint:disable-next-line:no-empty-interface
export interface IAppGridPageState extends IBaseState {
}

/* tslint:disable:jsx-no-multiline-js jsx-no-lambda no-string-literal */
export class AppGridPage extends MapComponent<IAppGridPageProps, IAppGridPageState> {
    constructor(props: IAppGridPageProps, context?: any) {
        super(props, context);

        this.state = {
            hidden: false
        };
    }

    render() {
        return (
            <div className="map-simple-pager">
                <div className="el-pagination">
                    <div className="el-pagination__rightwrapper">
                        <Button type="default">
                            <Icon type="left" style={{ color: 'rgb(228, 228, 228)' }} />
                        </Button>
                        <ul className="el-pager" />
                        <Button type="default">
                            <Icon type="right" style={{ color: 'rgb(228, 228, 228)' }} />
                        </Button>
                        <span className="el-pagination__jump">
                            到第
                            <Input defaultValue="1" />
                            页
                        </span>
                    </div>
                    <span className="el-pagination__total">共 0 条</span>
                    <span className="el-pagination__sizes">
                        <Select defaultValue="0">
                            <Select.Option value="0">20 条/页</Select.Option>
                            <Select.Option value="1">50 条/页</Select.Option>
                            <Select.Option value="2">100 条/页</Select.Option>
                            <Select.Option value="3">200 条/页</Select.Option>
                        </Select>
                    </span>
                </div>
            </div>
        );
    }
}
