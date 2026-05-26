from backend.prompts.builder import build_screen_prompt

def test_prompt_contains_weights():
    weights = {"seniority": 8, "stack_match": 3}
    prompt = build_screen_prompt("Engineer needed", "Alice resume", weights)
    assert "Seniority: weight 8/10" in prompt
    assert "Stack Match: weight 3/10" in prompt

def test_prompt_contains_jd_and_resume():
    prompt = build_screen_prompt("We need Python", "I know Python", {"skills": 5})
    assert "We need Python" in prompt
    assert "I know Python" in prompt

def test_prompt_requests_json():
    prompt = build_screen_prompt("jd", "resume", {"skills_match": 5})
    assert "JSON" in prompt
    assert "score" in prompt
    assert "summary" in prompt
    assert "strengths" in prompt
    assert "gaps" in prompt
    assert "tips" in prompt
    assert "breakdown" in prompt
