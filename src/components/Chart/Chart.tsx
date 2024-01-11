import React, {useCallback, useEffect, useRef} from 'react';
import classes from './Chart.module.scss';
import {ICandle} from '@types-interfaces/candle.ts';

interface IChartProps {
  width: number;
  height: number;
  candles: ICandle[];
  setSelectedCandleIndex: React.Dispatch<React.SetStateAction<number | null>>;
  selectedCandleIndex: number | null;
}

const Chart: React.FC<IChartProps> = ({
  width,
  height,
  candles,
  setSelectedCandleIndex,
  selectedCandleIndex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // Find the minimum and maximum prices of all candles
      const {min, max} = candles.reduce(
        ({min, max}, {low, high}) => ({
          min: Math.min(min, low),
          max: Math.max(max, high),
        }),
        {min: Infinity, max: -Infinity},
      );
      const priceRange = max - min;

      // Calculate the width of each candle in pixels
      const candleGap = canvasWidth / candles.length;
      const candleOffset = candleGap / 2;
      const candleWidth = candleGap * 0.8;

      // Padding on the top and bottom of the chart in pixels
      const verticalPadding = 20;

      // Height minus total padding
      const availableHeight = canvasHeight - verticalPadding * 2;

      // Interpolate a price to a y coordinate on the chart
      const transformY = (value: number) =>
        availableHeight * ((max - value) / priceRange) + verticalPadding;

      for (let i = 0; i < candles.length; i++) {
        const candle = candles[i];

        // Calculate coordinates of the candle
        const x = candleGap * i + candleOffset;
        const yOpen = transformY(candle.open);
        const yHigh = transformY(candle.high);
        const yLow = transformY(candle.low);
        const yClose = transformY(candle.close);

        // If candle opens and closes at the same price, draw a horizontal line
        if (candle.low === candle.high) {
          context.strokeStyle = 'gray';

          context.beginPath();
          context.lineWidth = candleWidth;
          context.moveTo(x, yOpen);
          context.lineTo(x, yOpen + 1);
          context.stroke();

          continue;
        }

        // If candle closes below its open, it's bearish
        // Otherwise, it's bullish
        // Bullish candles are green, bearish candles are red
        const color = candle.open > candle.close ? 'red' : 'green';
        context.strokeStyle = color;

        // Draw candle wick
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(x, yHigh);
        context.lineTo(x, yLow);
        context.stroke();

        // Draw candle body
        context.beginPath();
        context.lineWidth = candleWidth;
        context.moveTo(x, yOpen);
        context.lineTo(x, yClose);
        context.stroke();

        // Draw highlight
        if (selectedCandleIndex === i) {
          context.strokeStyle = 'rgba(255,255,255,0.25)';
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, canvasHeight);
          context.stroke();
        }
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [candles, selectedCandleIndex]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const mouseX = (event.clientX - rect.left) * scaleX;
      const candleGap = canvas.width / candles.length;

      const candleIndex = Math.floor(mouseX / candleGap);

      const paddingX = mouseX / candleGap - candleIndex;
      if (paddingX <= 0.08 || paddingX >= 0.92) return;

      const candle = candles[candleIndex];
      if (candle.low === candle.high) setSelectedCandleIndex(null);
      else setSelectedCandleIndex(candleIndex);
    },
    [candles, setSelectedCandleIndex],
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (typeof requestRef.current === 'number') {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className={classes['chart']}
      width={width * window.devicePixelRatio}
      height={height * window.devicePixelRatio}
      style={{width: `${width}px`, height: `${height}px`}}
      onMouseMove={handleMouseMove}
      onMouseOut={() => setSelectedCandleIndex(null)}
    />
  );
};

export default Chart;
