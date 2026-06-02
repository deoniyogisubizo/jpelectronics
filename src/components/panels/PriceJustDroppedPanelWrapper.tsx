import { getPriceDroppedProducts } from '@/lib/server-data';
import PriceJustDroppedPanel from './PriceJustDroppedPanel';

export default async function PriceJustDroppedPanelWrapper() {
  const products = await getPriceDroppedProducts();
  return <PriceJustDroppedPanel initialProducts={products} initialLoaded={true} />;
}
