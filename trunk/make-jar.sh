#!/bin/sh
jar xf jython.jar
jar xf plugin.jar
jar cfm pint.jar META-INF/MANIFEST.MF com org jxxload_help netscape sun *.class
# keytool -genkey -keyalg rsa -alias Pint
# echo -n "pint123" | keytool -certreq -alias Pint | head -n 8 | tail -n 7 > pint.cer
# echo -n "pint123" | keytool -import -alias Pint -file pint.cer
echo -n "pint123" | jarsigner pint.jar Pint
rm -r META-INF com org jxxload_help netscape sun *.class
