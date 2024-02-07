"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
 
import { useTheme } from "next-themes";

const UserMenu = () => {
  const [clicked, setClicked] = useState(false);
  const {theme, setTheme  } = useTheme()

  return (
    <>
    <div className="hidden md:flex absolute top-[5%] right-[5%]">
      <Button
        variant={"secondary"}
        onClick={() => setClicked(!clicked)}
        className="z-50 text-2xl hover:text-blue-600 cursor-pointer"
      >
        <FaUser />
      </Button>

      {clicked && (
        <Card className={` absolute w-[250px] h-[350px] top-[5%] right-[2%]   
        duration-500
      `}>
       <div className="  flex items-center  space-x-3 mt-2 ml-2">
      <Switch 
      onClick={() => setTheme(theme === 'dark' ? 'light':'dark')}
      className=" " />
      <p className="font-bold text-xs md:text-sm ">Mode</p>
    </div>
      </Card>
        
        )}
    </div>
    {
clicked&&
        <div onClick={()=>setClicked(false)} className="w-full h-full "/>
    }
        </>
  );
};

export default UserMenu;
