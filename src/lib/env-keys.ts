/**
 * Utility pro práci s private keys v .env souboru
 * Private keys jsou uloženy jako base64 v .env pro bezpečnost
 */

/**
 * Dekóduje base64 private key z .env na ASCII string
 * @param base64Key - Base64 encoded private key z .env
 * @returns Private key s správnými newline znaky
 */
export function decodePrivateKey(base64Key: string | undefined): string {
  if (!base64Key) {
    throw new Error('PRIVATE_KEY_BASE64 not configured in .env');
  }
  
  try {
    return Buffer.from(base64Key, 'base64').toString('utf8');
  } catch (error) {
    throw new Error(`Failed to decode PRIVATE_KEY_BASE64: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Enkóduje private key na base64 pro .env
 * Tuto funkci používej pouze lokálně pro generování .env obsahu
 * @param privateKey - Full private key s BEGIN/END
 * @returns Base64 encoded string pro vložení do .env
 */
export function encodePrivateKey(privateKey: string): string {
  return Buffer.from(privateKey).toString('base64');
}

/**
 * Validates if a private key is properly formatted
 * @param privateKey - Decoded private key
 * @returns true if valid format
 */
export function isValidPrivateKeyFormat(privateKey: string): boolean {
  return (
    privateKey.includes('-----BEGIN PRIVATE KEY-----') &&
    privateKey.includes('-----END PRIVATE KEY-----')
  );
}
