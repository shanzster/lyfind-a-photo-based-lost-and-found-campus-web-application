import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

/**
 * AI-Powered Photo Matching Service using TensorFlow.js and MobileNet
 * Extracts feature embeddings from images and computes similarity scores
 */

let model: mobilenet.MobileNet | null = null;
let modelLoading: Promise<mobilenet.MobileNet> | null = null;

/**
 * Load the MobileNet model (lazy loading)
 */
async function loadModel(): Promise<mobilenet.MobileNet> {
  if (model) return model;
  if (modelLoading) return modelLoading;

  console.log('[AI Matcher] Loading MobileNet model...');
  modelLoading = mobilenet.load();
  model = await modelLoading;
  console.log('[AI Matcher] Model loaded successfully');
  
  return model;
}

/**
 * Extract feature embedding from an image
 * @param imageUrl - URL of the image to analyze
 * @returns Feature vector (embedding) as number array
 */
export async function extractFeatures(imageUrl: string): Promise<number[]> {
  try {
    console.log('[AI Matcher] Extracting features from image:', imageUrl);
    
    // Load model if not already loaded
    const net = await loadModel();
    
    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Convert image to tensor
    const tensor = tf.browser.fromPixels(img);
    
    // Get embeddings (internal activation from the model)
    const embeddings = net.infer(tensor, true) as tf.Tensor;
    
    // Convert to array
    const embeddingArray = await embeddings.data();
    const features = Array.from(embeddingArray);
    
    // Clean up tensors
    tensor.dispose();
    embeddings.dispose();
    
    console.log('[AI Matcher] Extracted', features.length, 'features');
    return features;
  } catch (error) {
    console.error('[AI Matcher] Feature extraction failed:', error);
    throw error;
  }
}

/**
 * Compute cosine similarity between two feature vectors
 * @param features1 - First feature vector
 * @param features2 - Second feature vector
 * @returns Similarity score (0-100)
 */
export function computeSimilarity(features1: number[], features2: number[]): number {
  if (features1.length !== features2.length) {
    throw new Error('Feature vectors must have the same length');
  }
  
  // Compute dot product
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < features1.length; i++) {
    dotProduct += features1[i] * features2[i];
    norm1 += features1[i] * features1[i];
    norm2 += features2[i] * features2[i];
  }
  
  // Compute cosine similarity
  const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  
  // Convert to 0-100 scale
  const score = Math.max(0, Math.min(100, (similarity + 1) * 50));
  
  return Math.round(score * 100) / 100;
}

/**
 * Find matching items by comparing feature embeddings
 * @param queryFeatures - Feature vector of the query image
 * @param candidateItems - Array of items with their feature embeddings
 * @param threshold - Minimum similarity score to consider (default: 70)
 * @returns Array of matches sorted by score (highest first)
 */
export function findMatches(
  queryFeatures: number[],
  candidateItems: Array<{ id: string; features: number[]; [key: string]: any }>,
  threshold: number = 70
): Array<{ id: string; score: number; [key: string]: any }> {
  console.log('[AI Matcher] Finding matches among', candidateItems.length, 'items');
  
  const matches = candidateItems
    .map(item => ({
      ...item,
      score: computeSimilarity(queryFeatures, item.features),
    }))
    .filter(match => match.score >= threshold)
    .sort((a, b) => b.score - a.score);
  
  console.log('[AI Matcher] Found', matches.length, 'matches above threshold', threshold);
  
  return matches;
}

/**
 * Analyze image and detect objects/features
 * @param imageUrl - URL of the image to analyze
 * @returns Analysis results with detected objects and confidence scores
 */
export async function analyzeImage(imageUrl: string): Promise<{
  objects: Array<{ className: string; probability: number }>;
  dominantColors: string[];
  imageSize: { width: number; height: number };
}> {
  try {
    console.log('[AI Matcher] Analyzing image:', imageUrl);
    
    // Load model
    const net = await loadModel();
    
    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Get image size
    const imageSize = { width: img.width, height: img.height };
    
    // Classify image
    const predictions = await net.classify(img);
    
    // Extract dominant colors (simplified - sample from image)
    const dominantColors = await extractDominantColors(img);
    
    console.log('[AI Matcher] Analysis complete:', predictions.length, 'objects detected');
    
    return {
      objects: predictions.map(p => ({
        className: p.className,
        probability: Math.round(p.probability * 100),
      })),
      dominantColors,
      imageSize,
    };
  } catch (error) {
    console.error('[AI Matcher] Image analysis failed:', error);
    throw error;
  }
}

/**
 * Extract dominant colors from an image
 */
async function extractDominantColors(img: HTMLImageElement): Promise<string[]> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  
  // Resize to small size for faster processing
  canvas.width = 50;
  canvas.height = 50;
  ctx.drawImage(img, 0, 0, 50, 50);
  
  const imageData = ctx.getImageData(0, 0, 50, 50);
  const data = imageData.data;
  
  // Sample colors
  const colorMap = new Map<string, number>();
  
  for (let i = 0; i < data.length; i += 4 * 10) { // Sample every 10th pixel
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Round to nearest 32 to group similar colors
    const rRounded = Math.round(r / 32) * 32;
    const gRounded = Math.round(g / 32) * 32;
    const bRounded = Math.round(b / 32) * 32;
    
    const color = `#${rRounded.toString(16).padStart(2, '0')}${gRounded.toString(16).padStart(2, '0')}${bRounded.toString(16).padStart(2, '0')}`;
    colorMap.set(color, (colorMap.get(color) || 0) + 1);
  }
  
  // Get top 3 colors
  const sortedColors = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([color]) => color);
  
  return sortedColors;
}

/**
 * Preload the model for faster first-time use
 */
export function preloadModel(): void {
  loadModel().catch(error => {
    console.error('[AI Matcher] Failed to preload model:', error);
  });
}
