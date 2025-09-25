"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import categories from "../Components/data"; // adjust path if needed

const Page = () => {
  // only take first 3 categories
  const visibleCategories = categories.slice(0, 6);

  return (
    <>

      {/* Grid with only 3 cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-20">
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
    </>
  );
};

export default Page;
