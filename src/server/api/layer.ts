import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const { layer, schema } = getQuery(event);

  if (!layer || !schema) {
    return {
      statusCode: 400,
      body: {
        message: "Layer and schema are required",
      },
    };
  }

  try {
    const url = `https://guymis.servirglobal.net/map/get-extent-layer/?layer=${encodeURIComponent(
      layer
    )}&schema=${encodeURIComponent(schema)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from third-party API");
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        message: error.message || "Internal Server Error",
      },
    };
  }
});
