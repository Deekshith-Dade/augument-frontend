import { SignedIn, SignedOut } from "@clerk/nextjs";
import LandingPage from "@/components/landing-page";
import AddThought from "@/components/thoughts/add-thought";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50/30 flex items-center justify-center p-4">
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <AddThought />
      </SignedIn>
    </div>
  );
}
