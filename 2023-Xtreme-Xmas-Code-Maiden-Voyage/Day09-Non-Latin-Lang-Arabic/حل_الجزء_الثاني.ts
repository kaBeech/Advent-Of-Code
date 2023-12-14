import تحليل_المدخلات from "./تحليل_المدخلات.ts";
import { تسلسلات_تاريخية, تقرير } from "./أنواع.ts";
import بناء_تسلسلات from "./بناء_تسلسلات.ts";
import استقراء_التسلسل_إلى_الوراء from "./استقراء_التسلسل_إلى_الوراء.ts";
import مجموع_الاستقراءات_إلى_الوراء from "./مجموع_الاستقراءات_إلى_الوراء.ts";

export default (async function (): Promise<تقرير> {
  const تقرير: تقرير = await تحليل_المدخلات();

  const تقرير_التسلسلات_التاريخية: تسلسلات_تاريخية[] = [];

  for (const تاريخ of تقرير) {
    تقرير_التسلسلات_التاريخية.push(بناء_تسلسلات(تاريخ));
  }

  for (let تسلسلات_تاريخية of تقرير_التسلسلات_التاريخية) {
    تسلسلات_تاريخية = استقراء_التسلسل_إلى_الوراء(تسلسلات_تاريخية);
  }

  const مجموع = مجموع_الاستقراءات_إلى_الوراء(تقرير_التسلسلات_التاريخية);

  console.log(
    `${مجموع.toString()} الوراء إلى المستقرة البيانات مجموع :٢ الجزء`,
  );

  console.log(
    `Part 2: The sum of the backwards-extrapolated data is ${مجموع}`,
  );

  return تقرير;
})();
