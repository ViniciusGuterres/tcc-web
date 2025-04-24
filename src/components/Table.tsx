import { FC, ReactElement, ReactNode, useEffect, useState } from "react";

import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import formatToBRL from "../utils/formatToBRL";
import formatDbTimestamp from "../utils/formatDbTimestamp";
import formatNumber from "../utils/formatNumber";

interface ActionButtonType {
    type: string,
    onClickHandler: (id: ID, entityId?: ID) => void,
    enabled: boolean,
    label?: string,
}

type customFormatFunctionType = (value: ID) => void;

interface Column {
    name: string,
    header: string,
    format?: string,
    customFormatFunction?: customFormatFunctionType,
    type: string,
    actionButton?: ActionButtonType,
};

interface Props {
    data: Array<any>,
    columns: Array<Column>,
    rowsExpandable?: boolean,
    expandableRowColumns?: Array<Column>,
    onExpandRowFunction?: (value?: ID) => void,
    expandableRowsData?: Object,
};

function Table({
    data,
    columns,
    rowsExpandable = false,
    expandableRowColumns,
    onExpandRowFunction,
    expandableRowsData,
}: Props) {
    const [expandedRow, setExpandedRow] = useState<ID | null>(null);

    const columnHelper = createColumnHelper();


    const toggleExpandRow = (evt: OnClickEvent, rowId: ID) => {
        evt.stopPropagation();

        setExpandedRow(expandedRow === rowId ? null : rowId);
    };

    const formatCellValue = (format: string | undefined, value: string | number, customFormatFunction?: customFormatFunctionType | undefined) => {
        switch (format) {
            case 'currency-BRL':
                if (typeof value === 'number') {
                    return formatToBRL(value);
                }

                return value;

            case 'dbTimestamp':
                if (typeof value === 'string') {
                    return formatDbTimestamp(value);
                }

                return value;

            case 'number':
                if (typeof value === 'number') {
                    return formatNumber(value);
                }

                return value;

            case 'custom':
                if (customFormatFunction && typeof customFormatFunction === 'function') {
                    return customFormatFunction(value);
                }

                return value;
            default:
                return value;
        }
    }

    const actionButtonBuilder = (
        { type, onClickHandler, enabled, label }: ActionButtonType,
        header: string,
        rowData: any,
        entityData?: any
    ) => {
        let buttonClass = 'px-2 py-1 border rounded-md ';

        if (type === 'delete') {
            buttonClass += 'text-red-600 border-red-600';
        } else {
            buttonClass += 'text-blue-600 border-blue-600';
        }

        return (
            <button
                onClick={() => { onClickHandler(rowData?.id, entityData?.id) }}
                className={buttonClass}
            >
                {label || header}
            </button>
        );
    }

    const columnsBuilder = (): ColumnDef<any, any>[] => {
        return columns?.map(column =>
            columnHelper.accessor(column.name, {
                header: () => column.header,
                cell: info => {
                    const rowData = info.row.original; // Get the full object

                    if (
                        column.type === 'action'
                        && column.actionButton
                    ) {
                        return actionButtonBuilder(column.actionButton, column.header, rowData);
                    }

                    return formatCellValue(column.format, info.getValue(), column.customFormatFunction);
                },
                footer: info => info.column.id,
            })
        ) as ColumnDef<any, any>[];
    }

    const expandableRowBuilder = (row) => {
        const buildTableData = () => {
            const nestedRowData = expandableRowsData?.[row.original.id] || [];

            let elements: ReactElement[] = [];

            for (let i = 0; i < nestedRowData.length; i++) {
                const data = nestedRowData[i];

                elements.push(
                    <tr
                        key={`nested_data_table_row_${data.id}_${Date.now()}`}
                    >
                        {
                            expandableRowColumns?.map(column => {
                                const currentData = data[column.name];

                                let rowElement: ReactNode =
                                    <span>{formatCellValue(column.format, currentData, column.customFormatFunction) || ''}</span>

                                if (
                                    column.type === 'action'
                                    && column.actionButton
                                ) {
                                    rowElement = actionButtonBuilder(column.actionButton, column.header, data, row.original);
                                }

                                return (
                                    <td
                                        key={`nested_data_table_data_${data.id}_${currentData}_${column.name}`}
                                        className="font-color-primary"
                                    >
                                        {rowElement}
                                    </td>
                                );
                            })
                        }
                    </tr>
                );
            }

            return elements;
        }

        return (
            <tr className="bg-black-100">
                <td colSpan={columns.length} className="p-2 border">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="font-color-primary">
                            <tr>
                                {
                                    expandableRowColumns?.map(column => (
                                        <th
                                            className="border p-2"
                                            key={`expandable_row_columns_${column.name}`}
                                        >
                                            {column.header}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {buildTableData()}
                        </tbody>
                    </table>
                </td>
            </tr>
        );
    }

    const handleClickToExpandRow = (evt: OnClickEvent, rowId: ID) => {
        if (onExpandRowFunction && typeof onExpandRowFunction === 'function') {
            onExpandRowFunction(rowId);
        }

        toggleExpandRow(evt, rowId);
    }

    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns: columnsBuilder(),
        state: {
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="p-2 max-w-5xl mx-auto text-white fill-gray-400">
            <div className="flex justify-between mb-2">
                <div className="w-full flex items-center gap-1">
                    {/* <SearchIcon /> */}
                    {/* <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500"
            placeholder="Search all columns..."
            /> */}
                </div>
                {/* <DownloadBtn data={data} fileName={"peoples"} /> */}
            </div>

            <table className="rounded-lg shadow dark:border w-full text-left bg-secondary-color">
                <thead className="font-color-primary">
                    {table.getHeaderGroups().map((headerGroup, index) => (
                        <tr key={`headerGroup_${headerGroup.id}_${index}_${Date.now()}`}>
                            {headerGroup.headers.map((header) => (
                                
                                <th key={`headers_values_${header.id}_${header.index}_${Date.now()}`} className="capitalize px-3.5 py-2">
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row, i) => (

                            <>
                                <tr
                                    key={row.id}
                                    className={`font-color-primary ${i % 2 === 0 ? "" : "bg-gray-100"} ${rowsExpandable ? "cursor-pointer hover:bg-sky-100" : ""}`}
                                    onClick={evt => {
                                        if (rowsExpandable) {
                                            handleClickToExpandRow(evt, row.original.id);
                                        }
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-3.5 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>

                                {/* Expanded Row with Nested Table */}
                                {
                                    rowsExpandable
                                    && expandedRow === row.original.id
                                    && expandableRowColumns?.length
                                    && expandableRowBuilder(row)}
                            </>
                        ))
                    ) : (
                        <tr className="text-center h-32 font-color-primary">
                            <td colSpan={12}>Sem dados encontrados!</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* pagination */}
            <div className="flex items-center justify-end mt-2 gap-2">
                <button
                    onClick={() => {
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1 border border-gray-300 px-2 disabled:opacity-30 font-color-secondary"
                >
                    {"<"}
                </button>
                <button
                    onClick={() => {
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                    className="p-1 border border-gray-300 px-2 disabled:opacity-30 font-color-secondary"
                >
                    {">"}
                </button>

                <span className="flex items-center gap-1 font-color-secondary">
                    <div>Página</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} de{" "}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1 font-color-secondary">
                    | Ir para página:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16 bg-transparent"
                    />
                </span>

                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className="p-2 bg-transparent font-primary"
                >
                    {[10, 20, 30, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize} className="font-primary">
                            Páginas {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Table;