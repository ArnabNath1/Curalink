
import { ClinicalTrial, Publication, Expert, ForumPost, UserType } from '../types';

export const MOCK_TRIALS: ClinicalTrial[] = [
  { id: 'trial1', title: 'A Study of Immunotherapy in Advanced Lung Cancer', summary: 'This trial investigates the efficacy of a new immunotherapy drug for patients with non-small cell lung cancer.', status: 'Recruiting', location: 'Global', eligibility: 'Ages 18+, Stage IV NSCLC', contact: 'contact-trial1@example.com' },
  { id: 'trial2', title: 'Targeted Therapy for BRAF V600E Mutant Glioma', summary: 'Phase II study of a targeted inhibitor for patients with recurrent high-grade gliomas.', status: 'Recruiting', location: 'New York, NY', eligibility: 'Ages 18+, confirmed BRAF V600E mutation', contact: 'contact-trial2@example.com' },
  { id: 'trial3', title: 'Lifestyle Intervention for Cardiovascular Disease Prevention', summary: 'A long-term study on the effects of diet and exercise on heart health.', status: 'Completed', location: 'Boston, MA', eligibility: 'Ages 45-75, at risk for CVD', contact: 'contact-trial3@example.com' },
];

export const MOCK_PUBLICATIONS: Publication[] = [
  { id: 'pub1', title: 'Genomic Landscape of Glioma', authors: ['Dr. A. Smith', 'Dr. B. Jones'], journal: 'Nature Medicine', year: 2023, url: '#' },
  { id: 'pub2', title: 'Advances in CAR-T Cell Therapy for Lung Cancer', authors: ['Dr. C. Lee', 'Dr. D. Wang'], journal: 'The Lancet Oncology', year: 2022, url: '#' },
  { id: 'pub3', title: 'The Role of AI in Medical Diagnostics', authors: ['Dr. E. Patel'], journal: 'JAMA', year: 2023, url: '#' },
];

export const MOCK_EXPERTS: Expert[] = [
  { id: 'exp1', name: 'Dr. Evelyn Reed', title: 'Neuro-Oncologist', specialties: ['Glioma', 'Brain Tumors'], location: 'New York, NY', publications: 25, avatarUrl: 'https://picsum.photos/seed/exp1/200' },
  { id: 'exp2', name: 'Dr. Samuel Chen', title: 'Thoracic Oncologist', specialties: ['Lung Cancer', 'Immunotherapy'], location: 'Houston, TX', publications: 42, avatarUrl: 'https://picsum.photos/seed/exp2/200' },
  { id: 'exp3', name: 'Dr. Maria Garcia', title: 'Cardiologist', specialties: ['Preventive Cardiology', 'AI in Medicine'], location: 'Stanford, CA', publications: 31, avatarUrl: 'https://picsum.photos/seed/exp3/200' },
];

export const MOCK_FORUMS: ForumPost[] = [
    { 
        id: 'forum1', 
        author: 'John D. (Patient)', 
        userType: UserType.PATIENT,
        title: 'Question about side effects of Immunotherapy', 
        content: 'I\'m about to start an immunotherapy trial for lung cancer and was wondering what the common side effects are and how they are managed.',
        category: 'Clinical Trials Insights',
        replies: [
            { id: 'reply1', author: 'Dr. Samuel Chen', content: 'Common side effects include fatigue, skin rashes, and flu-like symptoms. We manage these closely with supportive care. It\'s important to report any new symptoms to your study team immediately. Best of luck with your treatment.' }
        ]
    },
    { 
        id: 'forum2', 
        author: 'Jane S. (Caregiver)', 
        userType: UserType.PATIENT,
        title: 'How to find support groups for Glioma patients?', 
        content: 'My husband was recently diagnosed with Glioma. Are there any recommended national or online support groups we can join?',
        category: 'Cancer Research',
        replies: []
    }
];

const search = <T extends { title: string }>(query: string, data: T[]): Promise<T[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!query) {
                resolve(data);
                return;
            }
            const lowerCaseQuery = query.toLowerCase();
            const results = data.filter(item => item.title.toLowerCase().includes(lowerCaseQuery));
            resolve(results);
        }, 500);
    });
};

export const searchClinicalTrials = (query: string) => search(query, MOCK_TRIALS);
export const searchPublications = (query: string) => search(query, MOCK_PUBLICATIONS);
export const searchExperts = (query: string) => {
     return new Promise<Expert[]>(resolve => {
        setTimeout(() => {
            if (!query) {
                resolve(MOCK_EXPERTS);
                return;
            }
            const lowerCaseQuery = query.toLowerCase();
            const results = MOCK_EXPERTS.filter(item => 
                item.name.toLowerCase().includes(lowerCaseQuery) ||
                item.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery))
            );
            resolve(results);
        }, 500);
    });
}
export const getForumPosts = () => new Promise<ForumPost[]>(res => setTimeout(() => res(MOCK_FORUMS), 300));
