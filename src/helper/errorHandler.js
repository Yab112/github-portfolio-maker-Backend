export function handleStreamError(error, res) {
    console.error('Stream Error:', error);

    // Check if headers have already been sent
    if (res.headersSent) {
        res.end();
        return;
    }

    res.status(500).json({
        error: 'Stream failed',
        message: error.message
    });
}