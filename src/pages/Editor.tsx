import { useEffect, useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import Split from "react-split"
import ReactMarkdown from "react-markdown"
import { io, Socket } from 'socket.io-client';
import { Eye, Code2 } from 'lucide-react';

// Safe HTML decoder using DOMParser
const safeHtmlDecode = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.innerHTML;
};

export default function Editor() {
  const socketRef = useRef<Socket | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    // Listen for the converted HTML response from the server
    socketRef.current.on('htmlResponse', (data) => {
      if (data.error) {
        console.error(data.error);
      } else {
        console.log('Original HTML:', data.html);
        const decodedHtml = safeHtmlDecode(data.html);
        console.log('Decoded HTML:', decodedHtml);
        setHtml(decodedHtml); // Update the live HTML preview with decoded HTML
      }
    });

    // Send initial markdown for conversion
    if (socketRef.current) {
      socketRef.current.emit('markdownToHtml', { markdown });
    }

    // Clean up the socket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('htmlResponse');
        socketRef.current.disconnect();
      }
    };
  }, []); // Only run once on mount

  // Add effect to handle markdown changes
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit('markdownToHtml', { markdown });
    }
  }, [markdown]); // Run whenever markdown changes

  const handleMarkdownChange = (e: { target: { value: any; }; }) => {
    let markdownText = e.target.value;
    setMarkdown(markdownText);
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="h-[calc(100vh-48px)] bg-[#0E0E0E] mt-3">
      <Split 
        className="flex h-full"
        sizes={[50, 50]}
        minSize={10}
        gutterSize={8}
        gutterAlign="center"
        gutter={() => {
          // Render a custom gutter element (for dragging)
          const gutter = document.createElement('div');
          gutter.className = 'gutter';
          return gutter;
        }}
        gutterStyle={() => ({
          backgroundColor: "#333",
          width: "8px", // Define width for horizontal splitter
          cursor: "col-resize",
        })}
        direction="horizontal"
        snapOffset={30}
        dragInterval={1}
      >
        <div className="h-full bg-black border-r border-[#1E1E1E] overflow-hidden">
          <Textarea
            value={markdown}
            onChange={handleMarkdownChange}
            className="w-full h-full resize-none bg-black border border-[#1E1E1E] text-white p-4 focus-visible:ring-0"
            placeholder="Write your markdown here..."
          />
        </div>
        <div className="h-full bg-white">
          <div className="flex justify-end p-2 bg-gray-100 border-b">
            <button
              onClick={togglePreview}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 bg-white rounded border hover:bg-gray-50"
            >
              {isPreview ? (
                <>
                  <Code2 className="w-4 h-4" />
                  <span>Show HTML</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </>
              )}
            </button>
          </div>
          <div className="h-[calc(100%-48px)] overflow-y-auto p-4">
            {isPreview ? (
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: html }} 
              />
            ) : (
              <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                {html}
              </pre>
            )}
          </div>
        </div>
      </Split>
    </div>
  )
}