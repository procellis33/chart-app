import {ICandle} from '@types-interfaces/candle.ts';

const validateCandle = (candle: ICandle): boolean => {
  for (const key in candle) {
    if (typeof candle[key as keyof ICandle] !== 'number') return false;
  }
  return true;
};

type TStructureData = {
  data?: ICandle[];
  errorMessage: string;
};

export const structureData = (data: (number | null)[]): TStructureData => {
  if (!Array.isArray(data)) return {errorMessage: 'Data inconsistency'};

  const candles: ICandle[] = [];

  const firstNotNullIndex = data.findIndex(el => el !== null);

  let currentIndex = firstNotNullIndex;

  while (currentIndex < data.length) {
    if (data[currentIndex] !== null) {
      const candle: ICandle = {
        open: data[currentIndex] as number,
        high: data[currentIndex + 1] as number,
        low: data[currentIndex + 2] as number,
        close: data[currentIndex + 3] as number,
      };
      if (!validateCandle(candle)) return {errorMessage: 'Data inconsistency'};
      candles.push(candle);
      currentIndex += 5;
    } else {
      const {close} = candles[candles.length - 1];
      candles.push({
        open: close,
        high: close,
        low: close,
        close: close,
      });
      currentIndex += 1;
    }
  }

  return {
    data: candles,
    errorMessage: '',
  };
};
