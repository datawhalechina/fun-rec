import { FC } from 'react';
declare type TicksProps = {
    points: number[];
    max: number;
    min: number;
    upperBound: number;
    lowerBound: number;
};
declare const Ticks: FC<TicksProps>;
export default Ticks;
