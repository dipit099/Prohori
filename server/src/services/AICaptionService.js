// src/services/AICaptionService.js
const { ChatOpenAI } = require("@langchain/openai");
const { CustomListOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
require('dotenv').config();

const analyzeImage = async (imageUrl) => {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    maxTokens: 1024,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    new AIMessage({
      content:
        "You are assisting a citizen in reporting a crime on a safety platform in Bangladesh. Keep it factual, concerned, and clear.",
    }),
    new HumanMessage({
      content: [
        { type: "text", text: "As a concerned citizen, I am reporting a crime. Please try to describe the following things if possible to extract from the image(mentioning all of these is not mandatory): whats happening in this image, mention any visible evidence, and highlight anything that could help identify the suspects or situation." },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    }),
  ]);

  const chain = prompt.pipe(model).pipe(new CustomListOutputParser({ separator: `\n` }));
  const response = await chain.invoke();

  return response;
};

const generateCrimeReportCaption = async (imageUrls) => {
  const imageDescriptions = await Promise.all(
    imageUrls.map((url) => analyzeImage(url))
  );

  const finalPrompt = ChatPromptTemplate.fromMessages([
    new AIMessage({
      content: "You are a crime report generator. Write a concise report based on provided image analyses.",
    }),
    new HumanMessage({
      content: `Based on the following image observations:\n${imageDescriptions.join(", ")}\n\nWrite a clear, concise crime report post as if Im a concerned citizen reporting this on a community forum. Mention key details, the situation, and end with a call to action if necessary.`,
    }),
  ]);

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    maxTokens: 1024,
  });

  const reportChain = finalPrompt.pipe(model);
  const finalReport = await reportChain.invoke();

  return finalReport.content;
};

module.exports = {
    generateCrimeReportCaption
};