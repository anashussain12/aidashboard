"use client";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function CategoryTools({ params }) {
  const { category } = params;
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(15);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      const querySnapshot = await getDocs(collection(db, "tools"));
      const toolList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = toolList.filter(
        (tool) => tool.category?.toLowerCase() === category.toLowerCase()
      );

      setTools(filtered);
      setLoading(false);
    };

    fetchTools();
  }, [category]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 15);
      setLoadingMore(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-72 h-60 bg-white/5 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-6 py-16">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-12 text-center capitalize">
        {category} <span className="text-purple-500">Tools</span>
      </h1>

      {tools.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          🚀 No tools found for <span className="font-bold">{category}</span>
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {tools.slice(0, visibleCount).map((tool) => (
              <div
                key={tool.id}
                className="relative group bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-purple-700/30 transition transform hover:-translate-y-2 backdrop-blur-md"
              >
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={tool.image || "https://via.placeholder.com/300x200"}
                    alt={tool.name}
                    width={400}
                    height={200}
                    className="w-full h-44 object-cover rounded-xl group-hover:scale-105 transition duration-500"
                  />
                </div>
                <h2 className="text-xl font-bold mt-4 group-hover:text-purple-400 transition">
                  {tool.name}
                </h2>
                <p className="text-gray-300 text-sm line-clamp-3 mt-2">
                  {tool.description}
                </p>
                <Link
                  href={tool.link}
                  target="_blank"
                  className="inline-block mt-4 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Visit Tool →
                </Link>
              </div>
            ))}
          </div>

          {visibleCount < tools.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition text-white font-semibold rounded-lg shadow-md ${
                  loadingMore ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
