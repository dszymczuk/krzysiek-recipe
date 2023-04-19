const axios = require("axios");

export default async function handler(req, res) {
  //   response.status(200).json({
  //     body: request.body,
  //     query: request.query,
  //     cookies: request.cookies,
  //   });

  try {
    const ingredients = req.body.ingredients;

    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: `Generate recipes using the following ingredients: ${ingredients.join(
          ", "
        )}`,
        max_tokens: 300,
        n: 3,
        stop: null,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const generatedRecipes = response.data.choices.map((choice) => {
      // Extract recipe details from the generated text
      // This is a simplified example, you may need to adjust the extraction logic
      const lines = choice.text.trim().split("\n");
      const title = lines[0];
      const description = lines.slice(1).join("\n");

      return {
        title,
        description,
        image: "https://via.placeholder.com/150", // Replace with a real image URL
      };
    });

    res.status(200).json(generatedRecipes.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate recipes" });
  }
}
