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
#

bin=`dirname "$0"`
bin=`cd "$bin"; pwd`
${bin}/daemon.sh stop nuve
${bin}/daemon.sh stop cluster-manager
${bin}/daemon.sh stop audio-agent
${bin}/daemon.sh stop conference-agent
${bin}/daemon.sh stop recording-agent
${bin}/daemon.sh stop sip-agent
${bin}/daemon.sh stop streaming-agent
${bin}/daemon.sh stop video-agent
${bin}/daemon.sh stop webrtc-agent
${bin}/daemon.sh stop management-console
${bin}/daemon.sh stop portal
${bin}/daemon.sh stop sip-portal
${bin}/daemon.sh stop app
