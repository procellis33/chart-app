import React, {useState} from 'react';
import classes from '@/App.module.scss';
import AssetSelect from '@components/AssetSelect';
import Chart from '@components/Chart';
import CandleInfo from '@components/CandleInfo';
import useCandleLoader from '@hooks/useCandleLoader.ts';
import useWindowDimensions from '@hooks/useWindowDimensions.ts';

const App: React.FC = () => {
  const url = new URL(window.location.href);
  const symbol = url.searchParams.get('symbol');

  const dimensions = useWindowDimensions();

  const candleLoader = useCandleLoader(
    symbol
      ? {
          enabled: true,
          symbol,
        }
      : {
          enabled: false,
        },
  );

  const [selectedCandleIndex, setSelectedCandleIndex] = useState<number | null>(
    null,
  );

  return (
    <div className={classes['app']}>
      <div className={classes['asset-select-wrapper']}>
        <AssetSelect />
      </div>

      {candleLoader.status === 'idle' && (
        <div className={classes['message']}>No asset selected</div>
      )}

      {candleLoader.status === 'loading' && (
        <div className={classes['message']}>Loading...</div>
      )}

      {candleLoader.status === 'error' && (
        <div className={classes['message']}>Error: {candleLoader.error}</div>
      )}

      {candleLoader.status === 'success' && (
        <>
          <Chart
            width={dimensions.width}
            height={dimensions.height}
            candles={candleLoader.data}
            setSelectedCandleIndex={setSelectedCandleIndex}
            selectedCandleIndex={selectedCandleIndex}
          />
          <div className={classes['candle-info-wrapper']}>
            <CandleInfo candle={candleLoader.data[selectedCandleIndex ?? -1]} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
