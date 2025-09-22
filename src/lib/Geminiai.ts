// lib/Geminni ai.ts

const colors = [
  '6366f1', '8b5cf6', 'ec4899', 'f59e0b', '10b981', 
  '3b82f6', 'ef4444', '84cc16', 'f97316', '06b6d4'
];

const stockPhotoKeywords = [
  'notebook', 'journal', 'book', 'notes', 'writing', 'study', 
  'education', 'learning', 'paper', 'desk'
];

export async function generateImagePrompt(name: string): Promise<string> {
  // Convert name to a keyword for image search
  const keyword = name.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(' ')[0] || 'notebook';
  
  console.log('Generated keyword for image:', keyword);
  return keyword;
}

export async function generateImage(keyword: string): Promise<string> {
  try {
    // Method 1: Try Unsplash (free stock photos)
    const cleanKeyword = keyword.replace(/[^a-zA-Z0-9]/g, '');
    const stockPhotoUrl = `https://source.unsplash.com/400x300/?${cleanKeyword},notebook`;
    
    console.log('Generated stock photo URL:', stockPhotoUrl);
    return stockPhotoUrl;
    
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Fallback: Generate a colorful placeholder
    const colorIndex = keyword.length % colors.length;
    const selectedColor = colors[colorIndex];
    const placeholderUrl = `https://via.placeholder.com/400x300/${selectedColor}/ffffff?text=${encodeURIComponent(keyword)}`;
    
    console.log('Using fallback placeholder:', placeholderUrl);
    return placeholderUrl;
  }
}