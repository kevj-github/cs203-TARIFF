// Use public anglify.svg instead of a lucide icon

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen w-screen lg:grid-cols-[1fr_2fr]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <img src="/anglify.svg" alt="Anglify" className="h-4 w-4" />
            </div>
            Anglify
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>

      <DotLottieReact
        src="https://lottie.host/a6b899ef-df12-4c45-a1e1-8247576f770b/R3U3MI3G0T.lottie"
        loop
        autoplay
        className="hidden lg:flex items-center justify-center w-full h-full mx-auto object-contain"
      />
    </div>
  );
}
