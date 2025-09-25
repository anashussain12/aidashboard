"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import categories from "../Components/data"; // adjust path if needed

const Page = () => {
  const [visibleCount, setVisibleCount] = useState(9); // show first 8
  const [loading, setLoading] = useState(false); // loading state

  const visibleCategories = categories.slice(0, visibleCount);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 9); // load 8 more after 1 sec
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex-1 text-white px-4 sm:px-6 lg:px-28 relative pb-10">
      <div className="mt-10 sm:mt-14 pt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight underline decoration-[#9901bf] decoration-4">
          AI Tool Categories
        </h1>
      </div>

      <p className="pt-3 md:pt-4 text-base sm:text-lg md:text-2xl tracking-tight">
        Unlock innovation with our diverse range of cutting-edge solutions.
      </p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 py-20">
        {visibleCategories.map((cat) => (
          <Link key={cat.title} href={`/category/${cat.title.toLowerCase()}`}>
            <div className="rounded-xl p-4 bg-[#230d34] cursor-pointer hover:bg-[#321247] transition">
              <div className="flex justify-end">
                <Image src={cat.image} alt={cat.title} width={64} height={64} />
              </div>
              <div>
                <h3 className="text-2xl py-2 font-black">{cat.title}</h3>
                <p className="text-sm">{cat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < categories.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={`px-6 py-3 bg-[#9901bf] hover:bg-[#7a0198] transition text-white font-semibold rounded-lg shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
