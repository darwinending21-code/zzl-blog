"use client";

import { useEffect, useRef, useState } from "react";
import {Image} from "antd";
import Link from "next/link";

// 项目详情数据（实际项目中应从 API 或 CMS 获取）

// 右侧导航锚点
const navAnchors = [
  { id: "introduction", label: "INTRODUCTION", labelZh: "介绍" },
  { id: "gallery", label: "GALLERY", labelZh: "图库" },
  { id: "documentation", label: "DOCUMENTATION", labelZh: "设计文档" },
  { id: "honor", label: "HONOR", labelZh: "荣誉" },
  { id: "thanks", label: "THANKS", labelZh: "致谢" },
];

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeAnchorId, setActiveAnchorId] = useState<string>(navAnchors[0].id);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const [projectItem,setProjectItem] = useState<any>({})
  const [publicPath,setPublicPath] = useState<string>('')
  useEffect(()=>{
    let item = localStorage.getItem('projectItem')?JSON.parse(localStorage.getItem('projectItem') || '{}'):{}
    console.log(item)
setProjectItem(item)
setPublicPath( `/assets/images/project/${item.id}/`)
  },[])
  // 根据滚动位置高亮当前区块（含页面底部：最后一个 section 进入视口时也要选中）
  useEffect(() => {
    const updateActive = () => {
      const topOffset = 120;
      let currentId = navAnchors[0].id;
      for (let i = 0; i < navAnchors.length; i++) {
        const el = document.getElementById(navAnchors[i].id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= topOffset) currentId = navAnchors[i].id;
      }
      setActiveAnchorId(currentId);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  // 滑动条位置随当前选中项更新
  useEffect(() => {
    const updateIndicator = () => {
      const el = activeAnchorId ? linkRefs.current[activeAnchorId] : null;
      const nav = navRef.current;
      if (!el || !nav) return;
      const navRect = nav.getBoundingClientRect();
      const linkRect = el.getBoundingClientRect();
      setIndicatorStyle({
        top: linkRect.top - navRect.top,
        height: linkRect.height,
      });
    };
    const raf = requestAnimationFrame(updateIndicator);
    return () => cancelAnimationFrame(raf);
  }, [activeAnchorId]);

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 project_detail">
      <div className="flex gap-12">
        {/* 左侧主内容区 */}
        <div className="flex-1">
          {/* 返回链接 */}
          <Link
            href="/project"
            className="mb-6 inline-flex items-center gap-2 text-base text-gray-500 transition-colors hover:text-black"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回项目列表
          </Link>
          {/* 标签 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {projectItem?.tags?.length>0 && projectItem?.tags?.map((tag, index) => (
              <span
                key={index}
                className={`bg-black rounded px-2 py-1 text-xs text-white`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="mb-2 text-3xl font-bold">{projectItem.title}</h1>
          <h2 className="mb-4 text-2xl text-gray-600">{projectItem.titleEn}</h2>

          {/* 时间和类型 */}
          <p className="mb-2 text-sm text-gray-500">
            项目时间：{projectItem.date}
          </p>
          <p className="mb-8 text-sm text-gray-500">{projectItem.type}</p>

          {/* INTRODUCTION / 介绍 */}
          <section id="introduction" className="mb-16">
            <h3 className="mb-6 text-xl font-bold">INTRODUCTION / 介绍</h3>

            {/* 主图 */}
          {
              projectItem.video &&<div className="relative mb-8 aspect-video w-full overflow-hidden bg-gray-100">
         <iframe
  width="1164"
  height="100%"
  src={projectItem.video} 
  title="YouTube video player"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  >
</iframe>
            </div>
          }

            {/* 中文介绍 */}
            <div className="mb-6 whitespace-pre-line text-gray-700">
              {projectItem.desc }
            </div>

            {/* 英文介绍 */}
            <div className="whitespace-pre-line text-gray-600">
              {projectItem.desc_en }

            </div>
          </section>

          {/* GALLERY / 图库 */}
          {
            projectItem?.gallerys?.length>0 &&  <section id="gallery" className="mb-16">
            <h3 className="mb-6 text-xl font-bold">GALLERY / 图库</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <Image.PreviewGroup>
              {projectItem?.gallerys&&projectItem.gallerys.map((img:any, index:number) => (
                <div
                  key={index}
                  className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-100"
                >
                 <Image  className="!w-full !h-full object-cover" src={publicPath+img} ></Image>
                </div>
              ))}
              </Image.PreviewGroup>
            </div>
          </section>
          }
        

          {/* DOCUMENTATION / 设计文档 */}
          <section id="documentation" className="mb-16">
            <h3 className="mb-6 text-xl font-bold">DOCUMENTATION / 设计文档</h3>
            <p className="text-gray-500">暂无设计文档</p>
          </section>

          {/* HONOR / 荣誉 */}
          <section id="honor" className="mb-16">
            <h3 className="mb-6 text-xl font-bold">HONOR / 荣誉</h3>
           <div>
             <div 
          dangerouslySetInnerHTML={{ __html: projectItem.honor }}
          className="honor-content"
        />
           </div>
          </section>
          {
              projectItem.publication &&<section id="publication" className="mb-16">
            <h3 className="mb-6 text-xl font-bold">Publication / 发表</h3>
           <div>
             <div 
          dangerouslySetInnerHTML={{ __html: projectItem.publication }}
          className="publication-content"
        />
           </div>
          </section>
          }

          {/* THANKS / 致谢 */}
          <section id="thanks" className="mb-16">
            <h3 className="mb-6 text-xl font-bold">THANKS / 致谢</h3>
            <p className="text-gray-500">{projectItem.thanks?projectItem.thanks:"暂无"}致谢信息</p>
          </section>
        </div>

        {/* 右侧导航：滑动边框指示当前区块 */}
        <aside className="sticky top-24 hidden h-fit w-64 lg:block">
          <nav ref={navRef} className="relative pl-4 border-gray-200 border-l">
            {/* 滑动指示条 */}
            <div
              className="absolute -left-[1px] w-0.5 bg-black transition-all duration-200 ease-out"
              style={{
                top: indicatorStyle.top,
                height: indicatorStyle.height,
              }}
              aria-hidden
            />
            {navAnchors.map((anchor) => (
              <a
                key={anchor.id}
                ref={(el) => {
                  linkRefs.current[anchor.id] = el;
                }}
                href={`#${anchor.id}`}
                className={`mb-3 block text-sm transition-colors hover:text-black ${
                  activeAnchorId === anchor.id ? "font-medium text-black" : "text-gray-500"
                }`}
              >
                {anchor.label} / {anchor.labelZh}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
