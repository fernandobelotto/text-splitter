import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTokenSplitter } from "./hooks/useTokenSplitter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiktokenModel } from "tiktoken";
import { Input } from "@/components/ui/input";
import { MODEL_OPTIONS } from "./MODEL_OPTIONS";

export const App: React.FC = () => {
  const {
    textInput,
    setTextInput,
    substrings,
    handleSplitText,
    selectedModel,
    setSelectedModel,
    maxTokens,
    setMaxTokens,
  } = useTokenSplitter();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Text Splitter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select
              value={selectedModel}
              onValueChange={(value) =>
                setSelectedModel(value as TiktokenModel)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MODEL_OPTIONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={maxTokens}
              onChange={(e: { target: { value: any } }) =>
                setMaxTokens(Number(e.target.value))
              }
              className="w-32"
              placeholder="Max tokens"
              min="1"
            />
          </div>
          <Textarea
            className="min-h-[200px] resize-none"
            placeholder="Enter your text here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <Button size="lg" className="w-full" onClick={handleSplitText}>
            Split Text
          </Button>
        </CardContent>
      </Card>

      {substrings.length > 0 && (
        <div className="mt-6 space-y-4">
          {substrings.map((substring, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Tokens: {substring.tokens}
                  </p>
                  <p className="line-clamp-2 text-sm">{substring.text}</p>
                  <CopyToClipboard text={substring.text}>
                    <Button variant="secondary" size="sm" className="w-full">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </Button>
                  </CopyToClipboard>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
