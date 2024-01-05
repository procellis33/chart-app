import classes from './AssetSelect.module.scss';
import React from 'react';

const AssetSelect: React.FC = () => {
  return (
    <div className={classes['asset-select']}>
      <a href="?symbol=BTCUSDT">BTC/USDT</a>
      <a href="?symbol=ETHUSDT">ETH/USDT</a>
      <a href="?symbol=XRPUSDT">XRP/USDT</a>
    </div>
  );
};

export default AssetSelect;
