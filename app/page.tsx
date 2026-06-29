"use client";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "./components/ProductCard";
type Warehouse = {
  id: string;
  name: string;
  city: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  warehouses: Warehouse[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
  const response = await fetch("/api/products");
  const data = await response.json();
  setProducts(data);
};

useEffect(() => {
  fetchProducts();
}, []);

  const reserveProduct = async (
  productId: string,
  warehouseId: string
) => {
  const response = await fetch("/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      warehouseId,
      quantity: 1,
    }),
  });

  const data = await response.json();

  if (response.ok) {
  window.location.href = `/checkout/${data.id}`;
  }  else {
  toast.error(data.error);
  }
};

  return (
  <>
  <Navbar />

  <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Inventory Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onReserve={reserveProduct}
          />
        ))}
      </div>
    </div>
  </main>
</>
);
}