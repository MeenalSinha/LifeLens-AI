import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-gray-800 mb-2 mt-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-indigo-700 mb-2 mt-4 border-b pb-1 border-indigo-100" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-md font-semibold text-gray-700 mb-1 mt-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-700" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-300 pl-4 italic text-gray-600 my-2" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
