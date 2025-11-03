import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";


const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export default async function BlogPostPage({ params }) {
    const res = await fetch(
        `${API_URL}/api/articles?filters[slug][$eq]=${params.slug}&populate=*`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return <p className="text-center text-red-500">❌ Failed to load blog.</p>;
    }

    const { data } = await res.json();
    const blog = data?.[0];

    if (!blog) {
        return <p className="text-center text-gray-500">Blog not found.</p>;
    }

    const attributes = blog.attributes || blog;

    const title = attributes.title || "Untitled";
    const description = attributes.description || "";
    const content = attributes.content || "";
    const author =
        attributes?.author?.data?.attributes?.name || attributes.author || "Unknown";

    const imageUrl =
        attributes?.image?.data?.attributes?.url ||
        attributes?.image?.url ||
        "https://via.placeholder.com/1200x500.png?text=No+Image";

    return (
        <article className="min-h-screen px-6 py-20 max-w-4xl mx-auto text-white">
            <div className="relative w-full h-96 mb-12 rounded-3xl overflow-hidden">
                <Image src={imageUrl} alt={title} fill className="object-cover" />
            </div>

            <h1
                className="text-white text-5xl font-extrabold mb-6 bg-clip-text text-transparent"
                
            >
                {title}
            </h1>
            <p className="text-gray-300 mb-6">{description}</p>

            <div className="prose prose-lg max-w-none text-gray-200">
                <BlocksRenderer content={attributes.content} />
            </div>


            {/* Blog Author */}
            <p className="mt-10 text-sm text-gray-400">
                ✍️ Written by{" "}
                <span
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #C238A3, #F14B7F, #9200C2)",
                    }}
                    className="bg-clip-text text-transparent font-semibold"
                >
                    {author}
                </span>
            </p>
        </article>
    );
}
