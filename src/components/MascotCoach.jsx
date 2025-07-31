// src/components/MascotCoach.jsx
import React from "react";
import { motion } from "framer-motion";
import MascotAxelSVG from "../assets/mascotAxel";

export default function MascotCoach({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-xs mx-auto bg-zinc-900 p-4 rounded-xl shadow-lg flex items-center gap-4"
    >
      <MascotAxelSVG className="w-24 h-28" />
      <p className="text-yellow-400 font-montserrat text-lg">{message}</p>
    </motion.div>
  );
}
