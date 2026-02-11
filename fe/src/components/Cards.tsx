import { useEffect } from "preact/hooks";
import "./card.css";

export function InfoCard({ message }: { message: string }) {
  return (
    <div className="card info-card">
      <h4>Info</h4>
      <p>{message}</p>
    </div>
  );
}

export function ErrorCard({ message }: { message: string }) {
  useEffect(() => {
    console.error("ErrorCard:", message);
  }, [message]);
  return (
    <div className="card error-card">
      <h4>Error</h4>
      <p>{message}</p>
    </div>
  );
}
