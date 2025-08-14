import styles from "./AlretModal.module.css";
import React from "react";

interface WarningModalProps {
  message: string;
  onConfirm: () => void;
}
const AlertModal = ({ message, onConfirm }: WarningModalProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <p>
            {message.split("\n").map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < message.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.okButton} onClick={onConfirm}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
