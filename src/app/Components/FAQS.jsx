"use client";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is an AI tools library, and how does it work?",
      answer:
        "An AI tools library is a collection of AI-powered resources and applications, organized by categories. Users can explore, search, and use these tools to improve productivity and innovation.",
    },
    {
      question: "Can I suggest a new AI tool to be added to the library?",
      answer:
        "Yes, you can! We welcome suggestions for new AI tools to keep our library up-to-date and valuable for our users. Simply visit our 'Suggest a Tool' page, fill out the form with the tool’s details, and our team will review it for inclusion.",
    },
    {
      question: "How do I search for a specific AI tool or category?",
      answer:
        "You can use the search bar or browse categories to quickly find the AI tool you’re looking for.",
    },
  ];

  return (
    <section className=" py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white text-center mb-10 underline decoration-[#9901bf] decoration-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-white shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-xl">{`${index + 1}. ${faq.question}`}</span>
                {openIndex === index ? (
                  <FaMinus className="text-pink-500 text-lg" />
                ) : (
                  <FaPlus className="text-pink-500 text-lg" />
                )}
              </button>

              {openIndex === index && (
                <p className="mt-3 text-gray-200 text-sm">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
