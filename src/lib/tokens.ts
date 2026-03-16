import crypto from "crypto";

/**
 * Generates a secure random token for password reset.
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hashes a token using SHA-256 for secure storage in the database.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
