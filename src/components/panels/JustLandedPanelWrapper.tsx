import { getJustLandedProducts } from '@/lib/server-data';
import JustLandedPanel from './JustLandedPanel';

export default async function JustLandedPanelWrapper() {
  const products = await getJustLandedProducts();
  return <JustLandedPanel initialProducts={products} initialLoaded={true} />;
}
