'use client'

import UserInput from "@/components/UserInput";
import { useTheme } from "next-themes";


const Homepage = () => {
  const {theme, setTheme} = useTheme()
  setTheme('dark')
  return (
    <section className="w-[80%] h-full flex flex-col items-center justify-between">
<UserInput/>
    </section>
  );
};

export default Homepage;
