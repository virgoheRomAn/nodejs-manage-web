import { saveAs } from 'file-saver';
import XLSX, { BookType } from 'xlsx';

type ExportExcelParams = {
	multiHeader?: EmptyArrayType;
	sheets?: EmptyArrayType;
	header?: EmptyArrayType;
	data?: EmptyArrayType;
	filename?: string;
	merges?: EmptyArrayType;
	autoWidth?: boolean;
	bookType?: BookType;
};

/**
 * @description 将表格转换成数组
 * @param table 表格
 * @returns
 */
function generateArray(table: HTMLElement): Array<any> {
	let rows = table.querySelectorAll('tr');
	let out: Array<any> = [];
	let ranges: Array<any> = [];

	for (let R = 0; R < rows.length; ++R) {
		let row: any = rows[R];
		let outRow: Array<any> = [];
		let columns: Array<HTMLElement> = row.querySelectorAll('td');

		for (let C = 0; C < columns.length; ++C) {
			let cell: any = columns[C];
			let cellValue: any = cell.innerText;
			let colspan: any = cell.getAttribute('colspan');
			let rowspan: any = cell.getAttribute('rowspan');

			if (cellValue !== '' && cellValue === Number(cellValue)) cellValue = Number(cellValue);

			ranges.forEach((range) => {
				if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
					for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
				}
			});

			// 行 和 列
			if (rowspan || colspan) {
				rowspan = rowspan || 1;
				colspan = colspan || 1;
				ranges.push({
					s: {
						r: R,
						c: outRow.length
					},
					e: {
						r: R + rowspan - 1,
						c: outRow.length + colspan - 1
					}
				});
			}

			// Handle Value
			outRow.push(cellValue !== '' ? cellValue : null);

			// Handle Colspan
			if (colspan) for (let k = 0; k < colspan - 1; ++k) outRow.push(null);
		}

		out.push(outRow);
	}

	return [out, ranges];
}

// 日期格式处理
function datenum(v: any, date1904: any = false) {
	if (date1904) v += 1462;
	let epoch = Date.parse(v);

	return (epoch - Number(new Date(Date.UTC(1899, 11, 30)))) / (24 * 60 * 60 * 1000);
}

/**
 * @description 通过数组创建 sheet
 * @param data
 * @returns
 */
function createSheetByArray(data: any): any {
	let ws = {};
	let range = {
		s: { c: 10000000, r: 10000000 },
		e: { c: 0, r: 0 }
	};

	for (let R = 0; R !== data.length; ++R) {
		for (let C = 0; C !== data[R].length; ++C) {
			if (range.s.r > R) range.s.r = R;
			if (range.s.c > C) range.s.c = C;
			if (range.e.r < R) range.e.r = R;
			if (range.e.c < C) range.e.c = C;

			let cell = { v: data[R][C] } as EmptyObjectType;

			if (cell.v === null) continue;

			let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

			if (typeof cell.v === 'number') {
				cell.t = 'n';
			} else if (typeof cell.v === 'boolean') {
				cell.t = 'b';
			} else if (cell.v instanceof Date) {
				cell.t = 'n';
				cell.z = (XLSX.SSF as EmptyObjectType)._table[14];
				cell.v = datenum(cell.v);
			} else {
				cell.t = 's';
			}

			ws[cell_ref] = cell;
		}
	}

	if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);

	return ws;
}

// 创建工作簿
class Workbook {
	SheetNames: Array<any> = [];
	Sheets: EmptyObjectType = {};
	constructor() {}
}

// 字符转转换 Buffer
function string2Buffer(str: string): ArrayBuffer {
	let buf = new ArrayBuffer(str.length);
	let view = new Uint8Array(buf);

	for (let i = 0; i !== str.length; ++i) view[i] = str.charCodeAt(i) & 0xff;

	return buf;
}

/**
 * @description 将表格导出成Excel
 * @param id 表格ID
 */
export const exportExcelByTable = (id: string, filename: string): void => {
	let theTable = document.getElementById(id) as HTMLElement;
	let oo = generateArray(theTable);
	let data = oo[0];
	let ranges = oo[1];
	let ws_name = 'SheetJS';

	let wb = new Workbook();
	let ws = createSheetByArray(data);

	// 工作簿
	ws['!merges'] = ranges;
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;

	let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });

	// 导出
	saveAs(new Blob([string2Buffer(wbout)], { type: 'application/octet-stream' }), `${filename}.xlsx`);
};

/**
 * @description 将数据导出成Excel
 * @param multiHeader 多表头
 * @param header 表头
 * @param data 数据
 * @param filename 文件名字
 * @param merges 合并数据
 * @param autoWidth 宽度自适应
 * @param bookType 文件类型
 */
export const exportExcelByJSON = (
	{ multiHeader = [], header = [], data = [], filename = '', merges = [], autoWidth = true, bookType = 'xlsx' } = {} as ExportExcelParams
): void => {
	data = [...data];
	(data as Array<any>).unshift(header);

	// 多表头
	for (let i = multiHeader.length - 1; i > -1; i--) {
		data.unshift(multiHeader[i]);
	}

	let ws_name = 'SheetJS';
	let wb = new Workbook();
	let ws = createSheetByArray(data);

	if (merges.length > 0) {
		if (!ws['!merges']) ws['!merges'] = [];
		merges.forEach((item) => {
			ws['!merges'].push(XLSX.utils.decode_range(item));
		});
	}

	// 设置worksheet每列的最大宽度
	if (autoWidth) {
		const colWidth = (data as Array<any>).map((row) =>
			(row as Array<any>).map((val) => {
				// 先判断是否为null/undefined
				if (val === null || val === undefined) {
					return { wch: 10 };
				}

				// 再判断是否为中文
				if (val.toString().charCodeAt(0) > 255) {
					return { wch: val.toString().length * 2 };
				}

				// 返回字数的个数
				return { wch: val.toString().length };
			})
		);

		// 以第一行为初始值
		let result = colWidth[0];

		for (let i = 1; i < colWidth.length; i++) {
			for (let j = 0; j < colWidth[i].length; j++) {
				if (result[j]['wch'] < colWidth[i][j]['wch']) {
					result[j]['wch'] = colWidth[i][j]['wch'];
				}
			}
		}

		ws['!cols'] = result;
	}

	// 添加工作簿
	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;

	let wbout = XLSX.write(wb, { bookType: bookType as BookType, bookSST: false, type: 'binary' });

	// 导出
	saveAs(new Blob([string2Buffer(wbout)], { type: 'application/octet-stream' }), `${filename}.${bookType}`);
};

/**
 * @description 将数据导出成Excel [有多个工作簿]
 * @param multiHeader 多表头
 * @param header 表头
 * @param data 数据
 * @param filename 文件名字
 * @param merges 合并数据
 * @param autoWidth 宽度自适应
 * @param bookType 文件类型
 */
export const exportMoreSheetExcelByJSON = (
	{ multiHeader = [], sheets = [], filename = '', merges = [], autoWidth = true, bookType = 'xlsx' } = {} as ExportExcelParams
): void => {
	let wb = new Workbook();

	for (let index in sheets as Array<any>) {
		const sheet: EmptyObjectType = sheets[index];
		let data = sheet.data;
		let header = sheet.header;
		data = [...data];
		data.unshift(header);

		// 多表头
		for (let i = multiHeader.length - 1; i > -1; i--) {
			data.unshift(multiHeader[i]);
		}

		let ws_name = sheet.name || `Sheet${index + 1}`;
		let ws = createSheetByArray(data);

		if (merges.length > 0) {
			if (!ws['!merges']) ws['!merges'] = [];
			merges.forEach((item) => {
				ws['!merges'].push(XLSX.utils.decode_range(item));
			});
		}

		if (autoWidth) {
			const colWidth = (data as Array<any>).map((row) =>
				(row as Array<any>).map((val) => {
					// 先判断是否为null/undefined
					if (val === null || val === undefined) {
						return { wch: 10 };
					}

					// 再判断是否为中文
					if (val.toString().charCodeAt(0) > 255) {
						return { wch: val.toString().length * 2 };
					}

					return { wch: val.toString().length };
				})
			);

			// 以第一行为初始值
			let result = colWidth[0];

			for (let i = 1; i < colWidth.length; i++) {
				for (let j = 0; j < colWidth[i].length; j++) {
					if (result[j]['wch'] < colWidth[i][j]['wch']) {
						result[j]['wch'] = colWidth[i][j]['wch'];
					}
				}
			}

			ws['!cols'] = result;
		}

		// 添加工作簿
		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = ws;
	}

	let wbout = XLSX.write(wb, { bookType: bookType as BookType, bookSST: false, type: 'binary' });

	// 导出
	saveAs(new Blob([string2Buffer(wbout)], { type: 'application/octet-stream' }), `${filename}.${bookType}`);
};
