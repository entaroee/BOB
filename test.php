<?php
$week=$_GET["week"];
$criteria=$_GET["criteria"];
$txtHint=$_GET["txtHint"];

$xmlDoc = new DOMDocument();
$xmlDoc->load("filename" . $week . ".xml");


$x=$xmlDoc->getElementsByTagName($criteria);
$j=0;
$k=0;
$flag=0;

if($criteria !== "Ranking") {
    if($txtHint !=="") {
        $txtHint = strtolower($txtHint);
        $len = strlen($txtHint);
        for ($i=0; $i<=$x->length-1; $i++) {
            if ($x->item($i)->nodeType==1) {
                for($temp=0;$temp<$len;$temp++) {
                    if ( strtolower($x->item($i)->childNodes->item(0)->nodeValue[$temp]) == $txtHint[$temp]) {
                        $flag=$flag+1;
                    }
                }
                if($flag == $len) {
                    $y[$j]=($x->item($i)->parentNode);
                    $j++;
                }
            }
            $flag = 0;
        }
    }
}

else {
    if($txtHint !=="") {
        for ($i=0; $i<=$x->length-1; $i++) {
            if ($x->item($i)->nodeType==1) {

                if ( $x->item($i)->childNodes->item(0)->nodeValue == $txtHint) {
                    $y[$j]=($x->item($i)->parentNode);
                    $j++;
                }
            }
        }
    }
}

if($j==0) {
    echo ("No result!");
}
for($k=0;$k<$j;$k++) {
    $cd=($y[$k]->childNodes);
    for ($i=0;$i<$cd->length;$i++) {
        if ($cd->item($i)->nodeType==1) {
            echo("<b>" . $cd->item($i)->nodeName . ":</b> ");
            echo($cd->item($i)->childNodes->item(0)->nodeValue);
            echo("<br>");
        }
    }
}
?>
