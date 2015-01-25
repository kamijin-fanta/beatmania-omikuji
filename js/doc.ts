/// <reference path="jquery.d.ts" />
/// <reference path="linq.d.ts" />
/// <reference path="linq.jquery.d.ts" />
/// <reference path="jquery-tmpl.d.ts" />



module kamijin {
    var verArray = [
        "1st style",
        "substream",
        "2nd style",
        "3rd style",
        "4th style",
        "5th style",
        "6th style",
        "7th style",
        "8th style",
        "9th style",
        "10th style",
        "11 IIDX RED",
        "12 HAPPY SKY",
        "13 DistorteD",
        "14 GOLD",
        "15 DJ TROOPERS",
        "16 EMPRESS",
        "17 SIRIUS",
        "18 Resort Anthem",
        "19 Lincle",
        "20 tricoro",
        "21 SPADA",
        "22 PENDUAL"
    ];
    class music {
        id:string;
        no:string;
        ver:string;
        msc:string;
        spn:string;
        sph:string;
        spa:string;
        spd:string;
        dpn:string;
        dph:string;
        dpa:string;
        dpd:string;
        n7:string;
        h7:string;
        a7:string;
        d7:string;
        n14:string;
        h14:string;
        a14:string;
        d14:string;
        bpm:string;
        bpmn:string;
        bpmx:string;
        bpmd:string;
        genre:string;
        artist:string;
        japan:string;
        firstVer:string;
        firstVerStr = () => {
            return verArray[parseInt(this.firstVer)];
        }
        verStr = () => {
            return verArray[parseInt(this.ver)];
        }
    }

    $(() => {
        var levelSelect = $(".level-select");
        var template = levelSelect.children().clone();
        levelSelect.empty();
        var progress = $(".progress-bar");
        var musicList: Array<music>;

        $("#debug").click(() => {
            console.log(JSON.stringify(musicList));
            return false;
        });

        $("#level-select-tmpl")
            .tmpl(Enumerable.range(1, 12).select(x => {return {level: x}}).toArray())
            .appendTo(".level-select")
            .on("click", "a", function(){
                var level = $(this).data("level");
                var randselect = Enumerable.choice(musicList)
                    .where(w =>
                        Enumerable.from([w.spn, w.sph, w.spa])
                            .where(l => l == level)
                            .count() != 0
                    )
                    .distinct(d => d.msc)
                    .take(4)
                    .trace()
                    .doAction(s => s["select"] = level)
                    .toArray();
                $("#result-tmpl").tmpl(randselect).appendTo($(".result").empty());

                // twitter
                var text = Enumerable.from(randselect)
                    .select((s) => {
                        return s.msc + "(SP " + [s.spn,s.sph,s.spa].join("/") + ")";
                    })
                    .toJoinedString("　");
                var link = "https://twitter.com/intent/tweet?"
                    + $.param({
                        "text": text,
                        "url": "http://kamijin-fanta.github.io/beatmania-omikuji/"
                    });
                $("#tweet").attr("href",link);
            });

        var url = "iidxdata.txt";
        if(true) url = "iidxdata.json"
        $.ajax(url, {
            beforeSend: () => {
                progress
                    .addClass("progress-bar-info")
                    .removeClass("progress-bar-warning")
                    .width("50%");
            },
            complete: () => {
                setTimeout(() => {
                    progress.width("100%");
                }, 200);
                setTimeout(() => {
                    progress.fadeTo(500, 0);
                }, 1200);
            },
            success: (ret: any) => {
                if(!$.isArray(ret)) {
                    var data = <string>ret;
                    var testMusicList = Enumerable.from(data.split("\n"))
                        .select(r => r.split("\t"))
                        .letBind(x =>
                            x.skip(1)
                                .select(z => {
                                    // z = ["8987","6612","66","Time to Empress",,,]
                                    var obj = new music();
                                    Enumerable.from(z)
                                        .zip(x.first(), (d, t) => {
                                            return {data: d, key: t};
                                        })
                                        .forEach(a => {
                                            // a = {data: "Time to Empress", key: "msc"}
                                            obj[a.key] = a.data
                                        });
                                    return obj;
                                })
                    )
                        .where(w => parseInt(w.ver) < 50)
                        .toArray()

                    musicList = Enumerable.from(testMusicList)
                        .where(w => w.ver == "21")
                        .select(s => {
                            s.firstVer = Enumerable.from(testMusicList)
                                .where(w => w.msc == s.msc)
                                .first().ver;
                            return s;
                        }).toArray();

                    console.log("complite tsv");
                } else {
                    musicList = <Array<music>>ret;
                    console.log("complite json");
                }
            },
            error: () => {
                progress
                    .addClass("progress-bar-warning")
                    .removeClass("progress-bar-info");
            }
        });
    });

}


















