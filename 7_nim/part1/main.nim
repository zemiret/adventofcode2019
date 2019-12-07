import osproc
import strutils
import sequtils

let tmpfilename = "pipefile"

proc runAmplifier(input: int, phase: int): int =
    writeFile(tmpfilename, $phase & "\n" & $input)
    return execProcess("node ../../intcode/main.js input " & tmpfilename).strip.parseInt

var max = -1
var outa, outb, outc, outd, oute: int

echo ""

# This is freakin' terrible xD
for a in toSeq(0..4):
    outa = runAmplifier(0, a)
    for b in toSeq(0..4).filterIt(it != a):
        outb = runAmplifier(outa, b)
        for c in toSeq(0..4).filterIt(it != b and it != a):
            outc = runAmplifier(outb, c)
            for d in toSeq(0..4).filterIt(it != b and it != a and it != c):
                outd = runAmplifier(outc, d)
                for e in toSeq(0..4).filterIt(it != b and it != a and it != c and it != d):
                    oute = runAmplifier(outd, e)
                    echo oute
                    if oute > max:
                        max = oute


echo ""
echo max

