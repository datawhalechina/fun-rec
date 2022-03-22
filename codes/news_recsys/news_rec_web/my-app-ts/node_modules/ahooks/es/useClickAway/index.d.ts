import type { BasicTarget } from '../utils/domTarget';
export default function useClickAway<T extends Event = Event>(onClickAway: (event: T) => void, target: BasicTarget | BasicTarget[], eventName?: string | string[]): void;
