"use client";
import { useEffect, useState } from "react";
import { remark } from "remark";
import html from "remark-html";

export default function MdConverter({ markdown }: { markdown: string }) {
  const [data, setData] = useState("");
//   const contentHtml = markdownToHtml(markdown);
  useEffect(() => {
    async function markdownToHtml(markdown: any) {
      const processedContent = await remark().use(html).process(markdown);
      setData(processedContent.toString());
    }
    markdownToHtml(markdown);
  }, [markdown]);


  return <div
  
  dangerouslySetInnerHTML={{ __html: data }} 
  className="
  prose dark:prose-invert 
  prose-p:text-xs prose-p:md:text-sm prose-p:lg:text-base 
  "
  />;
}
