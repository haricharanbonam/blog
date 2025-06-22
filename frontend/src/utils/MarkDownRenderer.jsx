// import React from "react";
// import ReactMarkdown from "react-markdown";
// import rehypeRaw from "rehype-raw";
// import remarkGfm from "remark-gfm";

// const MarkdownRenderer = ({ content }) => {
//   return (
//     <div className="prose dark:prose-invert max-w-none">
//       <ReactMarkdown
//         rehypePlugins={[rehypeRaw]}
//         remarkPlugins={[remarkGfm]}
//         components={{
//           h1: ({ node, ...props }) => (
//             <h1
//               className="mt-8 mb-4 text-3xl font-bold text-indigo-700 dark:text-indigo-300"
//               {...props}
//             />
//           ),
//           h2: ({ node, ...props }) => (
//             <h2
//               className="mt-6 mb-3 text-2xl font-semibold text-indigo-600 dark:text-indigo-200"
//               {...props}
//             />
//           ),
//           h3: ({ node, ...props }) => (
//             <h3
//               className="mt-5 mb-2 text-xl font-semibold text-indigo-500 dark:text-indigo-100"
//               {...props}
//             />
//           ),
//           p: ({ node, ...props }) => (
//             <p
//               className="my-4 leading-relaxed text-gray-800 dark:text-gray-300"
//               {...props}
//             />
//           ),
//           code({ node, inline, className, children, ...props }) {
//             return inline ? (
//               <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-pink-600 font-mono">
//                 {children}
//               </code>
//             ) : (
//               <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto my-6">
//                 <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
//                   {children}
//                 </code>
//               </pre>
//             );
//           },
//           ul: ({ node, ...props }) => (
//             <ul className="list-disc ml-6 my-4 space-y-2" {...props} />
//           ),
//           li: ({ node, ...props }) => (
//             <li className="text-gray-700 dark:text-gray-300" {...props} />
//           ),
//         }}
//       >
//         {content}
//       </ReactMarkdown>
//     </div>
//   );
// };

// export default MarkdownRenderer;

// src/utils/MarkdownRenderer.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "github-markdown-css/github-markdown.css"; // GitHub markdown styling
import "highlight.js/styles/github.css"; // GitHub-style light code highlighting

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      />
    </div>
  );
};

export default MarkdownRenderer;


