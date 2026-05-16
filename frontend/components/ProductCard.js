import Link from 'next/link';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { getImageUrl } from '../lib/images';

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }) {
  return (
    <article className="card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-square bg-slate-50 p-4">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          className="absolute start-3 top-3 rounded-full bg-white/90 p-2.5 text-rose-500 shadow-sm backdrop-blur transition hover:bg-white"
          onClick={() => onToggleWishlist?.(product)}
          aria-label="المفضلة"
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart className="text-slate-400" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand?.name && (
          <span className="text-xs font-medium text-brand-600">{product.brand.name}</span>
        )}
        <h2 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold text-slate-900">{product.name}</h2>
        <div className="flex items-center gap-1 text-xs text-amber-500">
          <FaStar />
          <span>{product.ratingsAverage?.toFixed(1) || '4.5'}</span>
          <span className="text-slate-400">({product.ratingsQuantity || 0})</span>
        </div>
        <p className="text-lg font-bold text-brand-700">${product.price}</p>
        <div className="mt-auto flex gap-2 pt-2">
          <Link href={`/products/${product._id}`} className="btn-secondary flex-1 text-center text-xs">
            التفاصيل
          </Link>
          <button type="button" onClick={() => onAddToCart?.(product)} className="btn-primary flex-1 text-xs">
            أضف للسلة
          </button>
        </div>
      </div>
    </article>
  );
}
