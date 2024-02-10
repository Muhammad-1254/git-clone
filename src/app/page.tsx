"use client";

import ChatSection from "@/components/ChatSection";
import LeftNavBar from "@/components/LeftNavBar";
import UserMenu from "@/components/UserMenu";

const Page = () => {
  

  
  return (
    <main className="w-[350px] md:w-[765px] lg:w-[calc(100vw-35px)]   mx-auto  
    flex 
    ">
<section className="">

      <LeftNavBar/>
</section>
   

    <section className="lg:mx-auto">
    <ChatSection/>
    <UserMenu/>
    
    </section>
    <section>
      
    </section>
    </main>
  );
};

export default Page;
