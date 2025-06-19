// Utility functions for formatting service content

/**
 * Format service content for better readability
 * Converts plain text to structured HTML with proper formatting
 */
export function formatServiceContent(content: string): string {
  if (!content) return '';

  // Clean up the content first
  let cleanContent = content
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\r/g, '\n')   // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .trim();

  // Split content into sentences and paragraphs
  const sentences = cleanContent.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  
  let formattedContent = '';
  let currentParagraph = '';
  let sentenceCount = 0;
  
  sentences.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) return;
    
    // Check if this sentence should start a new section (heading)
    const headingKeywords = [
      'What is', 'How does', 'Benefits of', 'Procedure', 'Treatment', 'Results', 
      'Recovery', 'Why choose', 'Who is', 'Candidates', 'Process', 'Technique', 
      'Method', 'Approach', 'During the', 'After the', 'Before the', 'The procedure',
      'This treatment', 'Our approach', 'Expected results', 'Healing process'
    ];
    
    const isHeading = headingKeywords.some(keyword => 
      trimmedSentence.toLowerCase().startsWith(keyword.toLowerCase())
    ) && trimmedSentence.length < 150;
    
    if (isHeading) {
      // Add current paragraph if exists
      if (currentParagraph.trim()) {
        formattedContent += `${currentParagraph.trim()}\n\n`;
        currentParagraph = '';
        sentenceCount = 0;
      }
      
      // Add heading
      formattedContent += `## ${trimmedSentence}\n\n`;
    } else {
      // Add to current paragraph
      currentParagraph += (currentParagraph ? ' ' : '') + trimmedSentence;
      sentenceCount++;
      
      // Break paragraph after 3-4 sentences for better readability
      if (sentenceCount >= 3 && (trimmedSentence.endsWith('.') || trimmedSentence.endsWith('!') || trimmedSentence.endsWith('?'))) {
        formattedContent += `${currentParagraph.trim()}\n\n`;
        currentParagraph = '';
        sentenceCount = 0;
      }
    }
  });
  
  // Add remaining paragraph
  if (currentParagraph.trim()) {
    formattedContent += `${currentParagraph.trim()}\n\n`;
  }
  
  // Clean up final formatting
  return formattedContent
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .trim();
}

/**
 * Extract key points from service content
 */
export function extractKeyPoints(content: string): string[] {
  if (!content) return [];
  
  const keyPoints: string[] = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    
    // Look for sentences that start with action words or contain benefit keywords
    const benefitKeywords = [
      'improve', 'enhance', 'reduce', 'eliminate', 'provide', 'offer',
      'achieve', 'restore', 'correct', 'boost', 'increase', 'decrease'
    ];
    
    const startsWithBenefit = benefitKeywords.some(keyword => 
      trimmed.toLowerCase().includes(keyword)
    );
    
    if (startsWithBenefit && trimmed.length > 30 && trimmed.length < 150) {
      keyPoints.push(trimmed);
    }
  });
  
  return keyPoints.slice(0, 5); // Return top 5 key points
}

/**
 * Create a reading time estimate
 */
export function estimateReadingTime(content: string): number {
  if (!content) return 0;
  
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Create a table of contents from content
 */
export function createTableOfContents(content: string): Array<{title: string, id: string}> {
  if (!content) return [];
  
  const toc: Array<{title: string, id: string}> = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('##')) {
      const title = trimmed.replace('##', '').trim();
      const id = title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      toc.push({ title, id });
    }
  });
  
  return toc;
}

/**
 * Split long paragraphs into smaller, more readable chunks
 */
export function optimizeParagraphStructure(content: string): string {
  if (!content) return '';
  
  const paragraphs = content.split('\n\n');
  let optimizedContent = '';
  
  paragraphs.forEach(paragraph => {
    const trimmed = paragraph.trim();
    if (!trimmed) return;
    
    // If it's a heading, keep as is
    if (trimmed.startsWith('##')) {
      optimizedContent += `${trimmed}\n\n`;
      return;
    }
    
    // If paragraph is too long, try to split it intelligently
    if (trimmed.length > 400) {
      const sentences = trimmed.split(/(?<=[.!?])\s+/);
      let currentChunk = '';
      
      sentences.forEach((sentence, index) => {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
        
        // Break after 2-3 sentences or when chunk gets long
        if ((index + 1) % 3 === 0 || currentChunk.length > 300) {
          optimizedContent += `${currentChunk.trim()}\n\n`;
          currentChunk = '';
        }
      });
      
      // Add remaining sentences
      if (currentChunk.trim()) {
        optimizedContent += `${currentChunk.trim()}\n\n`;
      }
    } else {
      // Keep shorter paragraphs as they are
      optimizedContent += `${trimmed}\n\n`;
    }
  });
  
  return optimizedContent.trim();
}

/**
 * Add bullet points for lists in content
 */
export function enhanceListFormatting(content: string): string {
  if (!content) return '';
  
  // Look for numbered lists or sequences
  const listPatterns = [
    /(\d+\.\s)/g,  // 1. 2. 3.
    /([•·]\s)/g,   // • ·
    /(-\s)/g       // -
  ];
  
  let enhanced = content;
  
  // Convert common list indicators to proper markdown
  enhanced = enhanced.replace(/(?:^|\n)(\d+)\.\s/gm, '\n- ');
  enhanced = enhanced.replace(/(?:^|\n)[•·]\s/gm, '\n- ');
  
  return enhanced;
} 