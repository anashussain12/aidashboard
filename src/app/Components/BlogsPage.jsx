import React from "react";
import Image from "next/image";
import Link from "next/link";

const BlogPage = () => {
  let a = ">";

  return (
    <div>
      <div className="mt-10  pt-8  flex justify-between items-center">
        <h1 className="px-1 text-xl md:text-4xl font-black tracking-tighter underline decoration-[#9901bf] decoration-4">
          Blogs
        </h1>
        <Link
          href={"/category"}
          className="hover:underline text-sm cursor-pointer"
        >
          View all {a}
        </Link>
      </div>
      <p className="pt-4 tracking-tighter  text-sm md:text-2xl">
        Explore Ai's wonders,learn, and stay updated with our insightful Ai blogs.
      </p>
      <div className="py-20 ">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            {/* Card 1 */}
            <div className="rounded-xl p-4 bg-[#230d34] cursor-pointer hover:bg-[#321247] transition">
              <div className="relative w-full h-48">
                <Image
                  src="/assets/BONE.jpg"
                  fill
                  className="object-cover"
                  alt="Img"
                />
              </div>
              <div>
                <h3 className="text-2xl py-2 font-black">
                  This blog is about the increase in eth....
                </h3>
                {/* <p className="text-sm">This is the description</p> */}
                {/* <p className="text-sm">This is the description</p> */}
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
