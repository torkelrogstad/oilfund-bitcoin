import React from "react";
import "./App.scss";
import { useGet } from "restful-react";
import bitcoinGif from "./bitcoin.gif";

interface Response {
  NorwegianBitcoins: number;
  UsdEquivalent: number;
  SatoshisPerCitizen: number;
  UsdEquivalentPerCitizen: number;
  MstrOwnership: number;
}

function App() {
  const { data, error } = useGet<Response>("https://api.rogstad.io/oilfund");
  console.log(data, typeof data);
  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return null;
  }

  const {
    MstrOwnership,
    NorwegianBitcoins,
    UsdEquivalent,
    SatoshisPerCitizen,
  } = data;
  console.log(data.MstrOwnership);
  return (
    <>
      <img alt="bitcoin-gif" src={bitcoinGif} />
      <p id="btc-summary">
        Through its ownership stakes in MicroStrategy ({MstrOwnership}%), the
        Norwegian Government Pension Fund now indirectly holds{" "}
        <span id="amt-btc">{NorwegianBitcoins.toFixed(2)} bitcoin</span> (~
        {(UsdEquivalent / 1_000_000).toFixed(1)}m USD). This is equivalent to{" "}
        {SatoshisPerCitizen.toFixed(0)} sats per Norwegian citizen.
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
