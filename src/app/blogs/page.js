import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export default async function BlogPage() {
  const res = await fetch(`${API_URL}/api/articles?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <p className="text-center text-red-500">Failed to load blogs.</p>;
  }

  const { data } = await res.json();

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No blogs found.</p>;
  }

  return (
    <section
      className="min-h-screen max-w-7xl mx-auto px-6 py-20"
      // style={{
      //   background:
      //     "linear-gradient(270deg, #130428, #130428, #38126D, #130428, #130428)",
      // }}
    >
      {/* Header */}
      <div className="text-center mb-16">
        <h1
          className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #C238A3, #F14B7F, #9200C2)",
          }}
        >
          Our Latest Blogs
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Insights, tutorials, and stories crafted with care.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((article) => {
          const { id, title, description, slug, image, author } = article;

          const imageUrl = image?.url
            ? image.url
            : "https://via.placeholder.com/1200x500.png?text=No+Image";

          return (
            <div
              key={id}
              className="group relative backdrop-blur-lg border border-white/10 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col"
            >
              {/* Hover Gradient Border */}
              <div
                className="absolute inset-0 rounded-3xl p-[2px] opacity-0 group-hover:opacity-100 transition duration-500"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #C238A3, #F14B7F, #9200C2)",
                }}
              >
                <div className="h-full w-full rounded-3xl bg-[#130428]"></div>
              </div>

              {/* Image */}
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="relative p-6 flex flex-col flex-grow z-10 text-white">
                <span
                  className="inline-block w-fit px-3 py-1 mb-3 text-xs font-medium rounded-full shadow"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #C238A3, #F14B7F, #9200C2)",
                    color: "#fff",
                  }}
                >
                  {author || "Unknown"}
                </span>

                <h2
                  className="text-2xl font-bold mb-3 group-hover:opacity-90 transition bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #C238A3, #F14B7F, #9200C2)",
                  }}
                >
                  {title}
                </h2>

                <p className="text-gray-300 flex-grow line-clamp-3">
                  {description}
                </p>

                <div className="mt-6">
                  <Link
                    href={`/blogpost/${slug}`}
                    className="inline-block px-5 py-2 text-sm font-medium rounded-lg text-white shadow hover:opacity-90 transition"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #C238A3, #F14B7F, #9200C2)",
                    }}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
