
# zound
![Zound Logo](https://github.com/alexcambose/zound/blob/master/public/logo.png "Zound logo")
[Demo](http://alexcambose.com:2001)

## Installation
Make sure you have Meteor installed on you machine

`git clone https://github.com/alexcambose/zound`

`cd zound && npm install`

## Building
#### Development
`meteor run`  - runs a meteor development server
#### Production
##### Android
Make sure you have Android SDK, Gradle and JDK(preferably [JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)), you also need to have `ANDROID_HOME` and `JAVA_HOME`  environment variables set.

Example:
```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/
export PATH=$JAVA_HOME/bin:$PATH
```
after these steps you should successfully run `npm run build` wich will create a *build* directory (you may need to modify the build script to fit your needs). For more info see official [meteor build docs](https://guide.meteor.com/mobile.html#installing-prerequisites-android).
##### IOS
[Meteor IOS build documentation](https://guide.meteor.com/mobile.html#installing-prerequisites-ios)


