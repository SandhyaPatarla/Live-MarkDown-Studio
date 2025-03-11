import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import Split from "react-split"
import ReactMarkdown from "react-markdown"

export default function Editor() {
  const [markdown, setMarkdown] = useState("")

  return (
    <div className="h-[calc(100vh-48px)]">
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
        <div className="h-full bg-[#1D1D1D] overflow-hidden">
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full resize-none bg-[#1D1D1D] text-white p-4 border-none focus-visible:ring-0"
            placeholder="Write your markdown here..."
          />
        </div>
        <div className="h-full bg-white overflow-y-auto p-4 prose prose-sm max-w-none">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </Split>
    </div>
  )
}