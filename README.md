Facebook-Lock v0.5
=============

A prototype of a Google Extension for locking Facebook against malicious friends

Author: ikcede

INSTALLATION: 
Extract everything from the src folder, go to Settings/Tools/Extensions in Chrome, 
check "Developer Mode," click Load Unpacked Extension, and point to the src folder.

DESCRIPTION:
When you activate the extension, it will wait for the machine to go idle for 5 min
(default). Then, it will remove all of your facebook cookies. When you open facebook
again, you will be prompted to enter a passphrase (default "b"). If the phrase is entered
correctly, your facebook cookies will be returned to you and the tab will refresh.