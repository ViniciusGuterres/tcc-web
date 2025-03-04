import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import Button from "../../components/Button";

// import DownloadBtn from "./DownloadBtn";
// import DebouncedInput from "./DebouncedInput";
// import { SearchIcon } from "../Icons/Icons";

type Resource = {
    name: string
    category: string
    unityValue: number
}

const MOCK: Resource[] = [
    {
        name: 'tanner',
        category: 'linsley',
        unityValue: 24,
    },
    {
        name: 'tanner',
        category: 'linsley',
        unityValue: 24,
    },
    {
        name: 'tanner',
        category: 'linsley',
        unityValue: 24,
    },
]
type CrudModeTypesAllowed = "list" | "create" | "edit";

interface Props {
    onChangeCrudMode: (newCrudMode: CrudModeTypesAllowed) => void
};

const ListResources = ({ onChangeCrudMode }: Props) => {
    const columnHelper = createColumnHelper();

    const columns: any = [
        columnHelper.accessor('name', {
            header: () => 'Nome',
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        // columnHelper.accessor(row=> row.lastName, {
        //     id: 'lastName',
        //     cell: info => <i>{info.getValue()}</i>,
        //     header: () => <span>Last Name</span>,
        //     footer: info => info.column.id,
        // }),
        columnHelper.accessor('category', {
            header: () => 'Categoria',
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('unityValue', {
            header: () => 'Valor unitário',
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
    ]

    const [data] = useState(() => [...MOCK]);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <>
            <Button 
                name="Novo recurso"
                onClickFunc={() => onChangeCrudMode('create')}
                icon={{
                    
                    position: 'left',
                    icon: 'fa-plus'
                
                }}
            />
            
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
                                    className={`font-color-primary
                  ${i % 2 === 0 ? "bg-primary-color" : "bg-secondary-color"}
                  `}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-3.5 py-2">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center h-32">
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
        </>
    );
};

export default ListResources;