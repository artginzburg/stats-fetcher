import { DynamicHomePage } from '~/components/HomePage/DynamicHomePage';

import dataHistory from '../../../../dataHistory.json';

export default function Page() {
  return <DynamicHomePage history={dataHistory} />;
}
