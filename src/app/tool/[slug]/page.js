import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Navbar from "@/app/Components/Navbar";

export default async function ToolPage({ params }) {
  const { slug } = params;

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
      <main className="min-h-screen flex items-center justify-center  text-white">
        <h1 className="text-2xl">Tool not found ❌</h1>
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
      {/* Header */}
      <Navbar />
      <main className="min-h-screen  text-white px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white/5 p-8 rounded-2xl shadow-lg border border-white/10">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r to-purple-500 text-transparent bg-clip-text">
            {tool.name}
          </h1>

          <span className="inline-block text-xs font-medium text-white bg-purple-700 px-3 py-1 rounded-full mb-6">
            {tool.category}
          </span>

          <Image
            src={
              tool.image || "https://via.placeholder.com/600x300?text=No+Image"
            }
            alt={tool.name}
            width={600}
            height={300}
            className="w-full h-60 object-cover rounded-lg mb-6 border border-white/10"
          />

          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            {tool.description}
          </p>

          {tool.longDescription && (
            <p className="text-base text-gray-400 mb-10 leading-7 max-w-full break-words">
              {tool.longDescription}
            </p>
          )}

          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            🔗 Visit {tool.name}
          </a>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="max-w-screen-xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6">🧠 Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedTools.map((related) => (
                <Link
                  key={related.id}
                  href={`/tool/${related.slug}`}
                  passHref
                  legacyBehavior
                >
                  <a className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-800 hover:shadow-md transition block">
                    <Image
                      src={
                        related.image ||
                        "https://via.placeholder.com/300x150?text=No+Image"
                      }
                      alt={related.name}
                      width={300}
                      height={150}
                      className="w-full h-36 object-cover rounded mb-3 border border-white/10"
                    />
                    <span className="text-xs bg-purple-700 text-white px-2 py-1 rounded-full mb-2 inline-block">
                      {related.category}
                    </span>
                    <h3 className="text-lg font-semibold">{related.name}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {related.description}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      Zz
    </>
  );
}
