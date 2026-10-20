#!/usr/bin/env python3
from __future__ import annotations
import json, urllib.request, urllib.parse, time
from pathlib import Path
from datetime import datetime, timezone

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"data"/"snapshot.json"
WB="https://api.worldbank.org/v2"
FX="https://open.er-api.com/v6/latest/USD"
LDC=set("AFG AGO BGD BEN BFA BDI KHM CAF TCD COM COD DJI ERI ETH GMB GIN GNB HTI KIR LAO LSO LBR MDG MWI MLI MRT MOZ MMR NPL NER RWA SEN SLE SLB SOM SSD SDN TLS TGO TUV UGA TZA YEM ZMB".split())

def get(url, tries=3):
    req=urllib.request.Request(url,headers={"User-Agent":"Sanitation-Explorer-static-snapshot/1.0"})
    last=None
    for i in range(tries):
        try:
            with urllib.request.urlopen(req,timeout=60) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            last=e
            if i+1<tries: time.sleep(2**i)
    raise RuntimeError(f"Failed {url}: {last}")

def wb(path, **params):
    params={"format":"json",**params}
    return get(f"{WB}{path}?{urllib.parse.urlencode(params)}")

def rows(code, dates):
    j=wb(f"/country/all/indicator/{code}",per_page="30000",date=dates,source="2")
    return j[1] if isinstance(j,list) and len(j)>1 and isinstance(j[1],list) else []

def latest(rr):
    out={}
    for d in rr:
        iso=d.get("countryiso3code"); val=d.get("value")
        if not iso or val is None: continue
        try: year=int(d.get("date")); value=float(val)
        except Exception: continue
        if iso not in out or year>out[iso]["year"]:
            out[iso]={"value":value,"year":year}
    return out

def main():
    yr=datetime.now(timezone.utc).year
    cj=wb("/country",per_page="400")
    countries=[]
    for c in (cj[1] if isinstance(cj,list) and len(cj)>1 else []):
        if c.get("region",{}).get("id")=="NA" or len(c.get("iso2Code",""))!=2: continue
        countries.append({
            "id":c["id"],"iso2Code":c["iso2Code"],"name":c["name"],
            "incomeLevel":{"value":c.get("incomeLevel",{}).get("value","Not classified")}
        })
    countries.sort(key=lambda x:x["name"])

    gni=latest(rows("NY.GNP.PCAP.CD",f"2005:{yr}"))
    gdp=latest(rows("NY.GDP.PCAP.CD",f"2005:{yr}"))
    gini=latest(rows("SI.POV.GINI",f"1990:{yr}"))
    basic=latest(rows("SH.STA.BASS.ZS",f"2022:{yr}"))
    od=latest(rows("SH.STA.ODFC.ZS",f"2022:{yr}"))

    ci={}
    for iso in set(gni)|set(gdp)|set(gini):
        ci[iso]={
            "gni":gni.get(iso,{"value":None,"year":None}),
            "gdp":gdp.get(iso,{"value":None,"year":None}),
            "gini":gini.get(iso,{"value":None,"year":None})
        }

    fxj=get(FX)
    fx=fxj.get("rates") or fxj.get("conversion_rates") or {"USD":1}
    fx["USD"]=1

    ldc=lambda m:{k:v for k,v in m.items() if k in LDC}
    snap={
        "generatedAt":datetime.now(timezone.utc).isoformat(),
        "status":"complete",
        "countries":countries,
        "countryIndicators":ci,
        "global":{"gni":ldc(gni),"gdp":ldc(gdp),"gini":ldc(gini),"basic":ldc(basic),"od":ldc(od)},
        "fx":fx
    }
    OUT.parent.mkdir(exist_ok=True)
    tmp=OUT.with_suffix(".tmp")
    tmp.write_text(json.dumps(snap,separators=(",",":")),encoding="utf-8")
    tmp.replace(OUT)
    print(f"Wrote {OUT}: {len(countries)} countries; {len(snap['global']['gni'])} LDC GNI; {len(snap['global']['basic'])} LDC JMP basic")

if __name__=="__main__":
    main()
