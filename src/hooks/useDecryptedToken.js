import { useEffect, useState } from 'react';

// Function to decrypt the token
async function decryptToken(encryptedToken, key, iv) {
  const dec = new TextDecoder();

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedToken
  );

  return dec.decode(new Uint8Array(decrypted));
}

// Custom hook to retrieve and decrypt the token
const useDecryptedToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getDecryptedToken = async () => {
      try {
        const keyData = JSON.parse(localStorage.getItem('encryptionKey'));
        const ivBase64 = localStorage.getItem('iv');
        const encryptedTokenBase64 = localStorage.getItem('encryptedToken');

        if (!keyData || !ivBase64 || !encryptedTokenBase64) {
          throw new Error('No token found');
        }

        // Convert back from base64
        const key = await crypto.subtle.importKey('jwk', keyData, { name: "AES-GCM" }, true, ['encrypt', 'decrypt']);
        const iv = new Uint8Array(atob(ivBase64).split('').map(char => char.charCodeAt(0)));
        const encryptedToken = new Uint8Array(atob(encryptedTokenBase64).split('').map(char => char.charCodeAt(0)));

        const decryptedToken = await decryptToken(encryptedToken, key, iv);
        setToken(decryptedToken);
      } catch (error) {
        console.error("Failed to decrypt token:", error);
      }
    };

    getDecryptedToken();
  }, []);

  return token;
};

export default useDecryptedToken;
