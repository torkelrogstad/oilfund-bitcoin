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
  const mstrPlusSquareBitcoins = NorwegianBitcoins + squareBitcoins;
  const mstrPlusSquareSatoshisPerCitizen =
    (mstrPlusSquareBitcoins * 100_000_000) / norwegianCount;

  // lol, reverse the backend calculation
  const btcUsdPrice = UsdEquivalent / NorwegianBitcoins;

  const mstrPlusSquareUSD = mstrPlusSquareBitcoins * btcUsdPrice;

  return (
    <>
      <img alt="bitcoin-gif" src={bitcoinGif} />
      <p id="btc-summary">
        Through its ownership stakes in{" "}
        <a href="https://ir.microstrategy.com/news-releases/news-release-details/microstrategy-adopts-bitcoin-primary-treasury-reserve-asset">
          MicroStrategy
        </a>{" "}
        ({MstrOwnership}%) and{" "}
        <a href="https://images.ctfassets.net/2d5q1td6cyxq/5sXNrlEh2mEnTvvhgtYOm2/737bcfdc15e2a1c3cbd9b9451710ce54/Square_Inc._Bitcoin_Investment_Whitepaper.pdf">
          Square
        </a>{" "}
        ({squareOwnership}%), the Norwegian Government Pension Fund now
        indirectly holds{" "}
        <span id="amt-btc">{mstrPlusSquareBitcoins.toFixed(2)} bitcoin</span> (~
        {(mstrPlusSquareUSD / 1_000_000).toFixed(1)}m USD). This is equivalent
        to {mstrPlusSquareSatoshisPerCitizen.toFixed(0)} sats per Norwegian
        citizen.
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
