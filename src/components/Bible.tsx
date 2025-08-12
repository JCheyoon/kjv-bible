import styles from "./Bible.module.css";
import { useEffect, useRef, useState } from "react";
import { useEnglishTts } from "../service/tts.tsx";
import { ShareIcon, ReadIcon } from "./icons";
import html2canvas from "html2canvas";

interface RandomVerse {
  book: string;
  book_id: string;
  chapter: number;
  text: string;
  verse: number;
}

const Bible = () => {
  const [data, setData] = useState<RandomVerse | null>(null);
  const [testament, setTestament] = useState<"OT" | "NT">("OT");
  const [loading, setLoading] = useState<boolean>(false);

  const testaments: Array<"OT" | "NT"> = ["OT", "NT"];
  const cardRef = useRef<HTMLDivElement | null>(null);

  async function getRandomVerse(selectedTestament: "OT" | "NT") {
    setLoading(true);

    try {
      const url =
        selectedTestament === "OT"
          ? "https://bible-api.com/data/web/random/OT"
          : "https://bible-api.com/data/web/random/NT";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setData(data.random_verse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }
  const { readOut } = useEnglishTts();

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    getRandomVerse(testament);
  }, [testament]);

  const handleShare = async () => {
    if (!navigator.clipboard || !window.ClipboardItem) {
      alert("This browser does not support image copying to clipboard.");
      return;
    }

    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2 });

    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("❌ Failed to generate image blob.");
        return;
      }
      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        alert(
          "✅ Image copied to clipboard!\nTry pasting it into KakaoTalk or any messenger using Ctrl+V.",
        );
      } catch (err) {
        alert("❌ Failed to copy image to clipboard.");
        console.error(err);
      }
    });
  };

  return (
    <div className={styles.bibleContainer}>
      <div className={styles.bibleSelector}>
        {testaments.map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${testament === t ? styles.tabActive : ""}`}
            onClick={() => setTestament(t)}
          >
            {t === "OT" ? "Old Testament" : "New Testament"}
          </button>
        ))}
      </div>
      <div className={styles.cardContainer}>
        <button
          onClick={() => handleShare()}
          className={`${styles.iconBtn} ${styles.iconBtnRight8}`}
          aria-label="share button"
        >
          <ShareIcon />
        </button>
        <button
          className={`${styles.iconBtn} ${styles.iconBtnRight16}`}
          onClick={() => readOut(data!.text)}
          disabled={loading || !data?.text}
          aria-label="read button"
        >
          <ReadIcon />
        </button>
      </div>
      <div className={styles.bibleCard} ref={cardRef}>
        <div className={styles.cardHeader}>
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            data && <h3>{`${data.book} ${data.chapter}:${data.verse}`}</h3>
          )}
        </div>
        <div className={styles.cardBody}>
          {loading ? <p>Loading verse...</p> : data && <p>{data.text}</p>}
        </div>
      </div>
    </div>
  );
};

export default Bible;
