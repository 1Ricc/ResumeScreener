def build_screen_prompt(jd: str, resume: str, weights: dict) -> str:
    criteria = "\n".join(
        f"- {k.replace('_', ' ').title()}: weight {v}/10"
        for k, v in weights.items()
    )
    dims = ", ".join(f'"{k}": <int 0-100>' for k in weights)
    return f"""You are a technical recruiter. Score this resume against the job description.
Weight your evaluation using these criteria:
{criteria}

Return ONLY valid JSON matching this exact schema, no other text:
{{"score": <int 0-100>, "summary": "<one paragraph overall assessment>", "strengths": [{{"title": "<short title>", "body": "<1-2 sentence explanation>"}}], "gaps": [{{"title": "<short title>", "body": "<1-2 sentence explanation>"}}], "tips": ["<actionable improvement tip>"], "breakdown": {{{dims}}}}}

Return at least 2 strengths, 2 gaps, and 3 tips.

Job Description:
{jd}

Resume:
{resume}"""
