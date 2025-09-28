import { GalleryVerticalEnd, LucideCroissant } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


import tariffImg from "../assets/tariff.png";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen w-screen lg:grid-cols-[1fr_2fr]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <LucideCroissant className="size-4" />
            </div>
            Tariff
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>

      <DotLottieReact
        src="https://lottie.host/7fa0255f-7fe0-43ea-a5f6-3a8619aded05/Q65blTQLbt.lottie"
        loop
        autoplay
        className="hidden lg:flex items-center justify-center w-full h-full mx-auto object-contain"
      />

    </div>
  );
}
