import { Icon } from './Icons';

export function DiamondCanvas({ size = 40 }: { size?: number }) {
  return <Icon.Diamond size={size} strokeWidth={2} />;
}
