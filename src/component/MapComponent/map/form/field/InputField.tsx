import * as React from 'react';
import { MapComponent, IBaseProps } from '../../../index';
import { Input } from 'antd';
import { MaskLayer } from '../../../../BaseComponent/mask/MaskLayer';
import * as DragStyle from '../../DragStyle';
import { getStateClass, getFieldCommonPropertyList } from './common/util';
import { IPropertyGroup, IProperty } from '../../../../UniversalComponents';

import { OrderedSet, List } from 'immutable';

// tslint:disable:indent
// tslint:disable:jsx-no-multiline-js
export interface IMapProps extends IBaseProps {
	map_form_f_title: string;
	map_form_f_default: string;
	map_form_f_state: string;
	map_form_f_cols: number;
	map_form_f_disabled: boolean;
	map_form_f_hidden_t: boolean;
	map_form_f_type: string;
	titleWidth: number;
	unit: number;
	currUnit: number;
	index: number;
}

export class InputField extends MapComponent<IMapProps, any> {
	static defaultProps = {
		map_form_f_title: '字段',
		map_form_f_default: '',
		map_form_f_state: '0',
		map_form_f_cols: 1,
		map_form_f_disabled: false,
		map_form_f_hidden_t: true,
		titleWidth: 110,
		unit: 1,
		currUnit: 2,
		map_form_f_type: 'MapComponent/map/form/field/InputField'
	};

	public resizing = false;
	public mousePosition = {
		x: 0
	};
	public startW = 0;
	public dragWidth: HTMLElement | null = null;

	constructor(props: any, context?: any) {
		super(props, context);

		this.state = {
			currX: 0,
			resizing: false,
			hover: {},
			value: undefined
		};
	}
	public getItemStyle = (draggableStyle: any, isDragging: any) => ({
		// change background colour if dragging
		background: isDragging ? DragStyle.BaseDragStyle.background : '',

		// styles we need to apply on draggables
		...draggableStyle
	})

	/**
	 * 获取组件属性列表
	 */
	public getPropertiesToProperty = (): OrderedSet<IPropertyGroup> => {
		let propertyList: List<IProperty> = List();
		let propertyGroup: OrderedSet<IPropertyGroup> = OrderedSet();
		propertyList = getFieldCommonPropertyList(this.props);
		// 组件属性整理
		propertyGroup = propertyGroup.add(
			{ groupTitle: '组件属性', groupKey: 'mapProps', isActive: true, colNum: 1, propertyList }
		);
		propertyList = List();

		return propertyGroup;
	}

	/**
	 * 获取组件文本
	 */
	public getRichChildNode = (): any => {
		return this.props.map_form_f_title;
	}

    /**
     * 构建要设置的文本属性对象
     */
	public buildRichChildNode = (value: any): any => {
		const obj: any = {};
		obj.map_form_f_title = value;

		return obj;
	}

	public render() {
		const {
			map_form_f_title,
			map_form_f_default,
			id,
			titleWidth,
			map_form_f_disabled,
			currUnit,
			selectedId,
			map_form_f_hidden_t,
			map_form_f_state,
			map_form_f_cols
		} = this.props;
		const {
			hover,
			value
		 } = this.state;
		const stateClass = getStateClass(map_form_f_state);
		let borderClass = '';
		if (map_form_f_disabled) {
			borderClass = ' read-only';
		}
		console.log('aaaa', map_form_f_default, value)

		return (
			<div
				ref={(ref) => this.com = ref}
				style={Object.assign({}, { width: `${((map_form_f_cols / currUnit) * 100).toFixed(2)}%` }, hover)}
				className={`field-bar `}
				onMouseDown={this.selectedCom}
				draggable
				onDragOver={this.handleFieldOver}
				// onDragOver={this.onDrageOver}
				onDragLeave={this.handleLeave}
				onDragEnd={this.handleLeave}
			>
				<MaskLayer id={id} />
				<table className={`field-tb ${selectedId === id ? 'map-selected' : ''}`}>
					<tbody>
						<tr>
							<td className={`field-title ${map_form_f_hidden_t ? '' : 'bar-hide'}`} style={{ width: titleWidth + 'px' }}>
								{map_form_f_title}
							</td>
							<td className="field-content">
								<div className="flex-row">
									<span className={`${stateClass}`} style={{ display: `${map_form_f_state === '1' ? 'block' : 'none'}`, marginRight: '2px' }}>*</span>
									<Input
										type="text"
										className={map_form_f_disabled ? borderClass : ''}
										placeholder=""
										onChange={this.onChangeText}
										disabled={map_form_f_disabled}
										defaultValue={map_form_f_default}
										value={value === undefined ? map_form_f_default : value}
									/>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}

	private onChangeText = (e: any) => {
		this.setState({
			value: e.target.value
		});
	}
}
