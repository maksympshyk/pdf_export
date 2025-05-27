import country from '../data/country.json';
import { getCountryCode, getCountryData } from 'countries-list';

export const getCountryISO3 = (country_id) => {
    const countryInfo = country.find(item => item.country_id === country_id) || null;

    if (countryInfo) {
        const name = countryInfo.country_name;
        const code = getCountryCode(name);
        return getCountryData(code).iso3;
    }
    return "";
}

export const renderOverviewAsText = (overview) => {
    return `${overview.AUM_detail ? `• ${overview.AUM_detail}` : ''}${overview.client_detail ? `\n• ${overview.client_detail}` : ''}${overview.founding_year ? `\n• ${overview.founding_year}` : ''}${overview.hq_detail ? `\n• ${overview.hq_detail}` : ''}${overview.location_detail ? `\n• ${overview.location_detail}` : ''}`;
};