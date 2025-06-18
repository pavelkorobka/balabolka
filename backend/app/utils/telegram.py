# backend/app/utils/telegram.py

import hashlib
import hmac
from urllib.parse import parse_qsl
from typing import Dict

from app.config import settings

def parse_init_data(init_data: str) -> Dict[str, str]:
    data = dict(parse_qsl(init_data, keep_blank_values=True))
    return data

def check_telegram_signature(init_data: str, bot_token: str) -> bool:
    parsed = parse_init_data(init_data)
    received_hash = parsed.pop("hash", None)
    if not received_hash:
        return False

    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(parsed.items()))
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    return hmac.compare_digest(received_hash, calculated_hash)
