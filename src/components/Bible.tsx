import styles from "./Bible.module.css";
import { useEffect, useState } from "react";
import { useEnglishTts } from "../service/tts.tsx";
import { ShareIcon, ReadIcon } from "./icons";

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

      <div className={styles.bibleCard}>
        <div className={styles.cardHeader}>
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            data && <h3>{`${data.book} ${data.chapter}:${data.verse}`}</h3>
          )}
          <div className={styles.cardActions}>
            <button
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
        </div>
        <div className={styles.cardBody}>
          {loading ? <p>Loading verse...</p> : data && <p>{data.text}</p>}
        </div>
      </div>
    </div>
  );
};

export default Bible;
