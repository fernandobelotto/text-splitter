import { useState } from "react";
import { encoding_for_model, TiktokenModel } from "tiktoken";

type Substring = {
  text: string;
  tokens: number;
};

export const useTokenSplitter = ({ initialMaxTokens = 30000 } = {}) => {
  const [textInput, setTextInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<TiktokenModel>("gpt-4o");
  const [substrings, setSubstrings] = useState<Substring[]>([]);
  const [maxTokens, setMaxTokens] = useState(initialMaxTokens);

  const handleSplitText = () => {
    if (!maxTokens || maxTokens <= 0) {
      return;
    }

    const encoding = encoding_for_model(selectedModel as TiktokenModel);
    const tokens = encoding.encode(textInput);
    const chunks: number[][] = [];
    let currentChunk: number[] = [];

    tokens.forEach((token) => {
      currentChunk.push(token);
      if (currentChunk.length >= maxTokens) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
    });

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    const newSubstrings = chunks.map((chunk) => ({
      text: new TextDecoder().decode(encoding.decode(new Uint32Array(chunk))),
      tokens: chunk.length,
    }));

    setSubstrings(newSubstrings);
    encoding.free();
  };

  return {
    textInput,
    setTextInput,
    substrings,
    handleSplitText,
    selectedModel,
    setSelectedModel,
    maxTokens,
    setMaxTokens,
  };
};
