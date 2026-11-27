import type { Metadata } from 'next';
export const siteUrl=process.env.SITE_URL;
export const published=process.env.SITE_PUBLISHED==='true'&&!!siteUrl;
export function metadata(title:string,description:string,path='/'):Metadata{return {title,description,alternates:published?{canonical:new URL(path,siteUrl).href}:undefined,openGraph:{title,description,locale:'ru_RU',type:'website',...(published?{url:new URL(path,siteUrl).href}:{})},robots:{index:published,follow:published}};}
export function pageSchema(name:string,path:string){return published?{'@context':'https://schema.org','@type':'WebPage',name,url:new URL(path,siteUrl).href,isPartOf:{'@type':'WebSite',name:'Коммерческая недвижимость Минска',url:siteUrl}}:null;}
