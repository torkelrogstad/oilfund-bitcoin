import React from "react";
import "./App.scss";
import { useGet } from "restful-react";
import bitcoinGif from "./bitcoin.gif";

type Company = "MSTR" | "SQ" | "TSLA" | "SEETEE";
const ownership: { [key in Company]: number } = {
  MSTR: 1.09,
  SQ: 0.59,
  TSLA: 0.8,
  /**
   * https://proff.no/aksjon%C3%A6rer/bedrift/aker-capital-as/986733884
   */
  SEETEE: 4.426,
};
const bitcoinCount: { [key in Company]: number } = {
  MSTR: 91_064,
  SQ: 8_027,
  TSLA: 43_053,
  SEETEE: 1_170,
};

const companyBitcoinLinks: { [key in Company]: string } = {
  TSLA:
    "https://www.sec.gov/Archives/edgar/data/1318605/000156459021004599/tsla-10k_20201231.htm",
  MSTR:
    "https://ir.microstrategy.com/news-releases/news-release-details/microstrategy-adopts-bitcoin-primary-treasury-reserve-asset",
  SEETEE:
    "https://www.seetee.io/static/shareholder_letter-6ae7e85717c28831bf1c0eca1d632722.pdf",
  SQ:
    "https://images.ctfassets.net/2d5q1td6cyxq/5sXNrlEh2mEnTvvhgtYOm2/737bcfdc15e2a1c3cbd9b9451710ce54/Square_Inc._Bitcoin_Investment_Whitepaper.pdf",
};

const indirectBtc = (company: Company) => {
  return bitcoinCount[company] * (ownership[company] / 100);
};

const norwegianCount = 5_374_807;

interface Response {
  BtcUsd: number;
}

function App() {
  const { data, error } = useGet<Response>("https://api.rogstad.io/oilfund");
  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return null;
  }

  const { BtcUsd } = data;

  const allBitcoins =
    indirectBtc("MSTR") +
    indirectBtc("SQ") +
    indirectBtc("TSLA") +
    indirectBtc("SEETEE");
  const satoshisPerCitizen = (allBitcoins * 100_000_000) / norwegianCount;

  const usdValueOfAllCoins = allBitcoins * BtcUsd;

  return (
    <>
      <img alt="bitcoin-gif" src={bitcoinGif} />
      <p id="btc-summary">
        Through its ownership stakes in{" "}
        <a href={companyBitcoinLinks.SEETEE}>Seetee</a> (parent Aker group) (
        {ownership.SEETEE}%),{" "}
        <a href={companyBitcoinLinks.MSTR}>MicroStrategy</a> ({ownership.MSTR}%)
        and <a href={companyBitcoinLinks.SQ}>Square</a> ({ownership.SQ}%), two
        Norwegian government pension funds now indirectly hold{" "}
        <span id="amt-btc">{allBitcoins.toFixed(2)} bitcoin</span> (~
        {(usdValueOfAllCoins / 1_000_000).toFixed(1)}m USD). This is equivalent
        to{" "}
        {satoshisPerCitizen.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}{" "}
        sats per Norwegian citizen.
      </p>
      <p>
        The TSLA bitcoin count is based on an estimate, where we assume they
        bought through January 2021, with a BTCUSD volume weighted average price
        (VWAP) of $34,840. When TSLA releases more details on this, this site
        will be updated.
      </p>
      <p>
        Every once in a while the Bitcoin price changes or a new publicly listed
        company succumbs to the bitcoin black hole, so check back here for
        continuously up-to-date numbers.
      </p>
      <p>
        Made by <a href="https://rogstad.io">Torkel Rogstad</a>, originally
        reported on by{" "}
        <a href="https://research.arcane.no/news/the-norwegian-oil-fund-now-owns-almost-600-bitcoins">
          Arcane Research
        </a>
      </p>
    </>
  );
}

export default App;
