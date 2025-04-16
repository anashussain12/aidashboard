import React from "react";
import { TbMathGreater } from "react-icons/tb";

import SearchBar from "./SearchBar";
const Discover = () => {
    let a = ">"
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 ">
          <div className="text-4xl md:text-5xl lg:text-7xl flex justify-center items-center">
            <p className="text-center font-black justify-center items-center tracking-tighter">
              Discover Best <span style={{ color: "#C238A3" }}>AI</span>{" "}
              <span style={{ color: "#F14B7F" }}>Tools</span> That <br /> Make
              Your Work Easy!
            </p>
          </div>

          <div className=" text-[#FFFFFF] px-4 py-5 mt-5 text-[16px] xl:px-[150px] ">
            <p className="flex justify-center items-center text-center ">
              Discover and unlock innovation with the latest AI tools. Stay
              ahead of trends, elevate projects, <br /> and transform ideas into
              reality with the most advanced AI tools in real-time.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;
