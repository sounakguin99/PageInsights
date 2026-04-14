import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
    const modelsToTest = [
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-live-preview",
        "gemini-3-flash-preview",
        "gemini-2.5-flash-lite",
        "gemini-3.1-pro-preview"
    ];

    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("hello");
            console.log(`Success ${modelName}:`, result.response.text());
            break; // Stop on first success!
        } catch (e) {
            console.error(`Error ${modelName}:`, e.status, e.message);
        }
    }
}
testModels();
