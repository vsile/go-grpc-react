import React from 'react';
import ReactDOM from 'react-dom';
import { ClientRequest, Empty, ServerReply, ServerReplyList } from './main_pb.js';
import { MainProtoClient } from './main_grpc_web_pb.js';

class Body extends React.Component {
	constructor() {
		super();
		this.state = {
			tableBody: data
		};
		const host = location.hostname == 'localhost' ? 'localhost' : '172.18.0.10';
		this.client = new MainProtoClient('http://' + host + ':8080'); //Envoy-proxy

		this.getRecords = this.getRecords.bind(this);
		this.addNewRecord = this.addNewRecord.bind(this);
		this.removeRecord = this.removeRecord.bind(this);
		this.updateRecord = this.updateRecord.bind(this);
		this.createTableBody = this.createTableBody.bind(this);
	}
	//Получаем все записи из базы
	getRecords() {
		this.client.getRecords(new Empty(), {}, (err, response) => {
			// GetRecords => getRecords
			const tb = [];
			response.getRecordsList().map(item => {
				const record = {
					Id: item.getId(),
					ManufacturerId: item.getManufacturerId(),
					VendorCode: item.getVendorCode(),
					CreatedAt: item.getCreatedAt().getSeconds() * 1000,
					DeletedAt: item.getDeletedAt().getSeconds() * 1000
				};
				tb.push(record);
			});
			this.setState({
				tableBody: tb
			});
		});
	}
	// Добавляем новую строку в таблицу
	addNewRecord() {
		this.client.addRecord(new Empty(), {}, (err, response) => {
			if (err != null) {
				alert(err.message);
				return;
			}
			const newRow = {
				Id: response.getId(),
				ManufacturerId: 0,
				VendorCode: '',
				CreatedAt: response.getCreatedAt().getSeconds() * 1000,
				DeletedAt: 0
			};
			this.setState({
				tableBody: [...this.state.tableBody, newRow]
			});
		});
	}
	// Удаляем строку из таблицы
	removeRecord(id, i) {
		const newRequest = new ClientRequest();
		newRequest.setId(id); // Включаем в запрос идентификатор записи, которую хоим удалить
		this.client.removeRecord(newRequest, {}, (err, response) => {
			// RemoveRecord => removeRecord
			if (err != null) {
				alert(err.message);
				return;
			}
			const tb = [...this.state.tableBody];
			tb.splice(i, 1);
			this.setState({
				tableBody: tb
			});
		});
	}
	// Редактируем ячейку в таблице
	updateRecord(e, id, i, key, field) {
		const newRequest = new ClientRequest(),
		      value = e.target.value,
		      type = e.target.type;
		if (type == 'number' && value > 2147483647) return;

		// Чтобы курсор не перескакивал в конец строки, размещаем setState вне updateRecord-функции
		const tb = [...this.state.tableBody];
		tb[i][key] = value;
		this.setState({
			tableBody: tb
		});

		newRequest.setId(id); // Включаем в запрос идентификатор записи, в которую вносим изменения
		newRequest.setField(field); // Включаем в запрос имя изменяемого поля
		newRequest.setMethod(key); // Включаем в запрос метод, соответствующий изменяемому полю
		newRequest['set' + key](value), // Включаем в запрос значение изменяемой ячейки
		this.client.updateRecord(newRequest, {}, (err, response) => {
			// UpdateRecord => updateRecord
			if (err != null) {
				alert(err.message);
				//location.href = location.href;
				this.getRecords();
			}
		});
	}

	formatDate(isoDate) {
		const t = new Date(isoDate);
		if (t <= new Date(0)) return '-';
		return t.toLocaleString('ru-RU');
	}

	createTableBody(item, i) {
		return React.createElement(
			'tr',
			null,
			React.createElement(
				'td',
				null,
				item.Id
			),
			React.createElement(
				'td',
				null,
				React.createElement('input', { min: '0', type: 'number', onChange: e => this.updateRecord(e, item.Id, i, 'ManufacturerId', 'manufacturer_id'), value: item.ManufacturerId })
			),
			React.createElement(
				'td',
				null,
				React.createElement('input', { type: 'text', onChange: e => this.updateRecord(e, item.Id, i, 'VendorCode', 'vendor_code'), value: item.VendorCode })
			),
			React.createElement(
				'td',
				null,
				this.formatDate(item.CreatedAt)
			),
			React.createElement(
				'td',
				null,
				React.createElement(
					'button',
					{ onClick: () => this.removeRecord(item.Id, i) },
					'\u0423\u0434\u0430\u043B\u0438\u0442\u044C'
				)
			)
		);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'body-block' },
			React.createElement(
				'h1',
				null,
				'\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C!'
			),
			React.createElement(
				'div',
				{ className: 'table-panel' },
				React.createElement(
					'button',
					{ className: 'button-add', onClick: () => this.setState({ tableBody: [] }) },
					'\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C'
				),
				React.createElement(
					'button',
					{ className: 'button-add', onClick: this.getRecords },
					'\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u043E GRPC'
				),
				React.createElement(
					'button',
					{ className: 'button-add', onClick: this.addNewRecord },
					'\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C'
				)
			),
			React.createElement('hr', null),
			React.createElement(
				'table',
				{ className: 'table-block' },
				React.createElement(
					'tr',
					null,
					React.createElement(
						'th',
						null,
						'ID',
						React.createElement('br', null),
						React.createElement(
							'span',
							null,
							'ObjectId \u2192 string'
						)
					),
					React.createElement(
						'th',
						null,
						'\u041A\u043E\u0434 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F',
						React.createElement('br', null),
						React.createElement(
							'span',
							null,
							'int32'
						)
					),
					React.createElement(
						'th',
						null,
						'\u041A\u043E\u0434 \u043F\u043E\u0441\u0442\u0430\u0432\u0449\u0438\u043A\u0430',
						React.createElement('br', null),
						React.createElement(
							'span',
							null,
							'string'
						)
					),
					React.createElement(
						'th',
						null,
						'\u0417\u0430\u043F\u0438\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u043D\u0430',
						React.createElement('br', null),
						React.createElement(
							'span',
							null,
							'ISODate \u2192 Timestamp'
						)
					),
					React.createElement('th', null)
				),
				this.state.tableBody.map(this.createTableBody)
			)
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(React.createElement(
	'div',
	{ className: 'page-block' },
	React.createElement(Body, null)
), app);