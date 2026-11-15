#!/usr/bin/env python3
"""114s travel film: Wikimedia Commons imagery + Swedish ElevenLabs voiceover."""
import os,io,re,html,json,math,subprocess,pathlib,urllib.parse
import requests
from PIL import Image,ImageDraw,ImageFont

HERE=pathlib.Path(__file__).parent
TMP=HERE/"_render"
TMP.mkdir(parents=True,exist_ok=True)
W,H,FPS=1280,720,24
S=[
(6,"X2000, Skövde, 20240513 - 1.jpg","VÅRT NÄSTA ÄVENTYR","Från Skövde till Filippinerna",""),
(8,"Great Wall at Mutianyu.jpg","PÅ VÄG ÖSTERUT","Kanske en glimt av kinesiska muren",""),
(8,"Alona Beach, Panglao.jpg","BOHOL & PANGLAO","Vår första vecka i tropikerna",""),
(7,"Villa pool (3120145796).jpg","PLATS FÖR OSS ALLA","Villa med pool – eller markplansrum nära poolen","Inspirationsbild från Bali, inte vårt boende"),
(6,"Alona Beach.jpg","DET GODA SEMESTERLIVET","Strand och restauranger på gångavstånd",""),
(8,"Balicasag Island.jpg","BALICASAG","Snorkling i det blå",""),
(8,"Tortuga verde (Chelonia mydas), Anilao, Filipinas, 2023-08-24, DD 131.jpg","HAVSSKÖLDPADDOR","Vi hoppas få möta dem under ytan","Sköldpaddsbild tagen vid Anilao, Filippinerna"),
(7,"Loboc River, Bohol.jpg","LOBOC RIVER","Grönskande floder och djungeläventyr",""),
(6,"Chocolate Hills Bohol Philippines.jpg","CHOCOLATE HILLS","Ett helt annorlunda landskap",""),
(5,"PhilTarsier.JPG","ETT LITET SPÖKDJUR","Naturens fantastiska överraskningar",""),
(6,"OJ988.jpg","VIDARE VIA CEBU","Från Bohol till Boracay",""),
(8,"BoracayPhilippines.jpg","BORACAY","En vecka med kritvita stränder",""),
(7,"Le Meridien Nirwana Bali Villa private pool (2926930162).jpg","BO SOM VI VILL","Nära pool, strand och restauranger","Inspirationsbild från Bali, inte vårt boende"),
(7,"White beach on boracay island.jpg","WHITE BEACH","Bad, snorkling och långa kvällar",""),
(6,"Puka beach, boracay island.jpg","FLER UPPTÄCKTER","Puka Beach, båtutflykter och natur",""),
(11,"Boracay sunset.jpg","TVÅ ÖAR. SJU RESENÄRER.","Minnen för livet","Bilder: Wikimedia Commons – se bildkällor på hemsidan")
]
assert sum(x[0] for x in S)==114
API="https://commons.wikimedia.org/w/api.php"
HDR={"User-Agent":"PersonalFamilyFilm/1.0 (https://github.com/MrMartinPet/Vilja; public attribution)","Accept":"application/json"}
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def ff(*args):
    p=subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y",*map(str,args)],capture_output=True,text=True)
    if p.returncode:raise RuntimeError(p.stderr[-2500:])
def download_file(name):
    q={"action":"query","format":"json","prop":"imageinfo","iiprop":"url|extmetadata","iiurlwidth":"1600","titles":"File:"+name}
    r=requests.get(API,params=q,headers=HDR,timeout=35);r.raise_for_status()
    page=next(iter(r.json()["query"]["pages"].values()))
    info=page["imageinfo"][0]
    meta=info.get("extmetadata",{})
    clean=lambda x:html.unescape(re.sub(r"<[^>]*>","",x))
    license=clean(meta.get("LicenseShortName",{}).get("value",""))
    if not any(x in license.lower() for x in ["cc","public domain","pd","attribution"]):
        raise ValueError("Missing free photo license: "+name+" / "+license)
    u=info.get("thumburl",info["url"])
    r=requests.get(u,headers=HDR,timeout=85);r.raise_for_status()
    im=Image.open(io.BytesIO(r.content)).convert("RGB")
    return im,dict(name=name,license=license,artist=clean(meta.get("Artist",{}).get("value",""))[:150],url="https://commons.wikimedia.org/wiki/File:"+urllib.parse.quote(name.replace(" ","_")))
def picture(im):
    iw,ih=im.size
    ratio=max(W/iw,H/ih)
    nw,nh=math.ceil(iw*ratio),math.ceil(ih*ratio)
    im=im.resize((nw,nh),Image.Resampling.LANCZOS)
    return im.crop(((nw-W)//2,(nh-H)//2,(nw+W)//2,(nh+H)//2))
def make_card(photo,scene,i,elapsed):
    im=picture(photo).convert("RGBA")
    # Overlay for text readability
    shade=Image.new("RGBA",(W,H))
    layer=ImageDraw.Draw(shade)
    for x in range(0,W,7):
        a=int(20+150*(1-x/W)**2.4)
        layer.rectangle((x,0,x+7,H),fill=(2,24,30,a))
    layer.rectangle((0,450,W,H),fill=(0,18,24,86))
    im=Image.alpha_composite(im,shade)
    d=ImageDraw.Draw(im)
    fb=ImageFont.truetype(BOLD,46 if len(scene[2])>19 else 55)
    fs=ImageFont.truetype(FONT,23)
    ft=ImageFont.truetype(BOLD,14)
    fx=ImageFont.truetype(FONT,12)
    d.rounded_rectangle((53,53,242,88),radius=16,fill=(7,113,119,210))
    d.text((65,62),"FILIPPINERNA 2027",font=ft,fill="white")
    d.text((53,480),scene[2],font=fb,fill="white",stroke_width=1,stroke_fill="#053a3e")
    d.text((56,556),scene[3],font=fs,fill="#e3faf1")
    if scene[4]:
        d.rounded_rectangle((52,628,1100,653),radius=7,fill=(2,29,31,190))
        d.text((63,634),scene[4],font=fx,fill="#d9f5e6")
    d.rounded_rectangle((54,682,1225,688),radius=3,fill=(231,252,244,80))
    d.rounded_rectangle((54,682,54+int(1171*(elapsed+scene[0])/114),688),radius=3,fill=(44,224,199))
    d.text((1138,52),f"{i+1:02d} / {len(S):02d}",font=ft,fill="#eafff9")
    return im.convert("RGB")
def main():
    credits=[]; elapsed=0
    for i,scene in enumerate(S):
        seconds,name,_,_,_=scene
        try:
            photo,meta=download_file(name)
            print("PHOTO",name,meta["license"],flush=True)
        except Exception as exc:
            print("PHOTO DOWNLOAD FAILED",name,repr(exc),flush=True)
            photo=Image.new("RGB",(W,H),(12,79,89))
            meta={"name":name,"license":"Fallback illustration","artist":"Own design","url":""}
        credits.append(meta)
        still=TMP/f"{i:02d}.jpg"
        make_card(photo,scene,i,elapsed).save(still,quality=89)
        v=TMP/f"{i:02d}.mp4"
        vf="zoompan=z='min(zoom+0.0003,1.09)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=24,format=yuv420p"
        vf+=f",fade=t=in:st=0:d=0.16,fade=t=out:st={seconds-0.35:.2f}:d=0.3"
        ff("-loop","1","-framerate",FPS,"-t",seconds,"-i",still,"-vf",vf,"-r",FPS,"-an","-c:v","libx264","-preset","ultrafast","-crf","24","-pix_fmt","yuv420p",v)
        print("SCENE",i+1,seconds,flush=True)
        elapsed+=seconds
    (TMP/"list.txt").write_text("".join("file '"+str(TMP/f"{i:02d}.mp4")+"'\n" for i in range(len(S))))
    audio_url=os.environ.get("VOICE_URL","")
    if not audio_url:raise RuntimeError("Missing VOICE_URL")
    r=requests.get(audio_url,headers=HDR,timeout=85);r.raise_for_status()
    if len(r.content)<10000:raise RuntimeError("Voiceover audio too small")
    voice=TMP/"elevenlabs.mp3";voice.write_bytes(r.content)
    ff("-f","concat","-safe","0","-i",TMP/"list.txt","-c","copy",TMP/"silent.mp4")
    ff("-i",TMP/"silent.mp4","-i",voice,"-filter_complex","[1:a]afade=t=out:st=110:d=3.5[a]","-map","0:v","-map","[a]","-c:v","copy","-c:a","aac","-b:a","128k","-movflags","+faststart","-t","114",HERE/"filippinerna-2027.mp4")
    (HERE/"bildkallor.json").write_text(json.dumps(credits,ensure_ascii=False,indent=2))
    lines=["# Bildkällor – Filippinerna 2027","Foton från Wikimedia Commons, beskurna och försedda med text. Licenser och upphovsmän:",""]
    lines.extend(f"{j+1}. [{c['name']}]({c['url']}) – {c['artist']} – {c['license']}" for j,c in enumerate(credits))
    (HERE/"BILDKALLOR.md").write_text("\n".join(lines)+"\n",encoding="utf8")
    print("MOVIE_OK",str(HERE/"filippinerna-2027.mp4"),flush=True)
if __name__=="__main__":main()
