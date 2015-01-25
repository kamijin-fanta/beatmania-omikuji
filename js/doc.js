/// <reference path="jquery.d.ts" />
/// <reference path="linq.d.ts" />
/// <reference path="linq.jquery.d.ts" />
/// <reference path="jquery-tmpl.d.ts" />
var kamijin;
(function (kamijin) {
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
    var music = (function () {
        function music() {
            var _this = this;
            this.firstVerStr = function () {
                return verArray[parseInt(_this.firstVer)];
            };
            this.verStr = function () {
                return verArray[parseInt(_this.ver)];
            };
        }
        return music;
    })();

    $(function () {
        var levelSelect = $(".level-select");
        var template = levelSelect.children().clone();
        levelSelect.empty();
        var progress = $(".progress-bar");
        var musicList;

        $("#debug").click(function () {
            console.log(JSON.stringify(musicList));
            return false;
        });

        $("#level-select-tmpl").tmpl(Enumerable.range(1, 12).select(function (x) {
            return { level: x };
        }).toArray()).appendTo(".level-select").on("click", "a", function () {
            var level = $(this).data("level");
            var randselect = Enumerable.choice(musicList).where(function (w) {
                return Enumerable.from([w.spn, w.sph, w.spa]).where(function (l) {
                    return l == level;
                }).count() != 0;
            }).distinct(function (d) {
                return d.msc;
            }).take(4).trace().doAction(function (s) {
                return s["select"] = level;
            }).toArray();
            $("#result-tmpl").tmpl(randselect).appendTo($(".result").empty());
        });

        var url = "iidxdata.txt";
        if (true)
            url = "iidxdata.json";
        $.ajax(url, {
            beforeSend: function () {
                progress.addClass("progress-bar-info").removeClass("progress-bar-warning").width("50%");
            },
            complete: function () {
                setTimeout(function () {
                    progress.width("100%");
                }, 200);
                setTimeout(function () {
                    progress.fadeTo(500, 0);
                }, 1200);
            },
            success: function (ret) {
                if (!$.isArray(ret)) {
                    var data = ret;
                    var testMusicList = Enumerable.from(data.split("\n")).select(function (r) {
                        return r.split("\t");
                    }).letBind(function (x) {
                        return x.skip(1).select(function (z) {
                            // z = ["8987","6612","66","Time to Empress",,,]
                            var obj = new music();
                            Enumerable.from(z).zip(x.first(), function (d, t) {
                                return { data: d, key: t };
                            }).forEach(function (a) {
                                // a = {data: "Time to Empress", key: "msc"}
                                obj[a.key] = a.data;
                            });
                            return obj;
                        });
                    }).where(function (w) {
                        return parseInt(w.ver) < 50;
                    }).toArray();

                    musicList = Enumerable.from(testMusicList).where(function (w) {
                        return w.ver == "21";
                    }).select(function (s) {
                        s.firstVer = Enumerable.from(testMusicList).where(function (w) {
                            return w.msc == s.msc;
                        }).first().ver;
                        return s;
                    }).toArray();

                    console.log("complite tsv");
                } else {
                    musicList = ret;
                    console.log("complite json");
                }
            },
            error: function () {
                progress.addClass("progress-bar-warning").removeClass("progress-bar-info");
            }
        });
    });
})(kamijin || (kamijin = {}));
//# sourceMappingURL=doc.js.map
