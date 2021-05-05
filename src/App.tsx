import React from "react";
import "./App.scss";
import { useGet } from "restful-react";
import bitcoinGif from "./bitcoin.gif";

type Company =
  | "MSTR"
  | "SQ"
  | "TSLA"
  | "SEETEE"
  | "ADE.DE"
  | "MELI"
  | "TYO:3659";

const ownership: { [key in Company]: number } = {
  MSTR: 1.09,
  SQ: 0.59,
  TSLA: 0.8,
  /**
   * https://proff.no/aksjon%C3%A6rer/bedrift/aker-capital-as/986733884
   */
  SEETEE: 4.426,
  "ADE.DE": 0.53,
  "TYO:3659": 0.59,
  MELI: 1,
};

const Companies = Object.keys(ownership) as Company[];

const bitcoinCount: { [key in Company]: number } = {
  MSTR: 91_579,
  SQ: 8_027,
  TSLA: 38_202,
  SEETEE: 1_170,
  "ADE.DE": 4_000,
  "TYO:3659": 1_717,
  MELI: 7_800_000 / 58_763,
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
  "ADE.DE":
    "https://bitcoingroup.com/images//PDF/FB_2020/BitcoinGroup_HJB2020.pdf",
  "TYO:3659": "https://pdf.irpocket.com/C3659/bxTh/SDDC/wbxu.pdf",
  MELI:
    "https://www.sec.gov/Archives/edgar/data/0001099590/000156276221000190/meli-20210505xex99_1.htm",
};

const companyNames: { [key in Company]: string } = {
  MSTR: "MicroStrategy",
  SEETEE: "Seetee (parent Aker group)",
  SQ: "Square",
  TSLA: "Tesla",
  "ADE.DE": "Bitcoin Group",
  "TYO:3659": "Nexon",
  MELI: "MercadoLibre",
};

const indirectBtc = (company: Company) => {
  return bitcoinCount[company] * (ownership[company] / 100);
};

const norwegianCount = 5_374_807;

interface Response {
  BtcUsd: number;
}

const CompanyPercentage: React.FC<{ company: Company }> = ({
  company,
  children,
}) => (
  <>
    <a href={companyBitcoinLinks[company]}>{children}</a>{" "}
    <span>{ownership[company].toFixed(2)}%</span>
  </>
);

function App() {
  const { data, error } = useGet<Response>("https://api.rogstad.io/oilfund");
  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data) {
    return null;
  }

  const { BtcUsd } = data;

  const allBitcoins = Companies.map(indirectBtc).reduce(
    (sum, count) => sum + count
  );

  const satoshisPerCitizen = (
    (allBitcoins * 100_000_000) /
    norwegianCount
  ).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

  const usdValueOfAllCoins = allBitcoins * BtcUsd;

  return (
    <>
      <img alt="bitcoin-gif" src={bitcoinGif} />
      <p id="btc-summary">
        The Norwegian government indirectly owns{" "}
        <span className="amt-btc">{allBitcoins.toFixed(2)} bitcoin</span> (~USD{" "}
        {(usdValueOfAllCoins / 1_000_000).toFixed(1)}m) through their
        international and domestic pension funds. This is equivalent to{" "}
        <span className="amt-btc">{satoshisPerCitizen} sats</span> per Norwegian
        citizen.
      </p>
      <p id="company-list">
        Companies, with equity held by the Norwegian government:
        <ul>
          {Companies.map((company) => (
            <li key={company}>
              <span className="li-content">
                <CompanyPercentage company={company}>
                  {companyNames[company]}
                </CompanyPercentage>
              </span>
            </li>
          ))}
        </ul>
      </p>
      <p>
        Every once in a while a new publicly listed company succumbs to the
        bitcoin black hole. Check back here for continuously up-to-date numbers.
      </p>
      <details>
        <summary>Assumptions used to calculate BTC amounts</summary>
        <p>
          The TSLA bitcoin count is based on an estimate, where we assume they
          bought through January 2021, with a BTCUSD volume weighted average
          price (VWAP) of ${(34_840).toLocaleString()}. TSLA later sold BTC
          worth USD 272 million, and assuming their reported BTC balance sheet
          is reported at cost price, we then end up with a stack of{" "}
          {(38_202).toLocaleString()} BTC.
        </p>
        <p>
          The ADE.DE bitcoin count is not precisely known. The founder of the
          company has stated in a{" "}
          <a href="https://omr.com/de/oliver-flaskaemper-omr-podcast-bitcoin-de-adbutler/">
            podcast
          </a>{" "}
          that they own {(4000).toLocaleString()} bitcoin.
        </p>
        <p>
          MELI acquired BTC for USD 7.8 million, without providing any further
          details. Until they do so, we assume they bought at closing of Q1
          2021: ${(58763).toLocaleString()}
        </p>
      </details>
      <p id="made-by">
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
