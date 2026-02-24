import os

from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

# Master key should be in .env. If not, we generate one for development.
# In production, this should NEVER be auto-generated.
MASTER_KEY = os.getenv("MASTER_CRYPTO_KEY")

if not MASTER_KEY:
    MASTER_KEY = Fernet.generate_key().decode()
    print(f"WARNING: MASTER_CRYPTO_KEY not found in .env. Generated temporary key: {MASTER_KEY}")

master_cipher = Fernet(MASTER_KEY.encode())


def generate_file_key():
    return Fernet.generate_key()


def encrypt_content(content: bytes, file_key: bytes) -> bytes:
    cipher = Fernet(file_key)
    return cipher.encrypt(content)


def decrypt_content(encrypted_content: bytes, file_key: bytes) -> bytes:
    cipher = Fernet(file_key)
    return cipher.decrypt(encrypted_content)


def encrypt_file_key(file_key: bytes) -> str:
    return master_cipher.encrypt(file_key).decode()


def decrypt_file_key(encrypted_file_key: str) -> bytes:
    return master_cipher.decrypt(encrypted_file_key.encode())
