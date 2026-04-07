import openai
import os

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_job_search_insight(analysis: dict) -> str:
    prompt = f"""
You are a supportive career coach reviewing someone's job search progress.
Talk to them directly, like a mentor would. Be real with them.

Here is their data:

- They have sent out {analysis.get('total_applications', 0)} applications
- {analysis.get('response_rate_pct', 0)}% of those got a response
- Their application activity is {analysis.get('application_trend', 'unknown')} week over week
- Here is how their applications break down by status: {analysis.get('status_breakdown', {})}
- Their average AI resume match score is {analysis.get('avg_ai_match_score', 'N/A')} out of 100
- The companies they have applied to most: {analysis.get('top_companies', {})}

Write 3 short paragraphs:

Paragraph 1: Tell them honestly how their search is going overall.
Use their numbers to paint a clear picture. Do not sugarcoat it
but do not be harsh either. Just be real.

Paragraph 2: Point out what is actually working for them and
what is not. Be specific. Reference their actual numbers.

Paragraph 3: Give them 2 or 3 things they should do differently
or keep doing. Make it feel like advice from someone who
genuinely wants them to succeed.

Write like a real person talking to another real person.
No corporate language. No bullet points. Just honest,
warm, direct paragraphs.
"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600
    )
    return response.choices[0].message.content