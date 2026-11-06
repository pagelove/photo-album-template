import {parseDocument as parseLegacy,field,escape,safeURL} from './model.mjs';
import {config} from './config.mjs';
export {field};
export const LIMIT=2000000;
const PHOTO='urn:Pagelove:photos:Record:1',ALBUM='urn:Pagelove:photos:Album:1';
const keys=['title','album','date','image','alt','description','state'];
export const albums=root=>[...root.children].filter(r=>r.getAttribute('itemtype')===ALBUM);
export const photos=root=>[...root.children].filter(r=>r.getAttribute('itemtype')===PHOTO);
const id=()=> 'r-'+crypto.randomUUID();
function set(row,key,value){let el=[...row.children].find(e=>e.getAttribute('itemprop')===key);if(!el){el=row.ownerDocument.createElement(key==='title'?'h2':'p');el.setAttribute('itemprop',key);row.append(el);}el.textContent=value;}
function record(root,type,identity,values){const row=root.ownerDocument.createElement('article');row.id=identity;row.setAttribute('itemscope','');row.setAttribute('itemtype',type);for(const[k,v]of Object.entries(values))set(row,k,v);return row;}
export function validateLibrary(root){
 if(root?.tagName!=='SECTION'||root.id!=='records'||root.dataset.app!=='photos'||root.dataset.format!=='2')throw Error('Unsupported photo library format. Your library was retained.');
 if(new TextEncoder().encode(root.outerHTML).length>LIMIT)throw Error('Library exceeds 2 MB. Export a backup and remove photos before adding more.');
 if(root.children.length>500)throw Error('This library supports up to 500 records.');
 const ids=new Set(),names=new Set();
 for(const el of [root,...root.querySelectorAll('*')]){
  if(!['SECTION','ARTICLE','H2','P','TIME'].includes(el.tagName))throw Error('Unsupported library markup.');
  for(const a of el.attributes)if(!['id','data-app','data-format','itemscope','itemtype','itemprop'].includes(a.name))throw Error('Unsupported library attribute.');
  if(el.id){if(ids.has(el.id))throw Error('Duplicate library identity.');ids.add(el.id);}
 }
 for(const row of root.children){
  if(row.tagName!=='ARTICLE'||!/^r-[a-z0-9-]{1,70}$/.test(row.id))throw Error('Invalid record identity.');
  const type=row.getAttribute('itemtype');if(row.id==='r-settings'&&type!=='urn:Pagelove:photos:Settings:1')throw Error('Reserved settings identity.');const contract=type===ALBUM?['title','description','cover']:type===PHOTO?keys:row.id==='r-settings'&&type==='urn:Pagelove:photos:Settings:1'?['name','headline','about']:null;
  if(!contract||row.children.length!==contract.length)throw Error('Unknown record type or fields.');
  for(const key of contract){const fields=[...row.children].filter(e=>e.getAttribute('itemprop')===key);if(fields.length!==1||fields[0].children.length||!['H2','P','TIME'].includes(fields[0].tagName))throw Error('Invalid '+key+' field.');const value=fields[0].textContent;if(value.length>(key==='image'?350000:5000))throw Error(key+' is too long.');if(['title','album','date','state','name','headline','about'].includes(key)&&!value.trim())throw Error(key+' is required.');}
  if(type===ALBUM){const name=field(row,'title').trim().toLocaleLowerCase();if(names.has(name))throw Error('An album with that name already exists.');names.add(name);}
  if(type===PHOTO){const date=field(row,'date');if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00Z'))||new Date(date+'T00:00Z').toISOString().slice(0,10)!==date)throw Error('Choose a valid photo date.');if(!['Published','Draft'].includes(field(row,'state')))throw Error('Unsupported photo state.');safeURL(field(row,'image'),{image:true});}
 }
 const albumMap=new Map(albums(root).map(a=>[a.id,a])),photoMap=new Map(photos(root).map(p=>[p.id,p]));
 for(const p of photoMap.values())if(!albumMap.has(field(p,'album')))throw Error('A photo refers to an unknown album.');
 for(const a of albumMap.values()){const cover=field(a,'cover');if(cover&&(!photoMap.has(cover)||field(photoMap.get(cover),'album')!==a.id))throw Error('Choose a cover from this album.');}
 if(!root.querySelector('#r-settings'))throw Error('Library collection details are missing.');return root;
}
export function migrateLegacy(root){
 const copy=root.cloneNode(true);copy.dataset.format='2';const groups=new Map();
 for(const p of photos(copy)){const name=field(p,'album').trim();let a=groups.get(name);if(!a){let n=groups.size+1,identity='r-album-'+n;while(copy.querySelector('#'+identity))identity='r-album-'+(++n);a=record(copy,ALBUM,identity,{title:name,description:'',cover:p.id});copy.append(a);groups.set(name,a);}set(p,'album',a.id);}
 if(!copy.querySelector('#r-settings'))copy.append(record(copy,'urn:Pagelove:photos:Settings:1','r-settings',Object.fromEntries(config.settings.map(f=>[f.key,f.default]))));return validateLibrary(copy);
}
export function parseLibrary(text,Parser=DOMParser){
 if(new TextEncoder().encode(text).length>LIMIT)throw Error('Import exceeds 2 MB. Your library was retained.');
 const doc=new Parser().parseFromString(text,'text/html'),roots=doc.querySelectorAll('#records');
 if(roots.length!==1||doc.body.children.length!==1||doc.body.firstElementChild!==roots[0]||[...doc.body.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))throw Error('Expected exactly one library document.');
 if(roots[0].dataset.format==='1')return migrateLegacy(parseLegacy(text,config,Parser));
 return validateLibrary(roots[0]);
}
export function serializeLibrary(root){validateLibrary(root);const text='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Collected Light library</title></head><body>'+root.outerHTML+'</body></html>';if(new TextEncoder().encode(text).length>LIMIT)throw Error('Library exceeds 2 MB. Export a backup and remove photos before adding more.');return text;}
export function createAlbum(root,{title,description='',cover=''},identity=id()){
 const copy=root.cloneNode(true);copy.append(record(copy,ALBUM,identity,{title:title.trim(),description:description.trim(),cover}));return validateLibrary(copy);
}
export function editAlbum(root,identity,{title,description='',cover=''}){const copy=root.cloneNode(true),row=albums(copy).find(a=>a.id===identity);if(!row)throw Error('Album no longer exists.');set(row,'title',title.trim());set(row,'description',description.trim());set(row,'cover',cover);return validateLibrary(copy);}
function repairCovers(root){for(const a of albums(root)){const members=photos(root).filter(p=>field(p,'album')===a.id);if(!members.some(p=>p.id===field(a,'cover')))set(a,'cover',members[0]?.id||'');}}
export function deleteAlbum(root,identity){const copy=root.cloneNode(true),row=albums(copy).find(a=>a.id===identity);if(!row)throw Error('Album no longer exists.');const members=photos(copy).filter(p=>field(p,'album')===identity);if(members.length){let unsorted=albums(copy).find(a=>a.id!==identity&&field(a,'title').toLowerCase()==='unsorted');if(!unsorted){let name=field(row,'title').toLowerCase()==='unsorted'?'Recovered photos':'Unsorted';while(albums(copy).some(a=>a.id!==identity&&field(a,'title').toLowerCase()===name.toLowerCase()))name+=' (kept)';unsorted=record(copy,ALBUM,id(),{title:name,description:'Photos kept when an album was removed.',cover:members[0].id});copy.append(unsorted);}for(const p of members)set(p,'album',unsorted.id);}row.remove();repairCovers(copy);return validateLibrary(copy);}
export function putPhoto(root,values,identity=id()){
 const copy=root.cloneNode(true);let row=photos(copy).find(p=>p.id===identity);if(!row){row=record(copy,PHOTO,identity,{});copy.append(row);}for(const key of keys)set(row,key,String(values[key]??''));repairCovers(copy);return validateLibrary(copy);
}
export function deletePhoto(root,identity){const copy=root.cloneNode(true),row=photos(copy).find(p=>p.id===identity);if(!row)throw Error('Photo no longer exists.');row.remove();repairCovers(copy);return validateLibrary(copy);}
export function visiblePhotos(root,{album='',query='',sort='newest'}={}){const q=query.trim().toLowerCase(),list=photos(root).filter(p=>(!album||field(p,'album')===album)&&['title','description','alt'].some(k=>field(p,k).toLowerCase().includes(q)));return list.sort((a,b)=>sort==='title'?field(a,'title').localeCompare(field(b,'title')):sort==='oldest'?field(a,'date').localeCompare(field(b,'date')):field(b,'date').localeCompare(field(a,'date')));}
export function coverPhoto(root,album){const members=photos(root).filter(p=>field(p,'album')===album.id);return members.find(p=>p.id===field(album,'cover'))||members.find(p=>field(p,'image'));}
