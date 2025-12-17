// Fix: Implement the ClinicalTrialsGovService to fetch data from the real API.
import { ClinicalTrial } from '../types';

const API_BASE_URL = 'https://clinicaltrials.gov/api/v2/studies';

// Helper to safely access nested properties
const get = (obj: any, path: string, defaultValue: any = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};


class ClinicalTrialsGovService {
  async searchTrials(query: string): Promise<ClinicalTrial[]> {
    if (!query.trim()) {
      return [];
    }
    
    // API docs: https://clinicaltrials.gov/data-api/api
    const url = `${API_BASE_URL}?query.term=${encodeURIComponent(query)}&pageSize=20&format=json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`ClinicalTrials.gov API returned status ${response.status}`);
      }
      const data = await response.json();
      
      if (!data.studies || data.studies.length === 0) {
        return [];
      }

      // Map API response to our ClinicalTrial type
      const trials: ClinicalTrial[] = data.studies.map((study: any): ClinicalTrial => {
        const protocol = study.protocolSection;
        return {
          id: get(protocol, 'identificationModule.nctId', `id_${Math.random()}`),
          title: get(protocol, 'identificationModule.officialTitle', 'No title available'),
          summary: get(protocol, 'descriptionModule.briefSummary', 'No summary available.'),
          status: get(protocol, 'statusModule.overallStatus', 'Unknown'),
          location: get(protocol, 'contactsLocationsModule.locations[0].city', 'N/A'),
          eligibility: get(protocol, 'eligibilityModule.eligibilityCriteria', 'N/A'),
          contact: get(protocol, 'contactsLocationsModule.centralContacts[0].email', 'N/A'),
        };
      });

      return trials;

    } catch (error) {
      console.error("Failed to fetch clinical trials:", error);
      return [];
    }
  }
}

export const clinicalTrialsGovService = new ClinicalTrialsGovService();
