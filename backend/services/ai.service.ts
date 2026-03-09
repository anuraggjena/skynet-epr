import axios from "axios"

export async function generateEprRemarks(
  overallRating: number,
  technicalRating: number,
  nonTechnicalRating: number,
  personName: string,
  role: string,
  course: string
) {

  const prompt = `
  You are a senior flight instructor writing a professional trainee evaluation
  for a flight training academy.

  Write the evaluation in plain text only.
  Do NOT use markdown symbols such as **, #, *, or bullet formatting.

  Student Name: ${personName}
  Training Program: ${course}

  Ratings:
  Overall: ${overallRating}/5
  Technical Skills: ${technicalRating}/5
  Non-Technical Skills: ${nonTechnicalRating}/5

  Write the evaluation using the following sections:

  Performance Review:
  Provide a brief overview of the trainee's overall progress during the training period.

  Strengths:
  Mention strengths related to technical knowledge, simulator performance, flight procedures,
  navigation, aircraft systems, or regulatory understanding.

  Areas for Improvement:
  Mention areas such as situational awareness, decision making, workload management,
  communication, crew resource management (CRM), or confidence during complex scenarios.

  Recommendation:
  Provide a short professional recommendation for continued training.

  Guidelines:
  - Write in a professional instructor tone
  - Plain text only
  - No markdown formatting
  - 120–180 words
  `

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "user", content: prompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  )

  return response.data.choices[0].message.content
}