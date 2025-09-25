import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default async function ToolPage({ params }) {
  const { slug } = await params;

  const querySnapshot = await getDocs(collection(db, "tools"));
  const tools = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const tool = tools.find((t) => t.slug === slug);
  const relatedTools = tools.filter(
    (t) => t.category === tool?.category && t.slug !== slug
  );

  if (!tool) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <h1 className="text-2xl">❌ Not found</h1>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>{tool.name} | Alpha – AI ToolCity</title>
        <meta name="description" content={tool.description} />
        <meta property="og:title" content={tool.name} />
        <meta property="og:description" content={tool.description} />
        <meta
          property="og:image"
          content={tool.image || "/default-og-image.jpg"}
        />
        <meta
          property="og:url"
          content={`https://www.aitoolcity.com/tool/${tool.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen  text-white px-6 py-16">
        {/* Hero / Tool Overview */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Tool Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full -z-10"></div>
            <Image
              src={
                tool.image ||
                "https://via.placeholder.com/600x400?text=No+Image"
              }
              alt={tool.name}
              width={700}
              height={400}
              className="w-full h-80 object-cover rounded-3xl shadow-2xl border border-white/10"
            />
          </div>

          {/* Right: Tool Info */}
          <div>
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent leading-tight">
              {tool.name}
            </h1>
            <span className="inline-block text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full mb-6 shadow-md">
              {tool.category}
            </span>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              {tool.description}
            </p>

            {tool.longDescription && (
              <p className="text-base text-gray-400 leading-7 mb-10 whitespace-pre-line">
                {tool.longDescription}
              </p>
            )}

            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
              🚀 Visit {tool.name}
            </a>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="max-w-7xl mx-auto mt-32">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">
              🔍 Related Tools You Might Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {relatedTools.map((related) => (
                <Link key={related.id} href={`${related.slug}`} passHref>
                  <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-500 transition cursor-pointer hover:shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition"></div>
                    <Image
                      src={
                        related.image ||
                        "https://via.placeholder.com/300x150?text=No+Image"
                      }
                      alt={related.name}
                      width={400}
                      height={200}
                      className="w-full h-44 object-cover rounded-xl mb-5 border border-white/10 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
                      {related.category}
                    </span>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition">
                      {related.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {related.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-32">
          <h2 className="text-2xl font-bold mb-4">
            ⚡ Discover More Powerful AI Tools
          </h2>
          <Link
            href="/"
            className="bg-gradient-to-r from-pink-600 to-purple-700 hover:opacity-90 px-10 py-4 rounded-full font-semibold shadow-lg transition transform hover:scale-105"
          >
            Browse All Tools
          </Link>
        </div>
      </main>
    </>
  );
}
