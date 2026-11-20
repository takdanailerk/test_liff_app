// src/App.tsx
import { useEffect, useState } from "react";
import liff from "@line/liff";

type Profile = { userId: string; displayName: string; pictureUrl?: string };

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    liff
      .init({ liffId: import.meta.env.VITE_LIFF_ID })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login(); // only needed in an external browser; inside LINE you're already logged in
          return;
        }
        setProfile(await liff.getProfile());
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <img src={profile.pictureUrl} width={80} />
      <h1>Hi, {profile.displayName}</h1>
      <p>In LINE client: {String(liff.isInClient())}</p>

      <button
        onClick={() =>
          liff.sendMessages([{ type: "text", text: "Hello from LIFF!" }])
        }
      >
        Send message
      </button>
      <button onClick={() => liff.closeWindow()}>Close</button>
    </div>
  );
}