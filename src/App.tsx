import React from "react";
import "./App.scss";
import { useGet } from "restful-react";
import bitcoinGif from "./bitcoin.gif";

/** as of october 9 2020 */
const squareOwnership = 0.83;

/** as of october 9 2020 */
const squareBitcoinCount = 4_709;

/** as of october 9 2020 */
const norwegianCount = 5_374_807;

/** 8. feb 2021 */
const tslaOwnership = 0.45;
/** With a VWAP of 34_840 in January 2021 */
const tslaBitcoinCountEstimate = 43_053;

interface Response {
  NorwegianBitcoins: number;
  UsdEquivalent: number;
  SatoshisPerCitizen: number;
  UsdEquivalentPerCitizen: number;
  MstrOwnership: number;
}

function App() {
  const { data, error } = useGet<Response>("https://api.rogstad.io/oilfund");
  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return null;
  }

  const { MstrOwnership, NorwegianBitcoins, UsdEquivalent } = data;

  const squareBitcoins = (squareBitcoinCount * squareOwnership) / 100;
  const teslaBitcoins = (tslaBitcoinCountEstimate * tslaOwnership) / 100;
  const allBitcoins = NorwegianBitcoins + squareBitcoins + teslaBitcoins;
  const mstrPlusSquareSatoshisPerCitizen =
    (allBitcoins * 100_000_000) / norwegianCount;

  // lol, reverse the backend calculation
  const btcUsdPrice = UsdEquivalent / NorwegianBitcoins;

  const mstrPlusSquareUSD = allBitcoins * btcUsdPrice;

  return (
    <>
      <img alt="bitcoin-gif" src={bitcoinGif} />
      <p id="btc-summary">
        Through its ownership stakes in{" "}
        <a href="https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm">
          Tesla
        </a>{" "}
        ({tslaOwnership}%),{" "}
        <a href="https://ir.microstrategy.com/news-releases/news-release-details/microstrategy-adopts-bitcoin-primary-treasury-reserve-asset">
          MicroStrategy
        </a>{" "}
        ({MstrOwnership}%) and{" "}
        <a href="https://images.ctfassets.net/2d5q1td6cyxq/5sXNrlEh2mEnTvvhgtYOm2/737bcfdc15e2a1c3cbd9b9451710ce54/Square_Inc._Bitcoin_Investment_Whitepaper.pdf">
          Square
        </a>{" "}
        ({squareOwnership}%), the Norwegian Government Pension Fund now
        indirectly holds{" "}
        <span id="amt-btc">{allBitcoins.toFixed(2)} bitcoin</span> (~
        {(mstrPlusSquareUSD / 1_000_000).toFixed(1)}m USD). This is equivalent
        to {mstrPlusSquareSatoshisPerCitizen.toFixed(0)} sats per Norwegian
        citizen.
      </p>
      <p>
        The TSLA bitcoin count is based on an estimate, where we assume they
        bought through January 2021, with a BTCUSD volume weighted average price
        (VWAP) of $34,840. When TSLA releases more details on this, this site
        will be updated.
      </p>
      <p>
        Every once in a while the Bitcoin price changes or the Norwegian
        government buys more stocks, so check back here for continuously
        up-to-date numbers.
      </p>
      <p>
        Made by <a href="https://rogstad.io">Torkel Rogstad</a>, originally
        reported on by{" "}
        <a href="https://research.arcane.no/news/the-norwegian-oil-fund-now-owns-almost-600-bitcoins">
          Arcane Research
        </a>
      </p>
      <img alt="bitcoin-gif" src={bitcoinGif} />
    </>
  );
}

export default App;
