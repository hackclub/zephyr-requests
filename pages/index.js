import { useState, useRef } from "react";
import Head from "next/head";
import clsx from "clsx";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import redis from "../lib/redis";

const fetcher = (url) => fetch(url).then((res) => res.json());

function LoadingSpinner({ invert }) {
  return (
    <svg
      className={clsx(
        "animate-spin h-5 w-5 text-gray-900 dark:text-gray-100",
        invert && "text-gray-100 dark:text-gray-900"
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function Item({ isFirst, isLast, isReleased, hasVoted, feature }) {
  const upvote = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/vote", {
      body: JSON.stringify({
        id: feature.id,
        title: feature.title,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    if (error) {
      return toast.error(error);
    }

    mutate("/api/features");
  };

  return (
    <div
      className={clsx(
        "p-6 mx-8 flex items-center border-t border-l border-r",
        isFirst && "rounded-t-md",
        isLast && "border-b rounded-b-md"
      )}
    >
      <button
        className={clsx(
          "ring-1 ring-gray-200 rounded-full w-8 min-w-[2rem] h-8 mr-4 focus:outline-none focus:ring focus:ring-blue-300",
          (isReleased || hasVoted) &&
            "bg-green-100 cursor-not-allowed ring-green-300"
        )}
        disabled={isReleased || hasVoted}
        onClick={upvote}
      >
        {isReleased ? "✅" : "👍"}
      </button>
      <h3 className="text font-semibold w-full text-left">{feature.title}</h3>
      <div className="bg-gray-200 text-gray-700 text-sm rounded-xl px-2 ml-2">
        {feature.score}
      </div>
    </div>
  );
}

export default function Roadmap({ features, ip }) {
  const [isCreateLoading, setCreateLoading] = useState(false);
  const [isEmailLoading, setEmailLoading] = useState(false);
  const featureInputRef = useRef(null);
  const subscribeInputRef = useRef(null);

  const { data, error } = useSWR("/api/features", fetcher, {
    initialData: { features },
  });

  if (error) {
    toast.error(error);
  }

  const addFeature = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    const res = await fetch("/api/create", {
      body: JSON.stringify({
        title: featureInputRef.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    setCreateLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    mutate("/api/features");
    featureInputRef.current.value = "";
  };

  const subscribe = async (e) => {
    e.preventDefault();
    setEmailLoading(true);

    const res = await fetch("/api/subscribe", {
      body: JSON.stringify({
        email: subscribeInputRef.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    setEmailLoading(false);

    if (error) {
      return toast.error(error);
    }

    toast.success("You are now subscribed to feature updates!");
    subscribeInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Hacker Zephyr: what do you want for the journey?</title>
        <meta property="og:image" content="https://cloud-j9am5qb9q-hack-club-bot.vercel.app/0screenshot_2021-05-30_at_10.35.06_pm.png"></meta>
        <meta property="og:description" content="For the Hacker Zephyr, we'll be downloading a set of hacker resources (packages, documentation etc.) to use on the train."></meta>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="https://hackclub.com/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="https://hackclub.com/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="https://hackclub.com/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="https://hackclub.com/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="https://hackclub.com/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="https://hackclub.com/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="https://hackclub.com/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="https://hackclub.com/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://hackclub.com/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="https://hackclub.com/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://hackclub.com/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="https://hackclub.com/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://hackclub.com/favicon-16x16.png"
        />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <div className="flex justify-center items-center bg-black rounded-full w-16 sm:w-24 h-16 sm:h-24 my-8">
          <img
            src="https://assets.hackclub.com/icon-rounded.png"
            alt="Upstash Logo"
            className="rounded-full h-16 sm:h-24"
          />
        </div>
        <h1 className="text-lg sm:text-2xl font-bold mb-2">
          What do you want for the journey?
        </h1>
        <h2 className="text-md sm:text-xl mx-4" style={{ maxWidth: "550px" }}>
          For the Hacker Zephyr, we'll be downloading a set of hacker resources
          (packages, documentation etc.) to use on the train.
        </h2>

        <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
          <div className="mx-8 w-full">
            <form className="relative my-8" onSubmit={addFeature}>
              <input
                ref={featureInputRef}
                aria-label="Suggest a feature for our roadmap"
                placeholder="I want..."
                type="text"
                maxLength={150}
                required
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                className="flex items-center justify-center absolute right-2 top-2 px-4 h-10 text-lg border bg-black text-white rounded-md w-24 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800"
                type="submit"
              >
                {isCreateLoading ? <LoadingSpinner invert /> : "Request"}
              </button>
            </form>
          </div>
          <div className="w-full">
            {data.features.map((feature, index) => (
              <Item
                key={index}
                isFirst={index === 0}
                isLast={index === data.features.length - 1}
                isReleased={false}
                hasVoted={feature.ip === ip}
                feature={feature}
              />
            ))}
          </div>
          <hr className="border-1 border-gray-200 mt-8 mb-0 mx-8 w-full" />
          <div className="mx-8 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="flex items-center sm:my-8 mt-8 mb-2 w-full justify-center sm:justify-start">
                <a className="font-semibold mr-1" href="https://hackclub.com">Hack Club</a>
              </p>
              <a
                target="_blank"
                className="flex rounded focus:outline-none focus:ring focus:ring-blue-300 mb-4 sm:mb-0 min-w-max"
                href="https://zephyr.hackclub.com"
              >
                Learn more about the Zephyr.
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const ip =
    req.headers["x-forwarded-for"] || req.headers["Remote_Addr"] || "NA";
  const features = (await redis.hvals("features"))
    .map((entry) => JSON.parse(entry))
    .sort((a, b) => {
      // Primary sort is score
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;

      // Secondary sort is title
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;

      return 1;
    });

  return { props: { features, ip } };
}
