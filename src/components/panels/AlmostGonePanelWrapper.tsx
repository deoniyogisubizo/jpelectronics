import { getAlmostGoneProducts } from '@/lib/server-data';
import AlmostGonePanel from './AlmostGonePanel';

export default async function AlmostGonePanelWrapper() {
  const products = await getAlmostGoneProducts();
  return <AlmostGonePanel initialProducts={products} initialLoaded={true} />;
}
