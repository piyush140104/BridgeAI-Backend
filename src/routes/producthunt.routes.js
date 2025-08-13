import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Product Hunt API credentials
const PRODUCT_HUNT_API_KEY = process.env.PRODUCT_HUNT_API_KEY;

// Function to fetch Product Hunt data
const fetchProductsOfMonth = async () => {
    try {
        const response = await axios.post(
            "https://api.producthunt.com/v2/api/graphql",
            {
                query: `
                {
                  posts(order: VOTES, postedAfter: "2024-03-01T00:00:00Z", first: 10) {
                    edges {
                      node {
                        id
                        name
                        tagline
                        votesCount
                        thumbnail {
                          url
                        }
                        website
                      }
                    }
                  }
                }`
            },
            {
                headers: {
                    Authorization: `Bearer ${PRODUCT_HUNT_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.data.posts.edges.map((edge) => ({
            id: edge.node.id,
            name: edge.node.name,
            description: edge.node.tagline,
            votes: edge.node.votesCount,
            image: edge.node.thumbnail?.url || "https://via.placeholder.com/100",
            website: edge.node.website,
        }));
    } catch (error) {
        console.error("Error fetching Product Hunt data:", error.message);
        return [];
    }
};

// API endpoint to get products of the month
router.get("/", async (req, res) => {
    const products = await fetchProductsOfMonth();
    res.json(products);
});

export default router;
