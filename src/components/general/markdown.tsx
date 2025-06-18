import React from "react";
import ReactMarkdown from "react-markdown";
import { ComponentProps } from "react";
import { ExternalLink } from "lucide-react";
import rehypeSanitize from "rehype-sanitize";
import { defaultSchema } from "rehype-sanitize";

interface MarkdownProps {
  content: string;
  className?: string;
}

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a || []), "href"],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ["http", "https", "thought"],
  },
};

// Custom link component for markdown
const CustomLink = (props: ComponentProps<"a">) => {
  const { href, children } = props;
  if (href?.startsWith("thought://")) {
    return (
      <span className="text-pink-600 underline cursor-pointer hover:text-pink-800">
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
    >
      {children}
      <ExternalLink className="ml-0.5 h-3 w-3 inline" />
    </a>
  );
};

export const Markdown: React.FC<MarkdownProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={` px-4  max-w-none  ${className}`}>
      <ReactMarkdown
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={{
          a: CustomLink,
          p: ({ children }) => <p className="mb-2 text-sm">{children}</p>,
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-2">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 mb-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 mb-2 text-sm">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1 text-sm">{children}</li>,
          code: ({ children }) => (
            <code className="bg-gray-100 px-1 rounded text-sm">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-2 rounded mb-2 overflow-x-auto text-sm">
              {children}
            </pre>
          ),
          hr: () => <hr className="!my-2 border-t-2 border-gray-300" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-4 italic my-2">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
