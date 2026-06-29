"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

type Reservation = {
  id: string;
  quantity: number;
  status: string;
  expiresAt: string;
  product: {
    name: string;
    price: number;
  };
  warehouse: {
    name: string;
    city: string;
  };
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [timeLeft, setTimeLeft] = useState("10:00");
  const [progress, setProgress] = useState(100);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/reservations/${params.id}`)
      .then((res) => res.json())
      .then((data) => setReservation(data));
  }, [params.id]);

  useEffect(() => {
    if (!reservation) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(reservation.expiresAt).getTime();

      const distance = expiry - now;

      if (distance <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(distance / 1000 / 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft(
        `${minutes}:${seconds.toString().padStart(2, "0")}`
      );
      const totalSeconds = 10 * 60;
const remainingSeconds = Math.floor(distance / 1000);

setProgress((remainingSeconds / totalSeconds) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  async function confirmReservation() {
  setLoading(true);

  const response = await fetch(
    `/api/reservations/${reservation?.id}/confirm`,
    {
      method: "POST",
    }
  );

  if (response.ok) {
    toast.success("Purchase Confirmed!");
    router.replace("/");
    router.refresh();
  } else {
    const data = await response.json();
    toast.error(data.error);
  }

  setLoading(false);
}

  async function cancelReservation() {
  setLoading(true);

  const response = await fetch(
    `/api/reservations/${reservation?.id}/release`,
    {
      method: "POST",
    }
  );

  if (response.ok) {
    toast.success("Reservation Cancelled!");
    router.replace("/");
    router.refresh();
  } else {
    const data = await response.json();
    toast.error(data.error);
  }

  setLoading(false);
}

  if (!reservation) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center">
        <h2 className="text-3xl font-bold text-blue-700 animate-pulse">
          Loading Reservation...
        </h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-purple-100 flex items-center justify-center p-8">
     <div className="w-full max-w-4xl rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border border-white p-10">

        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-5xl">
            🛒
          </div>

          <div>
            <h1 className="text-5xl font-extrabold text-slate-800">
              Checkout
            </h1>

            <div className="mt-2 inline-block rounded-full bg-green-100 px-4 py-2 text-green-700 font-semibold">
              ✓ Reservation Created
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-gray-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">💻 Product</p>
          <h2 className="text-3xl font-bold text-slate-800">
            {reservation.product.name}
          </h2>
        </div>

        <div className="mb-5 rounded-2xl border border-gray-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">📍 Warehouse</p>
          <h2 className="text-2xl font-semibold text-slate-800">
            {reservation.warehouse.name}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {reservation.warehouse.city}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-2xl bg-slate-50 border border-gray-200 p-6">
            <p className="text-gray-500 text-sm mb-1">Quantity</p>
            <h2 className="text-4xl font-bold text-slate-800">
              {reservation.quantity}
            </h2>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-gray-200 p-6">
            <p className="text-gray-500 text-sm mb-1">Price</p>
            <h2 className="text-4xl font-bold text-blue-600">
              ₹{reservation.product.price.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-6">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-700">
              ⏳ Reservation Expires In
            </p>

            <div
  className={`text-4xl font-bold ${
    progress > 50
      ? "text-green-600"
      : progress > 20
      ? "text-orange-600"
      : "text-red-600"
  }`}
>
  {timeLeft}
</div>
</div>
          <div className="mt-5 h-3 rounded-full bg-gray-200 overflow-hidden">
  <div
    className="h-full rounded-full bg-orange-500 transition-all duration-1000"
    style={{
      width: `${progress}%`,
    }}
  />
</div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5">

          <button
            onClick={confirmReservation}
            disabled={loading}
            className="rounded-xl bg-green-600 py-4 text-lg font-bold text-white hover:bg-green-700 transition"
          >
            {loading ? "Processing..." : "✅ Confirm Purchase"}
          </button>

          <button
            onClick={cancelReservation}
            disabled={loading}
            className="rounded-xl bg-red-600 py-4 text-lg font-bold text-white hover:bg-red-700 transition"
          >
            {loading ? "Processing..." : "❌ Cancel Reservation"}
          </button>

        </div>
      </div>
    </main>
  );
}