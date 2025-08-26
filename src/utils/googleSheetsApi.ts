// Google Sheets API utilities for accessing public spreadsheet data

const SHEET_ID = '1mKctTHsgwo1vFaFyggqnkij89q3P1_QUUtZRv2PEks8';
// Try multiple URL formats for better compatibility
const CSV_URLS = [
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv&gid=0`,
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?exportFormat=csv&gid=0`
];

export interface GoogleSheetsAssessmentData {
  email: string;
  timestamp: string;
  osrlLevel: number;
  overallScore: number;
  pillarScores: Record<string, number>;
  responses: Record<string, number>;
  reportHtml: string;
  personalizedAnalysis: {
    description?: string;
    strengths?: string;
    improvements?: string;
    recommendations?: string;
  };
}

// Parse CSV text to array of objects
const parseCSV = (csvText: string): string[][] => {
  const lines = csvText.split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }).filter(row => row.some(cell => cell.length > 0));
};

// Convert CSV data to assessment format
const convertToAssessmentData = (rows: string[][]): GoogleSheetsAssessmentData[] => {
  if (rows.length === 0) return [];
  
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    const data: any = {};
    
    // Map basic fields
    headers.forEach((header, index) => {
      const value = row[index] || '';
      
      if (header === 'email') {
        data.email = value;
      } else if (header === 'timestamp') {
        data.timestamp = value;
      } else if (header === 'osrllevel') {
        data.osrlLevel = parseInt(value) || 1;
      } else if (header === 'overallscore') {
        data.overallScore = parseInt(value) || 0;
      } else if (header.startsWith('score_')) {
        if (!data.pillarScores) data.pillarScores = {};
        const pillarId = header.replace('score_', '');
        data.pillarScores[pillarId] = parseInt(value) || 0;
      } else if (header.startsWith('resposta_')) {
        if (!data.responses) data.responses = {};
        const questionId = header.replace('resposta_', '');
        data.responses[questionId] = parseInt(value) || 0;
      } else if (header === 'personalizedanalysis') {
        if (!data.personalizedAnalysis) data.personalizedAnalysis = {};
        try {
          const analysisData = JSON.parse(value);
          data.personalizedAnalysis = analysisData;
        } catch {
          // If not JSON, treat as description
          data.personalizedAnalysis.description = value;
        }
      } else if (header === 'analysis_description') {
        if (!data.personalizedAnalysis) data.personalizedAnalysis = {};
        data.personalizedAnalysis.description = value;
      } else if (header === 'strengths') {
        if (!data.personalizedAnalysis) data.personalizedAnalysis = {};
        data.personalizedAnalysis.strengths = value;
      } else if (header === 'improvements') {
        if (!data.personalizedAnalysis) data.personalizedAnalysis = {};
        data.personalizedAnalysis.improvements = value;
      } else if (header === 'recommendations') {
        if (!data.personalizedAnalysis) data.personalizedAnalysis = {};
        data.personalizedAnalysis.recommendations = value;
      } else if (header === 'reporthtml') {
        data.reportHtml = value;
      }
    });
    
    // Ensure required fields have defaults
    if (!data.pillarScores) data.pillarScores = {};
    if (!data.responses) data.responses = {};
    if (!data.personalizedAnalysis) data.personalizedAnalysis = {};
    if (!data.reportHtml) data.reportHtml = '';
    
    return data;
  }).filter(item => item.email && item.timestamp);
};

// Alternative approach using JSONP as fallback
const tryFetchWithJSONP = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const script = document.createElement('script');
    const cleanup = () => {
      document.head.removeChild(script);
      delete (window as any)[callbackName];
    };
    
    (window as any)[callbackName] = (data: any) => {
      cleanup();
      resolve(data);
    };
    
    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP request failed'));
    };
    
    script.src = `${url}&callback=${callbackName}`;
    document.head.appendChild(script);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out'));
    }, 10000);
  });
};

// Try to fetch from multiple URL formats
const tryFetchCSV = async (): Promise<string> => {
  const errors: string[] = [];
  
  for (let i = 0; i < CSV_URLS.length; i++) {
    const url = CSV_URLS[i];
    try {
      console.log(`📡 Tentativa ${i + 1}/${CSV_URLS.length} - URL:`, url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv,text/plain,*/*'
        },
        mode: 'cors' // Explicitly request CORS
      });
      
      console.log(`📊 Status da resposta (tentativa ${i + 1}):`, response.status, response.statusText);
      
      if (response.ok) {
        const csvText = await response.text();
        if (csvText && csvText.trim().length > 0) {
          console.log(`✅ Sucesso na tentativa ${i + 1}!`);
          return csvText;
        }
      }
      
      errors.push(`Tentativa ${i + 1}: HTTP ${response.status}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      console.warn(`⚠️ Falha na tentativa ${i + 1}:`, errorMsg);
      errors.push(`Tentativa ${i + 1}: ${errorMsg}`);
    }
  }
  
  // Throw error with all attempts details
  throw new Error(`Todas as tentativas falharam:\n${errors.join('\n')}\n\nVerifique se a planilha está publicada na web e acessível publicamente.`);
};

// Fetch assessment data from Google Sheets
export const fetchGoogleSheetsData = async (): Promise<GoogleSheetsAssessmentData[]> => {
  try {
    const csvText = await tryFetchCSV();
    console.log('📄 Tamanho do CSV recebido:', csvText.length, 'caracteres');
    console.log('📄 Primeiras linhas do CSV:', csvText.substring(0, 200));
    
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('A planilha está vazia ou não retornou dados válidos.');
    }
    
    const rows = parseCSV(csvText);
    console.log('📋 Linhas parseadas:', rows.length);
    
    if (rows.length === 0) {
      throw new Error('Não foi possível parsear o CSV ou a planilha não contém dados.');
    }
    
    if (rows.length === 1) {
      throw new Error('A planilha contém apenas cabeçalhos, sem dados de avaliações.');
    }
    
    console.log('🏷️ Cabeçalhos encontrados:', rows[0]);
    
    const assessments = convertToAssessmentData(rows);
    console.log('✅ Avaliações convertidas:', assessments.length);
    
    if (assessments.length === 0) {
      throw new Error('Nenhuma avaliação válida foi encontrada nos dados da planilha.');
    }
    
    // Sort by timestamp descending
    const sortedAssessments = assessments.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    console.log('🎯 Dados processados com sucesso:', {
      totalRecords: sortedAssessments.length,
      firstRecord: {
        email: sortedAssessments[0]?.email,
        timestamp: sortedAssessments[0]?.timestamp,
        osrlLevel: sortedAssessments[0]?.osrlLevel,
        pillarCount: Object.keys(sortedAssessments[0]?.pillarScores || {}).length
      }
    });
    
    return sortedAssessments;
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados da Google Sheets:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Erro de conectividade. Verifique sua conexão com a internet e se a planilha está acessível.');
    }
    
    if (error instanceof Error) {
      throw error; // Re-throw with original message
    }
    
    throw new Error('Erro desconhecido ao acessar a planilha Google Sheets.');
  }
};

// Get statistics from the data
export const getDataStatistics = (data: GoogleSheetsAssessmentData[]) => {
  if (data.length === 0) {
    return {
      totalAssessments: 0,
      averageLevel: 0,
      levelDistribution: {},
      mostCommonPillarScores: {}
    };
  }
  
  const totalAssessments = data.length;
  const averageLevel = data.reduce((sum, item) => sum + item.osrlLevel, 0) / totalAssessments;
  
  // Level distribution
  const levelDistribution: Record<number, number> = {};
  data.forEach(item => {
    levelDistribution[item.osrlLevel] = (levelDistribution[item.osrlLevel] || 0) + 1;
  });
  
  // Average pillar scores
  const pillarTotals: Record<string, number[]> = {};
  data.forEach(item => {
    Object.entries(item.pillarScores).forEach(([pillarId, score]) => {
      if (!pillarTotals[pillarId]) pillarTotals[pillarId] = [];
      pillarTotals[pillarId].push(score);
    });
  });
  
  const mostCommonPillarScores: Record<string, number> = {};
  Object.entries(pillarTotals).forEach(([pillarId, scores]) => {
    mostCommonPillarScores[pillarId] = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
  });
  
  return {
    totalAssessments,
    averageLevel: Math.round(averageLevel * 10) / 10,
    levelDistribution,
    mostCommonPillarScores
  };
};