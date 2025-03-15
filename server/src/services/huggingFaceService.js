// src/services/huggingFaceService.js
const dotenv = require("dotenv");
const { HfInference } = require("@huggingface/inference");
dotenv.config();
const hf = new HfInference(process.env.HF_TOKEN);

// Retry logic
async function retry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            console.log(`Retrying... Attempt ${i + 2} of ${retries}`);
        }
    }
}

async function analyzeSentiment(text) {
    try {
        const response = await retry(() => hf.textClassification({
            model: 'distilbert-base-uncased-finetuned-sst-2-english',
            inputs: text
        }));

        return {
            label: response[0].label,
            score: response[0].score
        };
    } catch (error) {
        console.error('Error during sentiment analysis:', error);
        return { label: 'UNKNOWN', score: 0 };
    }
}

async function analyzeImage(imageUrl) {
    try {
        const response = await retry(() => hf.imageClassification({
            model: 'google/vit-base-patch16-224',
            inputs: imageUrl
        }));

        const topResult = response.reduce((prev, curr) => 
            (curr.score > prev.score ? curr : prev), response[0]);

        console.log(`Successfully analyzed image ${imageUrl}:`, topResult);
        return {
            label: topResult.label,
            score: topResult.score
        };
    } catch (error) {
        console.error(`Error during image analysis for ${imageUrl}:`, error);
        return { label: 'UNKNOWN', score: 0 };
    }
}

async function analyzePost(text, imageUrls) {
    console.log('Starting analysis...');
    
    const textAnalysis = await analyzeSentiment(text);
    console.log('Text analysis result:', textAnalysis);

    const imageAnalysisResults = await Promise.all(
        imageUrls.map(url => analyzeImage(url))
    );
    console.log('Image analysis results:', imageAnalysisResults);

    const allScores = [textAnalysis.score, ...imageAnalysisResults.map(img => img.score)];
    const validScores = allScores.filter(score => score > 0);
    const confidenceScore = validScores.length > 0 
        ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length) * 100
        : 0;

    return {
        textAnalysis,
        imageAnalysis: imageAnalysisResults,
        confidenceScore,
        flagged: confidenceScore > 80
    };
}

module.exports={ analyzePost };