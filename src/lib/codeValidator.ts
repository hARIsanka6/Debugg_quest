/**
 * Validates user code against the correct solution
 * Uses flexible comparison that ignores minor formatting differences
 */

export const validateCode = (userCode: string, correctCode: string): boolean => {
  // Normalize both codes
  const normalizeCode = (code: string): string => {
    return code
      .trim()
      // Remove all whitespace and newlines for comparison
      .replace(/\s+/g, '')
      // Normalize quotes
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .toLowerCase();
  };

  const normalizedUser = normalizeCode(userCode);
  const normalizedCorrect = normalizeCode(correctCode);

  return normalizedUser === normalizedCorrect;
};

/**
 * Checks if the code contains the key fixes required
 * More lenient than exact matching
 */
export const containsKeyFixes = (
  userCode: string,
  buggyCode: string,
  correctCode: string
): { isValid: boolean; missingFixes: string[] } => {
  const missingFixes: string[] = [];

  // Extract key differences between buggy and correct code
  const keyFixes = extractKeyFixes(buggyCode, correctCode);

  // Check if user code contains each key fix
  for (const fix of keyFixes) {
    if (!userCode.includes(fix.fixed) && !userCode.toLowerCase().includes(fix.fixed.toLowerCase())) {
      missingFixes.push(fix.description);
    }
  }

  return {
    isValid: missingFixes.length === 0,
    missingFixes
  };
};

interface KeyFix {
  fixed: string;
  description: string;
}

/**
 * Extracts key fixes between buggy and correct code
 */
const extractKeyFixes = (buggyCode: string, correctCode: string): KeyFix[] => {
  const fixes: KeyFix[] = [];

  // Python colon fix
  if (buggyCode.includes('def ') && !buggyCode.match(/def\s+\w+\([^)]*\):/)) {
    if (correctCode.match(/def\s+\w+\([^)]*\):/)) {
      fixes.push({ fixed: '):', description: 'Add colon after function definition' });
    }
  }

  // Indentation fix (Python)
  if (buggyCode.includes('if ') || buggyCode.includes('for ') || buggyCode.includes('while ')) {
    const buggyLines = buggyCode.split('\n');
    const correctLines = correctCode.split('\n');
    
    for (let i = 0; i < Math.min(buggyLines.length, correctLines.length); i++) {
      const buggyIndent = buggyLines[i].match(/^\s*/)?.[0].length || 0;
      const correctIndent = correctLines[i].match(/^\s*/)?.[0].length || 0;
      
      if (buggyIndent !== correctIndent && correctLines[i].trim()) {
        fixes.push({ 
          fixed: ' '.repeat(correctIndent) + correctLines[i].trim(), 
          description: 'Fix indentation' 
        });
        break;
      }
    }
  }

  // Semicolon fix (JS, Java, C++)
  if (!buggyCode.includes(';') && correctCode.includes(';')) {
    fixes.push({ fixed: ';', description: 'Add semicolons' });
  }

  // Variable name fix
  const buggyVars = buggyCode.match(/\b[a-zA-Z_]\w*\b/g) || [];
  const correctVars = correctCode.match(/\b[a-zA-Z_]\w*\b/g) || [];
  
  const uniqueBuggy = new Set(buggyVars);
  const uniqueCorrect = new Set(correctVars);
  
  for (const correctVar of uniqueCorrect) {
    if (!uniqueBuggy.has(correctVar) && correctVar.length > 2) {
      fixes.push({ fixed: correctVar, description: `Use correct variable name: ${correctVar}` });
    }
  }

  return fixes;
};

/**
 * Provides helpful feedback based on the user's code
 */
export const provideFeedback = (
  userCode: string,
  buggyCode: string,
  correctCode: string
): string => {
  const normalizedUser = userCode.trim().replace(/\s+/g, '');
  const normalizedBuggy = buggyCode.trim().replace(/\s+/g, '');
  const normalizedCorrect = correctCode.trim().replace(/\s+/g, '');

  // Check if user hasn't made any changes
  if (normalizedUser === normalizedBuggy) {
    return "You haven't made any changes yet. Try fixing the error!";
  }

  // Check if very close to solution
  const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);
  if (similarity > 0.9) {
    return "You're very close! Check for small syntax differences.";
  } else if (similarity > 0.7) {
    return "You're on the right track! Review the error message again.";
  }

  return "Keep trying! Use a hint if you're stuck.";
};

/**
 * Calculates similarity between two strings (0 to 1)
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Calculates Levenshtein distance between two strings
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};
