// import { ChatGroq } from "@langchain/groq";
// import {
//   ChatPromptTemplate,
//   SystemMessagePromptTemplate,
//   HumanMessagePromptTemplate,
// } from "@langchain/core/prompts";
// import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
// import { asynchandler } from "../utils/asynchandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// // Initialize AI Tools
// const model = new ChatGroq({
//   apiKey: process.env.GROQ_API_KEY,
//   model: "llama3-8b-8192",
// });

// const search = new TavilySearchResults({
//   apiKey: process.env.TAVILY_API_KEY,
//   maxResults: 2,
// });

// // System instruction
// const systemInstruction = `
// You are an AI networking assistant. Find professionals, summarize expertise, generate outreach messages, and suggest engagement strategies.
// `;

// const processQuery = asynchandler(async (req, res) => {
//   const { userQuery } = req.body;

//   if (!userQuery) {
//     throw new ApiError(400, "Query is required");
//   }

//   try {
//     const prompt = ChatPromptTemplate.fromMessages([
//       SystemMessagePromptTemplate.fromTemplate(systemInstruction),
//       HumanMessagePromptTemplate.fromTemplate("{user_query}"),
//     ]);

//     const messages = await prompt.formatMessages({ user_query: userQuery });

//     // Get complete response instead of streaming
//     const response = await model.invoke(messages);

//     // Send single JSON response
//     return res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           { content: response.content },
//           "Response generated successfully"
//         )
//       );
//   } catch (error) {
//     console.error("Chatbot Error:", error);
//     throw new ApiError(500, error?.message || "Error processing query");
//   }
// });

// export { processQuery };



import { ChatGroq } from "@langchain/groq";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Initialize AI Model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-8b-8192",
});

// System instruction
const systemInstruction = `
You are an AI networking assistant. Find professionals, summarize expertise, generate outreach messages, and suggest engagement strategies.
Always return a list of professional names when possible.
`;

const generateLinks = (name) => {
  let formattedName = name.toLowerCase().replace(/\s+/g, "");
  return {
    name,
    twitter: `https://twitter.com/${formattedName}`,
    linkedin: `https://www.linkedin.com/in/${formattedName}/`,
  };
};

const processQuery = asynchandler(async (req, res) => {
  const { userQuery } = req.body;

  if (!userQuery) {
    throw new ApiError(400, "Query is required");
  }

  try {
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemInstruction),
      HumanMessagePromptTemplate.fromTemplate("{user_query}"),
    ]);

    const messages = await prompt.formatMessages({ user_query: userQuery });

    // Get AI response
    const response = await model.invoke(messages);
    const content = response.content; // AI-generated text

    // Extract professional names (Modify this based on AI response structure)
    const extractedNames = content.match(/([A-Z][a-z]+ [A-Z][a-z]+)/g) || [];

    // Generate profile links
    const profiles = extractedNames.map(generateLinks);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { content, profiles },
          "Response generated successfully"
        )
      );
  } catch (error) {
    console.error("Chatbot Error:", error);
    throw new ApiError(500, error?.message || "Error processing query");
  }
});

export { processQuery };
