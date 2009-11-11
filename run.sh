#!/bin/bash

JAVA=java
if [ -n "$JAVA_HOME" ]; then
	JAVA=$JAVA_HOME/bin/java
fi

$JAVA -Xbootclasspath/p:"lib/jline-0.9.94.jar:lib/js.jar" -jar "lib/js.jar" -version 180 "$@"
