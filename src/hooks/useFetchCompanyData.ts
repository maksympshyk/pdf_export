// Directory: /src/hooks/useFetchCompanyData.ts

import axios from 'axios';
import { useCallback } from 'react';
import { getCountryISO3, renderOverviewAsText } from '../util';
import { CompanyRow } from '../types';

export const useFetchCompanyData = () => {
  const fetchData = useCallback(async (): Promise<CompanyRow[]> => {
    const url = 'https://dataplatform.synergy-impact.de/company_specific_info/get_strip_profile_data';
    const headers = {
      'Authorization': 'Bearer cloud-ib-pptx-8084',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const body = {
      data_type: [
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
      ],
      cib_ids: ['25financial.com', 'acadviser.com', 'almanackip.com'],
      orient: 'records'
    };

    const response = await axios.post(url, body, { headers });

    return await Promise.all(
      response.data.map(async (row: any) => {
        console.log(row);
        const locationResponse = await axios.get(
          `https://dataplatform.synergy-impact.de/companies/get_company_locations?cib_id=${row.cib_id}&orient=records`,
          { headers }
        );

        const mapDataResponse = await axios.post(
          'https://dataplatform.synergy-impact.de/company_specific_info/get_map_for_cib_ids',
          {
            cib_ids: [row.cib_id],
            orient: "records"
          },
          {headers}
        )

        return {
          company: row.company_name,
          headquarter: row.hq,
          headquarter_detail: row.hq,
          year_founded: 'Founded in 1997', // You can replace with actual data
          aum: `${row.AUM}bn`,
          customOverview: renderOverviewAsText({
            // hq_detail: row.hq_source_complete || null,
            // founding_year: row.foundingyear_HQ_combined_source_complete || null,
            AUM_detail: row.AUM_detail || null,
            // client_detail: row.client_summary_source_complete || null,
            location_detail: row.locations_text || null,
          }),
          locations: locationResponse.data.map((loc: any) => ({
            lat: loc.lat,
            long: loc.long,
            country: getCountryISO3(loc.country_id)
          })),
          midLat: mapDataResponse.data[0].mid_lat,
          midLng: mapDataResponse.data[0].mid_lng,
          zoom: mapDataResponse.data[0].zoom,
        };
      })
    );
  }, []);

  return { fetchData };
};
