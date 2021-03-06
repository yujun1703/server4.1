#!/usr/bin/env bash
#
# Copyright 2017 Intel Corporation All Rights Reserved.
#
# The source code contained or described herein and all documents related to the
# source code ("Material") are owned by Intel Corporation or its suppliers or
# licensors. Title to the Material remains with Intel Corporation or its suppliers
# and licensors. The Material contains trade secrets and proprietary and
# confidential information of Intel or its suppliers and licensors. The Material
# is protected by worldwide copyright and trade secret laws and treaty provisions.
# No part of the Material may be used, copied, reproduced, modified, published,
# uploaded, posted, transmitted, distributed, or disclosed in any way without
# Intel's prior express written permission.
#  *
# No license under any patent, copyright, trade secret or other intellectual
# property right is granted to or conferred upon you by disclosure or delivery of
# the Materials, either expressly, by implication, inducement, estoppel or
# otherwise. Any license under such intellectual property rights must be express
# and approved by Intel in writing.

this=`dirname "$0"`
this=`cd "$this"; pwd`
ROOT=`cd "${this}/.."; pwd`

export WOOGEEN_HOME=${ROOT}

LogDir=${WOOGEEN_HOME}/logs

usage() {
  echo
  echo "Rabbitmq Start Up Script"
  echo "    This script starts rabbitmq."
  echo "    This script is intended to run on a target machine."
  echo
  echo "Usage:"
  echo "    --deps (default: false)             install dependent components and libraries before rabbitmq start-up"
  echo "    --help                              print this help"
  echo
}

install_deps() {
  local OS=`${this}/detectOS.sh | awk '{print tolower($0)}'`
  echo $OS

  if [[ "$OS" =~ .*centos.* ]]
  then
    echo -e "\x1b[32mInstalling dependent components and libraries via yum...\x1b[0m"
    if [[ "$OS" =~ .*6.* ]] # CentOS 6.x
    then
      wget -c http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
      sudo rpm -Uvh epel-release-6*.rpm
    elif [[ "$OS" =~ .*7.* ]] # CentOS 7.x
    then
      wget -c http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
      sudo rpm -Uvh epel-release-latest-7*.rpm
    fi
    sudo sed -i 's/https/http/g' /etc/yum.repos.d/epel.repo
    sudo -E yum install rabbitmq-server -y
  elif [[ "$OS" =~ .*ubuntu.* ]]
  then
    echo -e "\x1b[32mInstalling dependent components and libraries via apt-get...\x1b[0m"
    sudo apt-get update
    sudo apt-get install rabbitmq-server
  else
    echo -e "\x1b[32mUnsupported platform...\x1b[0m"
  fi
}

start_up() {
  local OS=`${this}/detectOS.sh | awk '{print tolower($0)}'`

  # Use default configuration
  if [[ "$OS" =~ .*centos.* ]]
  then
    if ! sudo systemctl status rabbitmq-server >/dev/null; then
      echo "Start rabbitmq-server - \"systemctl start rabbitmq-server\""
      sudo systemctl start rabbitmq-server
    else
      echo -e "\x1b[32mRabbitmq-server already running\x1b[0m"
    fi
  elif [[ "$OS" =~ .*ubuntu.* ]]
  then
    if ! sudo service rabbitmq-server status >/dev/null; then
      echo "Start rabbitmq-server - \"service rabbitmq-server start\""
      sudo service rabbitmq-server start
    else
      echo -e "\x1b[32mRabbitmq-server already running\x1b[0m"
    fi
  fi
}

INSTALL_DEPS=false

shopt -s extglob
while [[ $# -gt 0 ]]; do
  case $1 in
    *(-)deps )
      INSTALL_DEPS=true
      ;;
    *(-)help )
      usage
      exit 0
      ;;
  esac
  shift
done

${INSTALL_DEPS} && install_deps

start_up