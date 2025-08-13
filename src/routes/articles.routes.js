import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const getSummary = async (text) => {
    try {
        if (!text || text.trim() === "") return "Summary not available (No content provided).";

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: `Summarize this article: ${text}` }],
            max_tokens: 100,
        });

        return response.choices?.[0]?.message?.content || "Summary not available.";
    } catch (error) {
        console.error("OpenAI summarization error:", error.response?.data || error.message);
        return "Summary not available (AI Error).";
    }
};

router.get("/", async (req, res) => {
    try {
        let { query } = req.query;
        query = query?.trim() || "entrepreneurship"; // Default topic

        const newsResponse = await axios.get(
            `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`
        );

        const articles = newsResponse.data.articles.slice(0, 5);

        if (!articles.length) {
            return res.json({ message: "No articles found for this topic." });
        }

        console.log(`Fetched ${articles.length} articles.`);
        
        // Summarize each article
        const summarizedArticles = await Promise.all(
            articles.map(async (article) => {
                console.log(`Summarizing: ${article.title}`);
                const textToSummarize = article.description || article.content || article.title;
                const summary = await getSummary(textToSummarize);

                return {
                    title: article.title,
                    link: article.url,
                    summary,
                }; 
            })
        );

        res.json(summarizedArticles);
    } catch (error) {
        console.error("Error fetching articles:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch articles. Try again later." });
    }
});

export default router;
