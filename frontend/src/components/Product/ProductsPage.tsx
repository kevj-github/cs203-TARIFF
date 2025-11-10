import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductsTable from "./ProductsTable";
import { getUser } from "@/lib/auth";

interface Product {
  id: number;
  name: string;

  productType: string;
  hsCode: string;
  brand: string | null;
  model: string | null;
}

export default function ProductsPage() {
  const [, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [newProduct, setNewProduct] = useState({
  //   name: "",
  //   productType: "",
  //   hsCode: "",
  // });

  // Determine admin role from stored user
  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get<Product[]>("/products");
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const handleAdd = async () => {
  //   try {
  //     await api.post("/products", newProduct);
  //     await fetchProducts();
  //     setNewProduct({ name: "", productType: "", hsCode: "" });
  //   } catch (err) {
  //     alert("Failed to add product");
  //   }
  // };

  // const handleDelete = async (id: number) => {
  //   if (!confirm("Delete this product?")) return;
  //   try {
  //     await api.delete(`/products/${id}`);
  //     setProducts(products.filter((p) => p.id !== id));
  //   } catch (err) {
  //     alert("Failed to delete product");
  //   }
  // };

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

      {/* Pass admin gating to table */}
      <ProductsTable isAdmin={isAdmin} />
    </div>
  );
}
