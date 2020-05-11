import React from 'react';
import ReactDOM from 'react-dom';
import { ClientRequest, Empty, ServerReply, ServerReplyList } from './main_pb.js';
import { MainProtoClient } from './main_grpc_web_pb.js';

class Body extends React.Component {
	constructor() {
		super();
		this.state = {
			tableBody: data
		}
		const host = location.hostname == 'localhost' ? 'localhost' : '172.18.0.10';
		this.client = new MainProtoClient('http://'+host+':8080');	//Envoy-proxy

		this.getRecords = this.getRecords.bind(this);
		this.addNewRecord = this.addNewRecord.bind(this);
		this.removeRecord = this.removeRecord.bind(this);
		this.updateRecord = this.updateRecord.bind(this);
		this.createTableBody = this.createTableBody.bind(this);
	}
	//Получаем все записи из базы
	getRecords() {
		this.client.getRecords(new Empty(), {}, (err, response) => {	// GetRecords => getRecords
			const tb = [];
			response.getRecordsList().map(item => {
				const record = {
					Id: item.getId(),
					ManufacturerId: item.getManufacturerId(),
					VendorCode: item.getVendorCode(),
					CreatedAt: item.getCreatedAt().getSeconds()*1000,
					DeletedAt: item.getDeletedAt().getSeconds()*1000,
				}
				tb.push(record)
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
				alert(err.message)
				return
			}
			const newRow = {
				Id: response.getId(),
				ManufacturerId: 0,
				VendorCode: '',
				CreatedAt: response.getCreatedAt().getSeconds()*1000,
				DeletedAt: 0
			}
			this.setState({
				tableBody: [...this.state.tableBody, newRow]
			})
		})
	}
	// Удаляем строку из таблицы
	removeRecord(id, i) {
		const newRequest = new ClientRequest()
		newRequest.setId(id);	// Включаем в запрос идентификатор записи, которую хоим удалить
		this.client.removeRecord(newRequest, {}, (err, response) => {	// RemoveRecord => removeRecord
			if (err != null) {
				alert(err.message)
				return
			}
			const tb = [...this.state.tableBody];
			tb.splice(i, 1);
			this.setState({
				tableBody: tb
			})
		})
	}
	// Редактируем ячейку в таблице
	updateRecord(e, id, i, key, field) {
		const newRequest = new ClientRequest(),
			  value = e.target.value,
			  type = e.target.type;
		if (type == 'number' && value > 2147483647) return

		// Чтобы курсор не перескакивал в конец строки, размещаем setState вне updateRecord-функции
		const tb = [...this.state.tableBody];
		tb[i][key] = value;
		this.setState({
			tableBody: tb
		});

		newRequest.setId(id);			// Включаем в запрос идентификатор записи, в которую вносим изменения
		newRequest.setField(field);		// Включаем в запрос имя изменяемого поля
		newRequest.setMethod(key);		// Включаем в запрос метод, соответствующий изменяемому полю
		newRequest['set'+key](value),	// Включаем в запрос значение изменяемой ячейки
		this.client.updateRecord(newRequest, {}, (err, response) => {	// UpdateRecord => updateRecord
			if (err != null) {
				alert(err.message);
				//location.href = location.href;
				this.getRecords();
			}
		})
	}

	formatDate(isoDate) {
		const t = new Date(isoDate);
		if (t <= new Date(0)) return '-'
		return t.toLocaleString('ru-RU')
	}

	createTableBody(item, i) {
		return (
			<tr>
				<td>{item.Id}</td>
				<td><input min="0" type="number" onChange={(e) => this.updateRecord(e, item.Id, i, 'ManufacturerId', 'manufacturer_id')} value={item.ManufacturerId} /></td>
				<td><input type="text" onChange={(e) => this.updateRecord(e, item.Id, i, 'VendorCode', 'vendor_code')} value={item.VendorCode} /></td>
				<td>{this.formatDate(item.CreatedAt)}</td>
				{/*<td>{this.formatDate(item.DeletedAt)}</td>*/}
				<td><button onClick={() => this.removeRecord(item.Id, i)}>Удалить</button></td>
			</tr>
		)
	}

	render() {
		return (
			<div className="body-block">
				<h1>Добро пожаловать!</h1>
				<div className="table-panel">
					<button className="button-add" onClick={() => this.setState({tableBody: []})}>Очистить</button>
					<button className="button-add" onClick={this.getRecords}>Получить данные по GRPC</button>
					<button className="button-add" onClick={this.addNewRecord}>Добавить</button>
				</div>
				<hr/>
				<table className="table-block">
					<tr>
						<th>ID<br/><span>ObjectId → string</span></th>
						<th>Код производителя<br/><span>int32</span></th>
						<th>Код поставщика<br/><span>string</span></th>
						<th>Запись создана<br/><span>ISODate → Timestamp</span></th>
						{/*<th>Запись удалена<br/><span>ISODate → Timestamp</span></th>*/}
						<th></th>
					</tr>
					{this.state.tableBody.map(this.createTableBody)}
				</table>
			</div>
		)
	}
}

const app = document.getElementById('root');
ReactDOM.render(
	<div className="page-block">
		<Body />
	</div>,
	app
)
