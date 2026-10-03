import { useState } from "react";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/lib/constants";
import { useProfile } from "@/lib/profile";

export default function PrivacyPage() {
  const profile = useProfile();
  const [cleared, setCleared] = useState(false);

  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEYS.profile);
      localStorage.removeItem(STORAGE_KEYS.results);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event("careernova:profile"));
    setCleared(true);
  }

  return (
    <Container className="flex max-w-[720px] flex-col gap-6 py-12 md:box-content md:py-[72px]">
      <h1 className="text-display-3">Privacy</h1>
      <p className="text-lg leading-7 text-muted-foreground">
        CareerNova has no accounts and no server-side storage. Everything you enter stays in this browser.
      </p>
      <dl className="flex flex-col">
        {[
          ["Your profile", "Saved in this browser's local storage so you can come back to it. It is never sent anywhere."],
          ["Your CV", "Read inside your browser to find tools, then discarded. The file is never uploaded or stored."],
          ["Matching", "Runs on your device using a copy of the O*NET data."],
          ["Course links", "Open search pages on Coursera, freeCodeCamp or YouTube. Those sites have their own privacy policies."],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1 border-b border-border py-3 sm:flex-row sm:gap-6">
            <dt className="font-medium sm:w-[160px] sm:shrink-0">{k}</dt>
            <dd className="text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      {profile && !cleared ? (
        <Button variant="secondary" className="self-start" onClick={clear}>
          Delete my profile from this device
        </Button>
      ) : cleared ? (
        <p role="status" className="text-muted-foreground">
          Your profile has been deleted from this device.
        </p>
      ) : null}
    </Container>
  );
}
