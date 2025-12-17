
import { Publication } from '../types';

const EUTILS_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

// Helper to parse author list from PubMed API response
const parseAuthors = (authors: { name: string }[]): string[] => {
  if (!authors || authors.length === 0) return ['Unknown Author'];
  return authors.map(author => author.name);
};

// A new service for interacting with the PubMed API
class PubMedService {
  /**
   * Searches PubMed for articles matching the query.
   * @param query The search term.
   * @returns A promise that resolves to an array of Publication objects.
   */
  async searchPublications(query: string): Promise<Publication[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      // Step 1: Use esearch to find publication IDs for the query.
      // We limit to 20 results for performance.
      const searchResponse = await fetch(`${EUTILS_BASE_URL}esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=20`);
      if (!searchResponse.ok) {
        throw new Error(`PubMed esearch API returned status ${searchResponse.status}`);
      }
      const searchData = await searchResponse.json();
      const ids: string[] = searchData.esearchresult?.idlist;

      if (!ids || ids.length === 0) {
        return []; // No results found
      }

      // Step 2: Use esummary to get details for the found IDs.
      const summaryResponse = await fetch(`${EUTILS_BASE_URL}esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`);
      if (!summaryResponse.ok) {
        throw new Error(`PubMed esummary API returned status ${summaryResponse.status}`);
      }
      const summaryData = await summaryResponse.json();
      const results = summaryData.result;

      // Step 3: Map the PubMed API response to our internal Publication type.
      const publications: Publication[] = ids.map(id => {
        const article = results[id];
        if (!article) return null;
        
        return {
          id: article.uid,
          title: article.title || 'No title found',
          authors: parseAuthors(article.authors),
          journal: article.source || 'Unknown Journal',
          year: parseInt(article.pubdate?.substring(0, 4) || new Date().getFullYear().toString(), 10),
          url: `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`,
        };
      }).filter((p): p is Publication => p !== null); // Filter out any nulls if an ID had no result

      return publications;
    } catch (error) {
      console.error("Failed to fetch publications from PubMed:", error);
      // In a real app, you might want to show an error to the user.
      return []; // Return empty array on error to prevent app crash.
    }
  }
}

export const pubmedService = new PubMedService();
