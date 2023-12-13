import { تسلسلات_تاريخية } from "./أنواع.ts";

export default (تسلسلات_تاريخية: تسلسلات_تاريخية): تسلسلات_تاريخية => {
  const نسخة_تسلسلات_تاريخية = تسلسلات_تاريخية.slice();
  نسخة_تسلسلات_تاريخية[نسخة_تسلسلات_تاريخية.length - 1].unshift(0);
  for (let فِهرِس = نسخة_تسلسلات_تاريخية.length - 2; فِهرِس >= 0; فِهرِس--) {
    const تسلسل_الحالي = نسخة_تسلسلات_تاريخية[فِهرِس];
    const التسلسل_التالي = نسخة_تسلسلات_تاريخية[فِهرِس + 1];
    تسلسل_الحالي.unshift(
      تسلسل_الحالي[0] -
        التسلسل_التالي[0],
    );
  }

  return نسخة_تسلسلات_تاريخية;
};
