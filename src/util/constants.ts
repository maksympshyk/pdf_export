// Directory: /src/utils/constants.ts

export const CIB_API_URL = 'https://dataplatform.synergy-impact.de';
export const AUTH_HEADERS = {
  Authorization: 'Bearer cloud-ib-pptx-8084',
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

export const COMPANY_DATA_TYPES = [
  'company_name',
  'product_summary',
  'product_summary_source_complete',
  'client_summary',
  'client_summary_source_complete',
  'firm_years_summary',
  'firm_years_summary_source_complete',
  'locations_text',
  'locations_text_source_complete',
  'hq',
  'hq_source_complete',
  'AUM',
  'aum_source_complete',
  'AUM_detail',
  'aum_detail_source_complete',
  'foundingyear_HQ_combined',
  'foundingyear_HQ_combined_source_complete'
];
