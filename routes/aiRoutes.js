
const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 15000,
      maxRetries: 0,
    })
  : null;

// Track requests by task title to limit repeated calls.
const recentRequests = new Map();

router.post("/generate-description", async (req, res) => {
  const title =
    typeof req.body.title === "string" ? req.body.title.trim() : "";

  if (!title) {
    return res.status(400).json({
      message: "Task title is required.",
    });
  }

  if (title.length > 200) {
    return res.status(400).json({
      message: "Task title must be 200 characters or fewer.",
    });
  }

  const key = title.toLowerCase();
  const now = Date.now();
  const lastRequest = recentRequests.get(key);

  if (lastRequest && now - lastRequest < 60_000) {
    return res.status(429).json({
      message: "Please wait one minute before requesting another suggestion for this task.",
    });
  }

  recentRequests.set(key, now);

  // Keep the map from growing indefinitely.
  for (const [savedTitle, timestamp] of recentRequests) {
    if (now - timestamp >= 60_000) {
      recentRequests.delete(savedTitle);
    }
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("AI API key is not configured.");
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Write a clear, practical task description in 2-4 sentences. Do not complete the task; describe its goal and useful steps.",
        },
        {
          role: "user",
          content: `Generate a description for this task: ${title}`,
        },
      ],
      max_tokens: 150,
    });

    const description =
      response.choices[0]?.message?.content?.trim();

    if (!description) {
      throw new Error("AI returned an empty description.");
    }

    return res.json({ description, fallback: false });
  } catch (error) {
    console.error("AI description generation failed:", error.message);

    return res.status(200).json({
      description: "",
      fallback: true,
      message:
        "AI suggestions are temporarily unavailable. You can write or edit the description manually.",
    });
  }
});

module.exports = router;
