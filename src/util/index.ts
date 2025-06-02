import country from '../data/country.json';
import { getCountryCode, getCountryData, TCountryCode } from 'countries-list';

export const getCountryISO3 = (country_id: number) => {
    const countryInfo = country.find(item => item.country_id === country_id) || null;

    if (countryInfo) {
        const name = countryInfo.country_name;
        const code = getCountryCode(name);
        return getCountryData(code as TCountryCode).iso3;
    }
    return "";
}

export const renderOverviewAsText = (overview: { hq_detail: any; founding_year: any; AUM_detail: any; client_detail: any; location_detail: any; }) => {
    return `${overview.AUM_detail ? `• ${overview.AUM_detail}` : ''}${overview.client_detail ? `\n• ${overview.client_detail}` : ''}${overview.founding_year ? `\n• ${overview.founding_year}` : ''}${overview.hq_detail ? `\n• ${overview.hq_detail}` : ''}${overview.location_detail ? `\n• ${overview.location_detail}` : ''}`;
};

export const formatNumber = (num: number) => {
    if (Number.isInteger(num)) {
        return num.toString();
    } else {
        const fractionalpart = num - Math.floor(num);
        if (fractionalpart === 0) {
            return Math.floor(num).toString();
        } else {
            return num.toFixed(1);
        }
    }
}