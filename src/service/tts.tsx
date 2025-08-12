import { useCallback, useEffect, useState } from "react";

export function useEnglishTts() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isUserEnabled, setIsUserEnabled] = useState(true);

  useEffect(() => {
    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const englishVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith("en"),
  );
  const isBrowserEnabled = englishVoices.length > 0;
  const isEnabled = isBrowserEnabled && isUserEnabled;

  const toggleVoice = useCallback(() => setIsUserEnabled((v) => !v), []);
  const readOut = useCallback(
    (text: string) => {
      if (!isEnabled || !text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      console.log(englishVoices);
      if (englishVoices.length) {
        const randomIndex = Math.floor(Math.random() * englishVoices.length);
        utterance.voice = englishVoices[randomIndex];
      }
      window.speechSynthesis.speak(utterance);
    },
    [isEnabled, englishVoices],
  );

  return { isEnabled, toggleVoice, readOut };
}
