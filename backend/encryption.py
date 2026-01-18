import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from dotenv import load_dotenv

load_dotenv()

# Get encryption key from environment or generate a stable one from a secret
# In production, use a proper KMS or a very secure environment variable
_SECRET_KEY = os.getenv("ENCRYPTION_SECRET", "dev-secret-key-change-in-production")
_SALT = os.getenv("ENCRYPTION_SALT", "default-salt")

def _generate_key(secret: str, salt: str) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt.encode(),
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(secret.encode()))

FERNET_KEY = _generate_key(_SECRET_KEY, _SALT)
cipher_suite = Fernet(FERNET_KEY)

def encrypt_data(data: str) -> str:
    if not data:
        return data
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    if not encrypted_data:
        return encrypted_data
    try:
        return cipher_suite.decrypt(encrypted_data.encode()).decode()
    except Exception:
        return encrypted_data # Fallback for unencrypted data if any
