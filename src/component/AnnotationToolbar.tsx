"use client";

import { useState } from "react";

interface AnnotationToolbarProps {
  onHighlight: (color: string) => void;
  onUnderline: (color: string) => void;
}

export default function AnnotationToolbar({
  onHighlight,
  onUnderline,
}: AnnotationToolbarProps) {
  const [color, setColor] = useState("#FFD700");

  return (
    <div className="flex items-center gap-4 p-5 glass-effect rounded-xl shadow-lg backdrop-blur-sm border border-white/50">
      <div className="flex items-center gap-3">
        <button
          className="px-7 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-xl cursor-pointer hover:from-yellow-500 hover:to-yellow-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          onClick={() => onHighlight(color)}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Highlight
        </button>
        <button
          className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl cursor-pointer hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          onClick={() => onUnderline(color)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Underline
        </button>
      </div>
      <div className="flex items-center gap-3 ml-auto bg-white/60 px-4 py-2 rounded-xl shadow-inner">
        <label className="text-sm font-semibold text-gray-700">Color:</label>
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 cursor-pointer rounded-lg border-2 border-gray-300 hover:border-purple-400 transition-all shadow-inner hover:scale-110 transform"
            title="Choose annotation color"
          />
        </div>
        <div className="w-8 h-8 rounded-lg shadow-sm border-2 border-gray-300" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  );
}
