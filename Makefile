
.PHONY: wrench
wrench:
	@@if [ ! -e lib/wrench/Makefile ]; then echo "Wrench.js repo does not appear to be checked out.\nYou probably did not initialize the submodule.\nPlease run \`git submodule init\` followed by \`git submodule update\`"; exit 1; fi;
	@@echo "Updating lib/wrench17.js"
	cd lib/wrench/; make wrench17 DIST_DIR=..

.PHONY: rhino
rhino:
	@@if [ ! -e lib/rhino/build.xml ]; then echo "Rhino repo does not appear to be checked out.\nYou probably did not initialize the submodule.\nPlease run \`git submodule init\` followed by \`git submodule update\`"; exit 1; fi;
	@@echo "Updating lib/js.jar"
	cd lib/rhino/; ant jar -Ddist.dir=..

