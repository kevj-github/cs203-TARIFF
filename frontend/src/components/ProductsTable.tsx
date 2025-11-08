// "use client";

// import * as React from "react";
// import {
//   type ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   type SortingState,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   ArrowUpDown,
//   Check,
//   ChevronDown,
//   Copy,
//   MoreHorizontal,
//   Plus,
//   Search,
//   Trash2,
// } from "lucide-react";

// import { api } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";

// type ApiResponse<T> = { ok: boolean; message: string; data: T };

// export type Product = {
//   id: number;
//   name: string;
//   productType: string; // category
//   hsCode: string;
//   brand?: string | null;
//   model?: string | null;
// };

// type NewProduct = {
//   name: string;
//   productType: string;
//   hsCode: string;
//   brand?: string | null;
//   model?: string | null;
// };

// const makeColumns = (onDelete: (p: Product) => void): ColumnDef<Product>[] => [
//   //   {
//   //     id: "select",
//   //     header: ({ table }) => (
//   //       <Checkbox
//   //         checked={
//   //           table.getIsAllPageRowsSelected() ||
//   //           (table.getIsSomePageRowsSelected() && "indeterminate")
//   //         }
//   //         onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
//   //         aria-label="Select all"
//   //       />
//   //     ),
//   //     cell: ({ row }) => (
//   //       <Checkbox
//   //         checked={row.getIsSelected()}
//   //         onCheckedChange={(v) => row.toggleSelected(!!v)}
//   //         aria-label="Select row"
//   //       />
//   //     ),
//   //     enableSorting: false,
//   //     enableHiding: false,
//   //   },
//   {
//     accessorKey: "id",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         ID
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="text-gray-700 pl-8">{row.original.id}</div>
//     ),
//     enableSorting: false,
//     enableHiding: false,
//     size: 60,
//   },

//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Name
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
//   },
//   {
//     accessorKey: "productType",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Category
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//   },
//   {
//     accessorKey: "hsCode",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         HS Code
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="tabular-nums">{row.original.hsCode}</div>
//     ),
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const p = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             align="end"
//             className="bg-white shadow-lg border border-gray-200 rounded-md p-1 w-44"
//           >
//             <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider mb-1">
//               Actions
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator className="my-1" />

//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(String(p.id))}
//               className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-sm"
//             >
//               <Copy className="h-4 w-4 text-gray-500" />
//               <span>Copy product ID</span>
//             </DropdownMenuItem>

//             <DropdownMenuSeparator className="my-1" />

//             <DropdownMenuItem
//               onClick={() => onDelete(p)}
//               className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer rounded-sm"
//             >
//               <Trash2 className="h-4 w-4 text-red-500" />
//               <span>Delete</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

// export default function ProductsTable() {
//   const [products, setProducts] = React.useState<Product[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   // table state
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnVisibility, setColumnVisibility] = React.useState({});
//   const [rowSelection, setRowSelection] = React.useState({});
//   const [globalFilter, setGlobalFilter] = React.useState("");

//   // add product form
//   const [newProduct, setNewProduct] = React.useState<NewProduct>({
//     name: "",
//     productType: "",
//     hsCode: "",
//     brand: "",
//     model: "",
//   });
//   const [adding, setAdding] = React.useState(false);

//   const [addOpen, setAddOpen] = React.useState(false);
//   const [saving, setSaving] = React.useState(false);

//   // fetch
//   const fetchProducts = React.useCallback(async () => {
//     setLoading(true);
//     try {
//       // If your api already unwraps data, use: const data = await api.get<Product[]>("/products")
//       const res = await api.get<ApiResponse<Product[]>>("/products");
//       const data = (res as any)?.data?.data ?? (res as any); // compatible with both shapes
//       setProducts(data ?? []);
//       setError(null);
//     } catch (e: any) {
//       setError(e?.message ?? "Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   React.useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   const handleDelete = async (p: Product) => {
//     if (!confirm(`Delete product "${p.name}" (ID ${p.id})?`)) return;
//     // optimistic update
//     const prev = products;
//     setProducts((arr) => arr.filter((x) => x.id !== p.id));
//     try {
//       await api.delete(`/products/${p.id}`);
//     } catch (e) {
//       // revert on error
//       setProducts(prev);
//       alert("Failed to delete product.");
//     }
//   };

//   const handleCreate = async () => {
//     if (!newProduct.name || !newProduct.productType || !newProduct.hsCode) {
//       alert("Name, Category, and HS Code are required.");
//       return;
//     }
//     setSaving(true);
//     try {
//       const created = await api.post("/products", newProduct); // unwrap if your api returns raw
//       const createdProduct = (created as any)?.data?.data ?? (created as any);
//       setProducts((arr) => [createdProduct, ...arr]);
//       setAddOpen(false);
//       setNewProduct({
//         name: "",
//         productType: "",
//         hsCode: "",
//         brand: "",
//         model: "",
//       });
//     } catch {
//       alert("Failed to add product.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Columns (with delete wired)
//   const columns = React.useMemo(() => makeColumns(handleDelete), [products]);

//   // Client-side global filter across name / hsCode / productType
//   const filteredData = React.useMemo(() => {
//     const q = globalFilter.trim().toLowerCase();
//     if (!q) return products;
//     return products.filter((p) =>
//       [p.name, p.hsCode, p.productType].some((v) =>
//         (v ?? "").toLowerCase().includes(q)
//       )
//     );
//   }, [products, globalFilter]);

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     state: { sorting, columnVisibility },
//     onSortingChange: setSorting,
//     onColumnVisibilityChange: setColumnVisibility,
//     // onRowSelectionChange: setRowSelection,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   if (loading) return <div className="p-6">Loading products…</div>;
//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           <p className="font-semibold">Error</p>
//           <p>{error}</p>
//           <Button className="mt-3" onClick={fetchProducts}>
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-6">
//       <div className="flex items-start py-4">
//         <div className="relative max-w-sm w-full ">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search name / HS / category…"
//             value={globalFilter}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             className="pl-9" // adds padding so text doesn't overlap the icon
//           />
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               className="ml-auto bg-white border border-gray-200 hover:bg-gray-50 shadow-sm text-gray-700 flex items-center gap-1"
//             >
//               Columns
//               <ChevronDown className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             align="end"
//             className="bg-white shadow-lg border border-gray-200 rounded-md p-1 w-44"
//           >
//             <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider mb-1">
//               Toggle Columns
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator className="my-1" />
//             {table
//               .getAllColumns()
//               .filter((c) => c.getCanHide())
//               .map((c) => (
//                 <DropdownMenuCheckboxItem
//                   key={c.id}
//                   className="flex items-center gap-2 capitalize text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
//                   checked={c.getIsVisible()}
//                   onCheckedChange={(v) => c.toggleVisibility(!!v)}
//                 >
//                   <span>{c.id}</span>
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <Dialog open={addOpen} onOpenChange={setAddOpen}>
//           <DialogTrigger
//             asChild
//             className="ml-auto bg-white border border-gray-200 hover:bg-gray-50 shadow-sm text-gray-700 flex items-center gap-1"
//           >
//             <Button className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               Add Product
//             </Button>
//           </DialogTrigger>

//           {/* Modal */}
//           <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200 shadow-xl">
//             <DialogHeader>
//               <DialogTitle className="text-lg font-semibold">
//                 Add Product
//               </DialogTitle>
//               <DialogDescription className="text-sm text-gray-500">
//                 Create a new product. Fields marked * are required.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
//               <Input
//                 placeholder="Name *"
//                 value={newProduct.name}
//                 onChange={(e) =>
//                   setNewProduct((s) => ({ ...s, name: e.target.value }))
//                 }
//               />{" "}
//               <Input
//                 placeholder="Category *"
//                 value={newProduct.productType}
//                 onChange={(e) =>
//                   setNewProduct((s) => ({ ...s, productType: e.target.value }))
//                 }
//               />{" "}
//               <Input
//                 placeholder="HS Code *"
//                 value={newProduct.hsCode}
//                 onChange={(e) =>
//                   setNewProduct((s) => ({ ...s, hsCode: e.target.value }))
//                 }
//               />{" "}
//             </div>

//             <DialogFooter className="mt-4">
//               <DialogClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DialogClose>
//               <Button onClick={handleCreate} disabled={saving}>
//                 {saving ? "Adding…" : "Add Product"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//         <Table className="w-full text-sm">
//           <TableHeader>
//             {table.getHeaderGroups().map((hg) => (
//               <TableRow
//                 key={hg.id}
//                 className="hover:bg-gray-50 even:bg-gray-50 transition-colors"
//               >
//                 {hg.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     className="bg-gray-100 font-semibold text-gray-700"
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>

//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={table.getAllColumns().length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between py-4">
//         <div className="text-sm text-gray-600">
//           Page{" "}
//           <span className="font-medium">
//             {table.getState().pagination.pageIndex + 1}
//           </span>{" "}
//           of <span className="font-medium">{table.getPageCount()}</span>
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import * as React from "react";
// import {
//   type ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   type SortingState,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   ArrowUpDown,
//   Check,
//   ChevronDown,
//   Copy,
//   MoreHorizontal,
//   Plus,
//   Search,
//   Trash2,
// } from "lucide-react";

// import { api } from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";

// type ApiResponse<T> = { success: boolean; message: string; data: T };

// export type Product = {
//   id: number;
//   name: string;
//   productType: string;
//   hsCode: string;
//   brand?: string | null;
//   model?: string | null;
// };

// type NewProduct = {
//   name: string;
//   productType: string;
//   hsCode: string;
//   brand?: string | null;
//   model?: string | null;
// };

// const makeColumns = (onDelete: (p: Product) => void): ColumnDef<Product>[] => [
//   {
//     accessorKey: "id",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         ID
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="text-gray-700 pl-8">{row.original.id}</div>
//     ),
//     enableSorting: false,
//     enableHiding: false,
//     size: 60,
//   },
//   {
//     accessorKey: "name",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Name
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
//   },
//   {
//     accessorKey: "productType",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Category
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//   },
//   {
//     accessorKey: "hsCode",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         HS Code
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <div className="tabular-nums">{row.original.hsCode}</div>
//     ),
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const p = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             align="end"
//             className="bg-white shadow-lg border border-gray-200 rounded-md p-1 w-44"
//           >
//             <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider mb-1">
//               Actions
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator className="my-1" />

//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(String(p.id))}
//               className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-sm"
//             >
//               <Copy className="h-4 w-4 text-gray-500" />
//               <span>Copy product ID</span>
//             </DropdownMenuItem>

//             <DropdownMenuSeparator className="my-1" />

//             <DropdownMenuItem
//               onClick={() => onDelete(p)}
//               className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer rounded-sm"
//             >
//               <Trash2 className="h-4 w-4 text-red-500" />
//               <span>Delete</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

// export default function ProductsTable() {
//   const [products, setProducts] = React.useState<Product[]>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   // table state
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnVisibility, setColumnVisibility] = React.useState({});
//   const [rowSelection, setRowSelection] = React.useState({});
//   const [globalFilter, setGlobalFilter] = React.useState("");

//   // add product form
//   const [newProduct, setNewProduct] = React.useState<NewProduct>({
//     name: "",
//     productType: "",
//     hsCode: "",
//     brand: "",
//     model: "",
//   });

//   const [addOpen, setAddOpen] = React.useState(false);
//   const [saving, setSaving] = React.useState(false);
//   const [deleting, setDeleting] = React.useState<number | null>(null);

//   // fetch products
//   const fetchProducts = React.useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       console.log("Fetching products from /api/products...");
//       // Your api client automatically unwraps ApiResponse, so we get Product[] directly
//       const data = await api.get<Product[]>("/products");
//       console.log("Fetched products:", data);

//       const products = Array.isArray(data) ? data : [];
//       console.log("Setting products:", products);
//       setProducts(products);
//     } catch (e: any) {
//       console.error("Failed to fetch products:", e);
//       console.error("Error details:", {
//         message: e?.message,
//         response: e?.response,
//         status: e?.response?.status,
//       });
//       setError(
//         e?.message || "Failed to fetch products. Check console for details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   React.useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   // Delete product with proper error handling
//   const handleDelete = async (p: Product) => {
//     if (!confirm(`Delete product "${p.name}" (ID ${p.id})?`)) return;

//     setDeleting(p.id);

//     try {
//       await api.delete(`/products/${p.id}`);
//       // Only update state after successful deletion
//       setProducts((arr) => arr.filter((x) => x.id !== p.id));
//     } catch (e: any) {
//       console.error("Failed to delete product:", e);
//       alert(`Failed to delete product: ${e?.message || "Unknown error"}`);
//     } finally {
//       setDeleting(null);
//     }
//   };

//   // Create product with proper response handling
//   const handleCreate = async () => {
//     if (!newProduct.name || !newProduct.productType || !newProduct.hsCode) {
//       alert("Name, Category, and HS Code are required.");
//       return;
//     }

//     setSaving(true);

//     try {
//       // Your api client automatically unwraps ApiResponse, so we get Product directly
//       const createdProduct = await api.post<Product>("/products", newProduct);
//       console.log("Created product:", createdProduct);

//       if (createdProduct && createdProduct.id) {
//         // Add the new product to the list
//         setProducts((arr) => [createdProduct, ...arr]);

//         // Close dialog and reset form
//         setAddOpen(false);
//         setNewProduct({
//           name: "",
//           productType: "",
//           hsCode: "",
//           brand: "",
//           model: "",
//         });
//       } else {
//         throw new Error("Invalid response from server");
//       }
//     } catch (e: any) {
//       console.error("Failed to add product:", e);
//       alert(`Failed to add product: ${e?.message || "Unknown error"}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Columns (with delete wired)
//   const columns = React.useMemo(() => makeColumns(handleDelete), []);

//   // Client-side global filter across name / hsCode / productType
//   const filteredData = React.useMemo(() => {
//     const q = globalFilter.trim().toLowerCase();
//     if (!q) return products;
//     return products.filter((p) =>
//       [p.name, p.hsCode, p.productType].some((v) =>
//         (v ?? "").toLowerCase().includes(q)
//       )
//     );
//   }, [products, globalFilter]);

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     state: { sorting, columnVisibility },
//     onSortingChange: setSorting,
//     onColumnVisibilityChange: setColumnVisibility,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   if (loading) return <div className="p-6">Loading products…</div>;
//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           <p className="font-semibold">Error</p>
//           <p>{error}</p>
//           <Button className="mt-3" onClick={fetchProducts}>
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-6">
//       <div className="flex items-start py-4">
//         <div className="relative max-w-sm w-full ">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search name / HS / category…"
//             value={globalFilter}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               className="ml-auto bg-white border border-gray-200 hover:bg-gray-50 shadow-sm text-gray-700 flex items-center gap-1"
//             >
//               Columns
//               <ChevronDown className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             align="end"
//             className="bg-white shadow-lg border border-gray-200 rounded-md p-1 w-44"
//           >
//             <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider mb-1">
//               Toggle Columns
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator className="my-1" />
//             {table
//               .getAllColumns()
//               .filter((c) => c.getCanHide())
//               .map((c) => (
//                 <DropdownMenuCheckboxItem
//                   key={c.id}
//                   className="flex items-center gap-2 capitalize text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
//                   checked={c.getIsVisible()}
//                   onCheckedChange={(v) => c.toggleVisibility(!!v)}
//                 >
//                   <span>{c.id}</span>
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <Dialog open={addOpen} onOpenChange={setAddOpen}>
//           <DialogTrigger
//             asChild
//             className="ml-auto bg-white border border-gray-200 hover:bg-gray-50 shadow-sm text-gray-700 flex items-center gap-1"
//           >
//             <Button className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               Add Product
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200 shadow-xl">
//             <DialogHeader>
//               <DialogTitle className="text-lg font-semibold">
//                 Add Product
//               </DialogTitle>
//               <DialogDescription className="text-sm text-gray-500">
//                 Create a new product. Fields marked * are required.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
//               <Input
//                 placeholder="Name *"
//                 value={newProduct.name}
//                 onChange={(e) =>
//                   setNewProduct((s) => ({ ...s, name: e.target.value }))
//                 }
//               />
//               <Input
//                 placeholder="Category *"
//                 value={newProduct.productType}
//                 onChange={(e) =>
//                   setNewProduct((s) => ({ ...s, productType: e.target.value }))
//                 }
//               />
//               <Input
//                 placeholder="HS Code *"
//                 value={newProduct.hsCode}
//                 onChange={(e) =>
//                   setNewProduct((s) => ({ ...s, hsCode: e.target.value }))
//                 }
//               />
//               <Input
//                 placeholder="Brand (optional)"
//                 value={newProduct.brand || ""}
//                 onChange={(e) =>
//                   setNewProduct((s) => ({ ...s, brand: e.target.value }))
//                 }
//               />
//               <Input
//                 placeholder="Model (optional)"
//                 value={newProduct.model || ""}
//                 onChange={(e) =>
//                   setNewProduct((s) => ({ ...s, model: e.target.value }))
//                 }
//               />
//             </div>

//             <DialogFooter className="mt-4">
//               <DialogClose asChild>
//                 <Button variant="outline" disabled={saving}>
//                   Cancel
//                 </Button>
//               </DialogClose>
//               <Button onClick={handleCreate} disabled={saving}>
//                 {saving ? "Adding…" : "Add Product"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
//         <Table className="w-full text-sm">
//           <TableHeader>
//             {table.getHeaderGroups().map((hg) => (
//               <TableRow
//                 key={hg.id}
//                 className="hover:bg-gray-50 even:bg-gray-50 transition-colors"
//               >
//                 {hg.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     className="bg-gray-100 font-semibold text-gray-700"
//                   >
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>

//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                   className={deleting === row.original.id ? "opacity-50" : ""}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={table.getAllColumns().length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between py-4">
//         <div className="text-sm text-gray-600">
//           Page{" "}
//           <span className="font-medium">
//             {table.getState().pagination.pageIndex + 1}
//           </span>{" "}
//           of <span className="font-medium">{table.getPageCount()}</span>
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Copy,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

type ApiResponse<T> = { success: boolean; message: string; data: T };

export type Product = {
  id: number;
  name: string;
  productType: string;
  hsCode: string;
  brand?: string | null;
  model?: string | null;
};

type NewProduct = {
  name: string;
  productType: string;
  hsCode: string;
  brand?: string | null;
  model?: string | null;
};

const makeColumns = (onDelete: (p: Product) => void): ColumnDef<Product>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-gray-700 pl-8">{row.original.id}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 60,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "productType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "hsCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        HS Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="tabular-nums">{row.original.hsCode}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const p = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white shadow-lg border border-gray-200 rounded-md p-1 w-44"
          >
            <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(p.id))}
              className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-sm"
            >
              <Copy className="h-4 w-4 text-gray-500" />
              <span>Copy product ID</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => onDelete(p)}
              className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer rounded-sm"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ProductsTable() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // add product form
  const [newProduct, setNewProduct] = React.useState<NewProduct>({
    name: "",
    productType: "",
    hsCode: "",
    brand: "",
    model: "",
  });

  const [addOpen, setAddOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<number | null>(null);

  // fetch products
  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching products from /api/products...");

      // Check if we have a token
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log("Token present:", !!token);
      if (token) {
        console.log("Token preview:", token.substring(0, 50) + "...");
      }

      // Your api client automatically unwraps ApiResponse, so we get Product[] directly
      const data = await api.get<Product[]>("/products");
      console.log("Fetched products:", data);

      const products = Array.isArray(data) ? data : [];
      console.log("Setting products:", products);
      setProducts(products);
    } catch (e: any) {
      console.error("Failed to fetch products:", e);
      console.error("Error details:", {
        message: e?.message,
        stack: e?.stack,
      });

      // Special handling for auth errors
      if (e?.message === "Unauthorized") {
        setError("You are not logged in. Redirecting to login...");
      } else {
        setError(
          e?.message || "Failed to fetch products. Check console for details."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Delete product with proper error handling
  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete product "${p.name}" (ID ${p.id})?`)) return;

    setDeleting(p.id);

    try {
      await api.delete(`/products/${p.id}`);
      // Only update state after successful deletion
      setProducts((arr) => arr.filter((x) => x.id !== p.id));
    } catch (e: any) {
      console.error("Failed to delete product:", e);
      alert(`Failed to delete product: ${e?.message || "Unknown error"}`);
    } finally {
      setDeleting(null);
    }
  };

  // Create product with proper response handling
  const handleCreate = async () => {
    if (!newProduct.name || !newProduct.productType || !newProduct.hsCode) {
      alert("Name, Category, and HS Code are required.");
      return;
    }

    setSaving(true);

    try {
      console.log("Creating product:", newProduct);

      // Check token before request
      const token = localStorage.getItem("token");
      console.log("Token present for POST:", !!token);

      // Your api client automatically unwraps ApiResponse, so we get Product directly
      const createdProduct = await api.post<Product>("/products", newProduct);
      console.log("Created product:", createdProduct);

      if (createdProduct && createdProduct.id) {
        // Add the new product to the list
        setProducts((arr) => [createdProduct, ...arr]);

        // Close dialog and reset form
        setAddOpen(false);
        setNewProduct({
          name: "",
          productType: "",
          hsCode: "",
          brand: "",
          model: "",
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (e: any) {
      console.error("Failed to add product:", e);
      console.error("Error message:", e?.message);
      console.error("Error stack:", e?.stack);

      // Show more detailed error message
      if (e?.message === "Unauthorized") {
        alert("Session expired. Please log in again.");
        // The api client will redirect to login
      } else {
        alert(`Failed to add product: ${e?.message || "Unknown error"}`);
      }
    } finally {
      setSaving(false);
    }
  };

  // Columns (with delete wired)
  const columns = React.useMemo(() => makeColumns(handleDelete), []);

  // Client-side global filter across name / hsCode / productType
  const filteredData = React.useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.hsCode, p.productType].some((v) =>
        (v ?? "").toLowerCase().includes(q)
      )
    );
  }, [products, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <div className="p-6">Loading products…</div>;
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
          <Button className="mt-3" onClick={fetchProducts}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-start py-4">
        <div className="relative max-w-sm w-full ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name / HS / category…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto bg-white border border-gray-200 hover:bg-gray-50 shadow-sm text-gray-700 flex items-center gap-1"
            >
              Columns
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white shadow-lg border border-gray-200 rounded-md p-1 w-44"
          >
            <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Toggle Columns
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  className="flex items-center gap-2 capitalize text-sm text-gray-700 hover:bg-gray-100 rounded-sm cursor-pointer"
                  checked={c.getIsVisible()}
                  onCheckedChange={(v) => c.toggleVisibility(!!v)}
                >
                  <span>{c.id}</span>
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            asChild
            className="ml-auto bg-white border border-gray-200 hover:bg-gray-50 shadow-sm text-gray-700 flex items-center gap-1"
          >
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Add Product
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Create a new product. Fields marked * are required.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <Input
                placeholder="Name *"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, name: e.target.value }))
                }
              />
              <Input
                placeholder="Category *"
                value={newProduct.productType}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, productType: e.target.value }))
                }
              />
              <Input
                placeholder="HS Code *"
                value={newProduct.hsCode}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, hsCode: e.target.value }))
                }
              />
              <Input
                placeholder="Brand (optional)"
                value={newProduct.brand || ""}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, brand: e.target.value }))
                }
              />
              <Input
                placeholder="Model (optional)"
                value={newProduct.model || ""}
                onChange={(e) =>
                  setNewProduct((s) => ({ ...s, model: e.target.value }))
                }
              />
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Adding…" : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table className="w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="hover:bg-gray-50 even:bg-gray-50 transition-colors"
              >
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-gray-100 font-semibold text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={deleting === row.original.id ? "opacity-50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-600">
          Page{" "}
          <span className="font-medium">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          of <span className="font-medium">{table.getPageCount()}</span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
