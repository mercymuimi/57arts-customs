import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { affiliateAPI } from '../services/api';
import {
  hasTrackedAffiliate,
  markAffiliateTracked,
  storeAffiliateCode,
} from '../utils/affiliate';

const AffiliateTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const affiliateCode = params.get('ref')?.trim();

    if (!affiliateCode) return;

    storeAffiliateCode(affiliateCode);

    if (hasTrackedAffiliate(affiliateCode)) return;

    affiliateAPI.trackClick(affiliateCode)
      .then(() => markAffiliateTracked(affiliateCode))
      .catch(() => {});
  }, [location.search]);

  return null;
};

export default AffiliateTracker;
