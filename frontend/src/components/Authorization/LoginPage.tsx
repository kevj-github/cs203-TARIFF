import { Feather } from "lucide-react";

import { LoginForm } from "@/components/Authorization/login-form";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-screen lg:grid-cols-[1fr_2fr]">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Feather className="size-4" />
            </div>
            Anglify
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* <div className="bg-muted relative hidden lg:block rounded-sm"> */}
      {/* <img
          src={tariffImg}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}

      <DotLottieReact
        src="https://lottie.host/a6b899ef-df12-4c45-a1e1-8247576f770b/R3U3MI3G0T.lottie"
        loop
        autoplay
        className="hidden lg:flex items-center justify-center w-full h-full mx-auto object-contain"
      />
      {/* </div> */}
    </div>
  );
}
