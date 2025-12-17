import { Expert } from '../types';

const EUTILS_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

interface PubMedAuthor {
  name: string;
}

interface PubMedArticle {
  uid: string;
  title: string;
  authors: PubMedAuthor[];
  source: string; // Journal
}

class ExpertService {
  /**
   * Searches for experts by finding authors of publications on a given topic.
   * @param query The search term (e.g., a specialty, condition, or author name).
   * @returns A promise that resolves to an array of Expert objects.
   */
  async searchExperts(query: string): Promise<Expert[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      // Step 1: Search for publications related to the query. Limit to 50 for performance.
      const searchResponse = await fetch(`${EUTILS_BASE_URL}esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=50`);
      if (!searchResponse.ok) throw new Error(`PubMed esearch failed with status ${searchResponse.status}`);
      const searchData = await searchResponse.json();
      const ids: string[] = searchData.esearchresult?.idlist;
      if (!ids || ids.length === 0) return [];

      // Step 2: Get summaries for these publications.
      const summaryResponse = await fetch(`${EUTILS_BASE_URL}esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`);
      if (!summaryResponse.ok) throw new Error(`PubMed esummary failed with status ${summaryResponse.status}`);
      const summaryData = await summaryResponse.json();
      const results = summaryData.result;

      // Step 3: Aggregate author data from the results.
      const authorMap = new Map<string, { count: number; journals: Set<string> }>();

      ids.forEach(id => {
        const article: PubMedArticle = results[id];
        if (article && article.authors) {
          article.authors.forEach(author => {
            const existing = authorMap.get(author.name) || { count: 0, journals: new Set() };
            existing.count++;
            if (article.source) {
              existing.journals.add(article.source);
            }
            authorMap.set(author.name, existing);
          });
        }
      });
      
      // Step 4: Convert the aggregated author data into Expert objects.
      const experts: Expert[] = Array.from(authorMap.entries())
        .map(([name, data]) => ({
          id: `expert_${name.replace(/\s/g, '_')}`,
          name: name,
          title: 'Researcher', // Default title
          specialties: Array.from(data.journals).slice(0, 2), // Use journals as proxy for specialties
          location: 'N/A', // Location is not available from this API call.
          publications: data.count,
          // Using a deterministic avatar service
          avatarUrl: `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(name)}`, 
        }))
        .sort((a, b) => b.publications - a.publications) // Sort by most publications
        .slice(0, 21); // Limit to top 21 experts

      return experts;
    } catch (error) {
      console.error("Failed to search for experts via PubMed:", error);
      return [];
    }
  }
}

export const expertService = new ExpertService();