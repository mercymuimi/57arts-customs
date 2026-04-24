export const AFFILIATE_STORAGE_KEY = '57arts_affiliate_code';
export const AFFILIATE_TRACKED_KEY = '57arts_affiliate_tracked';

export const getStoredAffiliateCode = () => localStorage.getItem(AFFILIATE_STORAGE_KEY) || '';

export const storeAffiliateCode = (affiliateCode) => {
  if (!affiliateCode) return;
  localStorage.setItem(AFFILIATE_STORAGE_KEY, affiliateCode);
};

export const markAffiliateTracked = (affiliateCode) => {
  if (!affiliateCode) return;
  sessionStorage.setItem(AFFILIATE_TRACKED_KEY, affiliateCode);
};

export const hasTrackedAffiliate = (affiliateCode) =>
  sessionStorage.getItem(AFFILIATE_TRACKED_KEY) === affiliateCode;
