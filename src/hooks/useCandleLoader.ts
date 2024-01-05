import {useEffect, useState} from 'react';
import {ICandle} from '@types-interfaces/candle.ts';
import {structureData} from '@helpers/dataManipulation.ts';

type TCandleLoaderParams =
  | {
      enabled: false;
      symbol?: string | null;
    }
  | {
      enabled: true;
      symbol: string;
    };

type TCandleLoaderHook =
  | {
      status: 'loading' | 'idle';
      data: null;
      error: null;
    }
  | {
      status: 'error';
      data: null;
      error: string;
    }
  | {
      status: 'success';
      data: ICandle[];
      error: null;
    };

type TUseCandleLoader = ({
  enabled,
  symbol,
}: TCandleLoaderParams) => TCandleLoaderHook;
const useCandleLoader: TUseCandleLoader = ({enabled, symbol}) => {
  const [candles, setCandles] = useState<ICandle[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const validSymbols = ['ETHUSDT', 'BTCUSDT', 'XRPUSDT'];

    if (symbol && validSymbols.includes(symbol)) {
      setIsLoading(true);
      setError('');

      // Imitating loading
      setTimeout(() => {
        fetch(`/candles/${symbol}.json`)
          .then(response => {
            const contentType = response.headers.get('content-type');

            if (
              response.ok &&
              contentType !== null &&
              contentType.includes('application/json')
            )
              return response.json();
            else throw new Error();
          })
          .then((data: (number | null)[]) => {
            const structuredData = structureData(data);
            if (structuredData.data !== undefined)
              setCandles(structuredData.data);
            else setError(structuredData.errorMessage);
          })
          .catch((e: unknown) => {
            if (e instanceof Error) setError('Error fetching data');
            else setError('Unknown error occurred');
          })
          .finally(() => setIsLoading(false));
      }, 300);
    }
  }, [symbol]);

  if (!enabled) {
    return {
      status: 'idle',
      data: null,
      error: null,
    };
  }

  if (isLoading)
    return {
      status: 'loading',
      data: null,
      error: null,
    };

  if (error !== '')
    return {
      status: 'error',
      data: null,
      error,
    };

  return {
    status: 'success',
    data: candles || [],
    error: null,
  };
};

export default useCandleLoader;
