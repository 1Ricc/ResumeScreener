def build_screen_prompt(jd: str, resume: str, weights: dict) -> str:
    criteria = "\n".join(
        f"- {k.replace('_', ' ').title()}: weight {v}/10"
        for k, v in weights.items()
    )
    return f"""You are a technical recruiter. Score this resume against the job description.
Weight your evaluation using these criteria:
{criteria}

Return ONLY valid JSON matching this exact schema, no other text:
{{"score": <int 0-100>, "reasoning": "<string>", "gaps": ["<string>", ...], "questions": ["<string>", ...]}}

Job Description:
{jd}

Resume:
{resume}"""
