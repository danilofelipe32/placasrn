export async function readPlateFromImage(imageDataUrl: string): Promise<string | null> {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageDataUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.plate;

    if (!text || text === 'NOT_FOUND' || text.length < 7) {
      return null;
    }

    // Basic validation for Brazilian plate formats
    const mercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const oldRegex = /^[A-Z]{3}[0-9]{4}$/;

    if (mercosulRegex.test(text) || oldRegex.test(text)) {
        return text;
    }

    return null;

  } catch (error) {
    console.error("Error calling Netlify function:", error);
    throw new Error("Failed to communicate with the server.");
  }
}
