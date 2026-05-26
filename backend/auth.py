import os
from functools import lru_cache
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError

security = HTTPBearer(auto_error=False)

@lru_cache(maxsize=1)
def _get_jwks() -> dict:
    url = f"https://{os.getenv('CLERK_FRONTEND_API', 'invalid')}/.well-known/jwks.json"
    resp = httpx.get(url, timeout=5.0)
    resp.raise_for_status()
    return resp.json()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    # Dev bypass: set DEV_BYPASS_USER_ID in .env to skip JWT verification locally
    bypass_user = os.getenv("DEV_BYPASS_USER_ID")
    if bypass_user:
        return bypass_user

    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = credentials.credentials
    try:
        jwks = _get_jwks()
        header = jwt.get_unverified_header(token)
        key = next((k for k in jwks["keys"] if k["kid"] == header["kid"]), None)
        if not key:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        payload = jwt.decode(token, key, algorithms=["RS256"])
        return payload["sub"]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
