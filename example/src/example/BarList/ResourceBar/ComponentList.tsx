import * as React from 'react';
import { Collapse } from 'antd';
import sourceList, { IBasePage } from './ComponentSource';
import ComponentItem from './ComponentItem';

export interface IComListProps {
    mapMenuType: string;
    componentMode: string;
}

export interface IComListState {
    [key: string]: any;
}

export default class ComponentList extends React.PureComponent<IComListProps, IComListState> {
    constructor(props: IComListProps) {
        super(props);
    }

    render() {
        const { componentMode } = this.props;
        const Panel = Collapse.Panel;

        if (componentMode === sourceList.componentMode.table) {
            // tslint:disable-next-line:jsx-self-close
            return <div className="component-list"></div>;
        }
        const components = sourceList.components[componentMode];
        const panels: any = [];
        const activeKeys: string[] = [];

        // TODO: 暂时只处理page
        if (componentMode === 'page') {
            components.forEach((item: IBasePage) => {
                const componentItems = item.components.map((com) => {
                    // tslint:disable-next-line:jsx-wrap-multiline
                    return <ComponentItem
                        key={`${com.t}_${com.at || ''}`}
                        componentType={com.t}
                        componentAdderType={com.at}
                        componentProps={com.p}
                        children={com.children}
                    />;
                });
                panels.push(
                    <Panel header={item.category} key={item.categoryKey}>
                        <ul className="rUl">
                            {componentItems}
                        </ul>
                    </Panel>
                );
                if (item.expanded) activeKeys.push(item.categoryKey);
            });
        }

        return (
            <div className="component-list">
                <Collapse bordered={false} defaultActiveKey={activeKeys}>
                    {panels}
                </Collapse>
            </div>
        );
    }
}
