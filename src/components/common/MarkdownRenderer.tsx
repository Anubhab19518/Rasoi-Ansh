'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content?: string | null;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={`prose-sm max-w-none text-xs sm:text-sm text-[#5C5955] leading-relaxed ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-base sm:text-lg font-bold uppercase tracking-tight text-[#1C1B1A] mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight text-[#1C1B1A] mt-3 mb-1.5" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#B58D59] mt-2.5 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-xs sm:text-sm text-[#5C5955] leading-relaxed mb-2.5 last:mb-0" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-[#1C1B1A]" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-[#3A3937]" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm text-[#5C5955] my-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-4 space-y-1 text-xs sm:text-sm text-[#5C5955] my-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-[#B58D59] pl-3 italic text-xs text-[#7A756D] my-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
