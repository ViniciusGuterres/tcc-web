import { FC, useEffect, useState } from "react";

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
interface ActionButtonType {
    type: string,
    onClickHandler: (id: string | number) => void,
    enabled: boolean,
}

interface Column {
    name: string,
    header: string,
    format?: string,
    type: string,
    actionButton?: ActionButtonType,
};

interface Props {
    data: Array<any>,
    columns: Array<Column>,
};

function Table({
    data,
    columns,
}: Props) {
    const columnHelper = createColumnHelper();

    const formatCellValue = (format, value) => {
        switch (format) {
            case 'currency-BRL':
                return formatToBRL(value);
            default:
                return value;
        }
    }

    const actionButtonBuilder = ({ type, onClickHandler, enabled }: ActionButtonType, header: string, rowData: any) => {
        let buttonClass = 'px-2 py-1 border rounded-md ';

        if (type === 'delete') {
            buttonClass += 'text-red-600 border-red-600';
        } else {
            buttonClass += 'text-blue-600 border-blue-600';
        }

        return (
            <button
                onClick={() => { onClickHandler(rowData.id) }}
                className={buttonClass}
            >
                {header}
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

                    return formatCellValue(column.format, info.getValue());
                },
                footer: info => info.column.id,
            })
        ) as ColumnDef<any, any>[];
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
                <thead className=" font-color-primary">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="capitalize px-3.5 py-2">
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
                            <tr
                                key={row.id}
                                className={`${i % 2 === 0 ? "font-color-primary" : "font-color-secondary"}`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-3.5 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
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
                    className="p-2 bg-transparent"
                >
                    {[10, 20, 30, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Table;