"use client";

import { useState } from "react";

export default function AnnotationToolbar({ onHighlight, onUnderline }) {
  const [color, setColor] = useState("#FFD700");

  return (
    <div className="flex space-x-2 p-2 bg-gray-200">
      <button 
        className="bg-yellow-400 px-4 py-2 rounded cursor-pointer hover:bg-yellow-500 active:bg-yellow-600" 
        onClick={() => onHighlight(color)}
      >
        Highlight
      </button>
      <button 
        className="bg-blue-400 px-4 py-2 rounded cursor-pointer hover:bg-blue-500 active:bg-blue-600" 
        onClick={() => onUnderline(color)}
      >
        Underline
      </button>
      <input 
        type="color" 
        value={color} 
        onChange={(e) => setColor(e.target.value)} 
        className="cursor-pointer"
      />
    </div>
  );
}
