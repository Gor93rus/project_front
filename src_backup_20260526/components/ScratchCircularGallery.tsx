import { CircularGallery, type GalleryItem } from './ui/circular-gallery';
import { SCRATCH_GAMES } from '../data/lotteries';

const scratchGalleryItems: GalleryItem[] = SCRATCH_GAMES.map((game) => ({
  id: game.id,
  name: game.name,
  subtitle: `Осталось ${game.remainingTickets.toLocaleString()} из ${game.totalTickets.toLocaleString()} билетов`,
  image: {
    url: `https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&auto=format&fit=crop&q=80`,
    text: game.name,
    pos: '50% 30%',
  },
  badge: game.gameType,
  price: `${game.ticketPrice} ${game.currency}`,
  jackpot: `${game.topPrize.toLocaleString()} ${game.currency}`,
  gradient: game.gradient,
}));

export function ScratchCircularGallery() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Outer container provides scrollable height */}
      <div className="w-full" style={{ height: '400vh' }}>
        {/* Inner container sticks to the top while scrolling */}
        <div className="w-full h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden">
          <div className="text-center mb-4 absolute top-16 z-10 px-4">
            <h2 className="text-2xl font-extrabold" style={{ color: 'var(--ink-0)' }}>
              Live-игры
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-3)' }}>
              Мгновенные розыгрыши с высокими шансами
            </p>
          </div>
          <div className="w-full h-full">
            <CircularGallery
              items={scratchGalleryItems}
              radius={500}
              autoRotateSpeed={0.02}
              cardWidth={240}
              cardHeight={340}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
