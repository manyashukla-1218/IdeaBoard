"use client";
import React from "react";
import { TypeAnimation } from "react-type-animation";

type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <TypeAnimation
      sequence={[
        "🚀 Supercharged Productivity.",
        1000,
        "🤖 AI-Powered Insights.",
        1000,
      ]}
      speed={50}
      repeat={Infinity}
      className="text-center"
    />
  );
};

export default TypewriterTitle;