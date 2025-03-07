export function validateInput(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        return { error: 'Prompt must be a valid string' };
    }
    if (prompt.length > 4096) {
        return { error: 'Prompt exceeds maximum length of 4096 characters' };
    }
    return null;
}