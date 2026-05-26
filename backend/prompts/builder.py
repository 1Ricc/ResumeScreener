def build_screen_prompt(jd: str, resume: str, weights: dict) -> str:
    criteria = "\n".join(
        f"- {k.replace('_', ' ').title()}: weight {v}/10"
        for k, v in weights.items()
    )
    dims = ", ".join(f'"{k}": <int 0-100>' for k in weights)
    return f"""You are a supportive career coach giving honest, direct feedback to a job applicant about their resume.
Write in second person ("you", "your") as if speaking directly to the candidate.
Weight your evaluation using these criteria:
{criteria}

Return ONLY valid JSON matching this exact schema, no other text:
{{"score": <int 0-100>, "summary": "<one paragraph addressed directly to the candidate, e.g. 'Your resume shows...' or 'You bring strong...'>", "strengths": [{{"title": "<short title>", "body": "<1-2 sentences addressed to the candidate>"}}], "gaps": [{{"title": "<short title>", "body": "<1-2 sentences addressed to the candidate>"}}], "tips": ["<actionable tip addressed to the candidate, starting with a verb e.g. 'Add...', 'Highlight...', 'Consider...'>"], "breakdown": {{{dims}}}}}

Return at least 2 strengths, 2 gaps, and 3 tips.

Job Description:
{jd}

Resume:
{resume}"""
