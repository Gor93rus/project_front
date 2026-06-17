import { CircularGallery, type GalleryItem } from './ui/circular-gallery';
import { LOTTERIES } from '../data/lotteries';

function formatJackpot(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

const lotteryGalleryItems: GalleryItem[] = LOTTERIES.map((lottery) => ({
  id: lottery.id,
  name: lottery.name,
  subtitle: lottery.description,
  image: {
    url: `https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&auto=format&fit=crop&q=80`,
    text: lottery.description,
    pos: '50% 30%',
  },
  badge: lottery.drawLabel,
  price: `${lottery.ticketPrice} ${lottery.currency}`,
  jackpot: `${formatJackpot(lottery.jackpot)} ${lottery.currency}`,
  gradient: lottery.gradient,
}));

export function LotteryCircularGallery() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Outer container provides scrollable height */}
      <div className="w-full" style={{ height: '400vh' }}>
        {/* Inner container sticks to the top while scrolling */}
        <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden">
          <div className="text-center mb-4 absolute top-16 z-10 px-4">
            <h2 className="text-2xl font-extrabold" style={{ color: 'var(--ink-0)' }}>
              Все лотереи
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-3)' }}>
              Скролль чтобы вращать галерею
            </p>
          </div>
          <div className="w-full h-full">
            <CircularGallery
              items={lotteryGalleryItems}
              radius={550}
              autoRotateSpeed={0.015}
              cardWidth={260}
              cardHeight={360}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
