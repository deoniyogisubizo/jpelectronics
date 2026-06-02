import { getFeaturedProducts } from '@/lib/server-data';
import ProductGridPanel from './ProductGridPanel';

export default async function ProductGridPanelWrapper() {
  const products = await getFeaturedProducts();
  return <ProductGridPanel initialProducts={products} initialLoaded={true} />;
}
