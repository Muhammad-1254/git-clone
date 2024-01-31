

import HomePage from "@/components/HomePage";
import UserInput from "@/components/UserInput";
import UserMenu from "@/components/UserMenu";
const Homepage = () => {
  return (
    <section className="w-[80%] h-full flex flex-col items-center justify-between">
      <HomePage/>
      <UserMenu />
      <UserInput/>
    </section>
  );
};

export default Homepage;
