import React, { FC } from 'react';
export declare type SliderMarks = {
    [key: number]: React.ReactNode;
};
declare type MarksProps = {
    marks: SliderMarks;
    max: number;
    min: number;
    upperBound: number;
    lowerBound: number;
};
declare const Marks: FC<MarksProps>;
export default Marks;
