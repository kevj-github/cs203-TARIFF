import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Product {
	id: number;
	name: string;

	productType: string;
	hsCode: string;
	brand: string | null;
	model: string | null;
}

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const data = await api.get<Product[]>("/products");
				setProducts(data);
				setError(null);
			} catch (err) {
				console.error("Error fetching products:", err);
				setError(
					err instanceof Error ? err.message : "Failed to fetch products"
				);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	if (loading) return <p className="p-6">Loading products...</p>;

	if (error)
		return (
			<div className="p-6">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					<p className="font-semibold">Error:</p>
					<p>{error}</p>
				</div>
			</div>
		);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold mb-4">Products</h1>
			<Table>
				<TableCaption>A list of available products</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Category</TableHead>

						<TableHead className="text-right">HS_code</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.map((p) => (
						<TableRow key={p.id}>
							<TableCell className="font-medium">{p.id}</TableCell>
							<TableCell>{p.name}</TableCell>

							<TableCell>{p.productType}</TableCell>
							<TableCell className="text-right">{p.hsCode}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={3}>Total Products</TableCell>
						<TableCell className="text-right">
							{products.length}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
}
